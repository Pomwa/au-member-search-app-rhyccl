
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { ParliamentaryMember } from '@/types/ParliamentaryMember';

interface MemberCardProps {
  member: ParliamentaryMember;
  onPress?: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/(tabs)/(home)/member/${member.id}`);
    }
  };

  const getPartyColor = (party: string) => {
    if (party.includes('Labor')) return '#e53e3e';
    if (party.includes('Liberal')) return '#3182ce';
    if (party.includes('Greens')) return '#38a169';
    if (party.includes('One Nation')) return '#d69e2e';
    if (party.includes('Country Liberal')) return '#805ad5';
    return colors.primary;
  };

  return (
    <TouchableOpacity 
      style={[commonStyles.memberCard, { borderLeftColor: getPartyColor(member.party) }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.memberHeader}>
        <Text style={commonStyles.memberName}>{member.fullName}</Text>
        <View style={[styles.chamberBadge, { backgroundColor: getPartyColor(member.party) }]}>
          <Text style={styles.chamberBadgeText}>
            {member.chamber === 'Senate' ? 'SEN' : 'MP'}
          </Text>
        </View>
      </View>
      
      <Text style={[commonStyles.memberParty, { color: getPartyColor(member.party) }]}>
        {member.party}
      </Text>
      
      <Text style={commonStyles.memberSuburb}>
        {member.electorate ? `${member.electorate}, ${member.suburb}` : member.suburb}
      </Text>
      
      <View style={styles.memberFooter}>
        <Text style={commonStyles.memberState}>
          {member.state} • {member.chamber || 'Parliament'}
        </Text>
        <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  chamberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  chamberBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
    letterSpacing: 0.5,
  },
  memberFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
});

export default MemberCard;
