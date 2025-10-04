
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
import { colors } from "@/styles/commonStyles";
import { MemberCard } from "@/components/MemberCard";
import { useParliamentaryMembers } from "@/hooks/useParliamentaryMembers";
import React, { useState, useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { IconSymbol } from "@/components/IconSymbol";
import { ParliamentaryMember, AUSTRALIAN_STATES } from "@/types/ParliamentaryMember";
import { SearchBar } from "@/components/SearchBar";
import { StateFilter } from "@/components/StateFilter";

const HomeScreen = () => {
  const { colors: themeColors } = useTheme();
  const { members, loading, refreshing, error, refreshMembers } = useParliamentaryMembers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedChamber, setSelectedChamber] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter members based on search and filters
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      // Search query filter
      const matchesSearch = searchQuery === '' || 
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.suburb.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.electorate && member.electorate.toLowerCase().includes(searchQuery.toLowerCase())) ||
        member.portfolios.some(portfolio => portfolio.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // State filter
      const matchesState = selectedState === 'All' || member.state === selectedState;
      
      // Chamber filter
      const matchesChamber = selectedChamber === 'All' || member.chamber === selectedChamber;
      
      // Role filter
      const matchesRole = selectedRole === 'All' || 
        (selectedRole === 'Ministers' && member.isMinister) ||
        (selectedRole === 'Shadow Ministers' && member.isShadowMinister) ||
        (selectedRole === 'Regular Members' && !member.isMinister && !member.isShadowMinister);
      
      return matchesSearch && matchesState && matchesChamber && matchesRole;
    });
  }, [members, searchQuery, selectedState, selectedChamber, selectedRole]);

  const onRefresh = async () => {
    try {
      await refreshMembers();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh data');
    }
  };

  const renderMember = ({ item }: { item: ParliamentaryMember }) => (
    <MemberCard member={item} />
  );

  const renderFilterChip = (
    label: string, 
    value: string, 
    selectedValue: string, 
    onSelect: (value: string) => void
  ) => (
    <Pressable
      style={[
        styles.filterChip,
        selectedValue === value && styles.filterChipSelected
      ]}
      onPress={() => onSelect(value)}
    >
      <Text style={[
        styles.filterChipText,
        selectedValue === value && styles.filterChipTextSelected
      ]}>
        {label}
      </Text>
    </Pressable>
  );

  const renderAdvancedFilters = () => (
    <View style={styles.advancedFiltersContainer}>
      {/* Chamber Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Chamber:</Text>
        <View style={styles.filterChips}>
          {['All', 'Senate', 'House of Representatives'].map(chamber => 
            renderFilterChip(chamber, chamber, selectedChamber, setSelectedChamber)
          )}
        </View>
      </View>

      {/* Role Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Role:</Text>
        <View style={styles.filterChips}>
          {['All', 'Ministers', 'Shadow Ministers', 'Regular Members'].map(role => 
            renderFilterChip(role, role, selectedRole, setSelectedRole)
          )}
        </View>
      </View>
    </View>
  );

  const renderHeaderRight = () => (
    <Pressable 
      style={styles.headerButton}
      onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
    >
      <IconSymbol 
        name={showAdvancedFilters ? "line.horizontal.3.decrease.circle.fill" : "line.horizontal.3.decrease.circle"} 
        size={24} 
        color={colors.text} 
      />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <View style={styles.headerLeft}>
      <Text style={styles.headerTitle}>Parliament</Text>
      <Text style={styles.headerSubtitle}>
        {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search members, parties, portfolios..."
      />
      
      <StateFilter
        selectedState={selectedState}
        onStateSelect={setSelectedState}
      />
      
      {showAdvancedFilters && renderAdvancedFilters()}
      
      {error && (
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {filteredMembers.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No members found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search or filters
          </Text>
        </View>
      )}
    </View>
  );

  if (loading && members.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen 
          options={{ 
            title: 'Loading...',
            headerLeft: () => null,
            headerRight: () => null,
          }} 
        />
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading parliamentary members...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerLeft: renderHeaderLeft,
          headerRight: renderHeaderRight,
          headerTitle: '',
        }} 
      />
      
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100, // Space for floating tab bar
  },
  headerLeft: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerButton: {
    marginRight: 16,
    padding: 4,
  },
  advancedFiltersContainer: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  filterChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '20',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginLeft: 8,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
