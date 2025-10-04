
import React, { useState, useMemo } from "react";
import { Stack } from "expo-router";
import { 
  FlatList, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Alert, 
  Platform, 
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { ParliamentaryMember, AUSTRALIAN_STATES } from "@/types/ParliamentaryMember";
import { useParliamentaryMembers } from "@/hooks/useParliamentaryMembers";
import { MemberCard } from "@/components/MemberCard";
import { SearchBar } from "@/components/SearchBar";

export default function HomeScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  
  const { 
    members, 
    loading, 
    refreshing, 
    error, 
    refreshMembers, 
    searchMembers 
  } = useParliamentaryMembers();

  const states = AUSTRALIAN_STATES;

  // Filter members based on search query and selected state
  const filteredMembers = useMemo(() => {
    return searchMembers(searchQuery, selectedState);
  }, [searchMembers, searchQuery, selectedState]);

  const onRefresh = async () => {
    await refreshMembers();
    if (error) {
      Alert.alert('Update Failed', error);
    }
  };

  const renderMember = ({ item }: { item: ParliamentaryMember }) => (
    <MemberCard member={item} />
  );

  const renderStateFilter = () => (
    <View style={styles.stateFilterContainer}>
      <FlatList
        horizontal
        data={states}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.stateFilterButton,
              selectedState === item && styles.stateFilterButtonActive
            ]}
            onPress={() => setSelectedState(item)}
          >
            <Text style={[
              styles.stateFilterText,
              selectedState === item && styles.stateFilterTextActive
            ]}>
              {item}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );

  const renderHeaderRight = () => (
    <Pressable
      onPress={onRefresh}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="arrow.clockwise" color={colors.primary} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => Alert.alert("Info", "Australian Parliamentary Members Search\n\nSearch by name, party, suburb, or electorate.\nFilter by state/territory.\nPull down to refresh data.")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="info.circle" color={colors.primary} />
    </Pressable>
  );

  if (loading) {
    return (
      <>
        {Platform.OS === 'ios' && (
          <Stack.Screen
            options={{
              title: "Parliamentary Members",
              headerRight: renderHeaderRight,
              headerLeft: renderHeaderLeft,
            }}
          />
        )}
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading Parliamentary Members...
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Parliamentary Members",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, party, suburb..."
        />
        
        {renderStateFilter()}
        
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
            {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        <FlatList
          data={filteredMembers}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No members found matching your search
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  stateFilterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  stateFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  stateFilterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stateFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  stateFilterTextActive: {
    color: colors.card,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  headerButtonContainer: {
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },

});
