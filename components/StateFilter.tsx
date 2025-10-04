
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Pressable } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { AUSTRALIAN_STATES } from '@/types/ParliamentaryMember';

interface StateFilterProps {
  selectedState: string;
  onStateSelect: (state: string) => void;
}

export const StateFilter: React.FC<StateFilterProps> = ({
  selectedState,
  onStateSelect,
}) => {
  const renderStateChip = (state: string) => (
    <Pressable
      key={state}
      style={[
        styles.stateChip,
        selectedState === state && styles.stateChipSelected
      ]}
      onPress={() => onStateSelect(state)}
    >
      <Text style={[
        styles.stateChipText,
        selectedState === state && styles.stateChipTextSelected
      ]}>
        {state}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filter by State/Territory:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {AUSTRALIAN_STATES.map(renderStateChip)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  scrollView: {
    marginHorizontal: -4,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  stateChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    borderWidth: 1,
    borderColor: colors.highlight,
    marginRight: 8,
  },
  stateChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  stateChipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stateChipTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },
});

export default StateFilter;
