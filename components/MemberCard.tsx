
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ParliamentaryMember } from '@/types/ParliamentaryMember';
import { colors, commonStyles } from '@/styles/commonStyles';
import { router } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/components/IconSymbol';

interface MemberCardProps {
  member: ParliamentaryMember;
  onPress?: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/(tabs)/(home)/member/${member.id}`);
    }
  };

  const getPartyColor = (party: string): string => {
    const partyColors: { [key: string]: string } = {
      'Australian Labor Party': '#FF6B6B',
      'Liberal Party of Australia': '#4ECDC4',
      'Australian Greens': '#45B7D1',
      'One Nation': '#FFA07A',
      'Independent': '#98D8C8',
      'Country Liberal Party': '#F7DC6F',
    };
    return partyColors[party] || colors.accent;
  };

  const getRoleIndicator = () => {
    if (member.isMinister) {
      return (
        <View style={[styles.roleIndicator, { backgroundColor: '#FFD700' }]}>
          <Text style={styles.roleText}>Minister</Text>
        </View>
      );
    }
    if (member.isShadowMinister) {
      return (
        <View style={[styles.roleIndicator, { backgroundColor: '#C0C0C0' }]}>
          <Text style={styles.roleText}>Shadow</Text>
        </View>
      );
    }
    return null;
  };

  const formatPortfolios = (portfolios: string[]): string => {
    if (!portfolios || portfolios.length === 0) return 'No portfolios listed';
    if (portfolios.length === 1) return portfolios[0];
    if (portfolios.length === 2) return portfolios.join(' & ');
    return `${portfolios[0]} & ${portfolios.length - 1} more`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.content}>
        {/* Photo and basic info */}
        <View style={styles.headerSection}>
          <View style={styles.photoContainer}>
            {member.photoUrl ? (
              <Image 
                source={{ uri: member.photoUrl }} 
                style={styles.photo}
                defaultSource={require('@/assets/images/natively-dark.png')}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <IconSymbol name="person.circle" size={40} color={colors.textSecondary} />
              </View>
            )}
          </View>
          
          <View style={styles.basicInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={2}>
                {member.fullName}
              </Text>
              {getRoleIndicator()}
            </View>
            
            <View style={styles.locationRow}>
              <IconSymbol name="location" size={14} color={colors.textSecondary} />
              <Text style={styles.location}>
                {member.electorate ? `${member.electorate}, ${member.state}` : `${member.suburb}, ${member.state}`}
              </Text>
            </View>
            
            <View style={styles.chamberRow}>
              <IconSymbol name="building.2" size={14} color={colors.textSecondary} />
              <Text style={styles.chamber}>{member.chamber}</Text>
            </View>
          </View>
        </View>

        {/* Party */}
        <View style={[styles.partyContainer, { backgroundColor: getPartyColor(member.party) + '20' }]}>
          <View style={[styles.partyIndicator, { backgroundColor: getPartyColor(member.party) }]} />
          <Text style={[styles.party, { color: getPartyColor(member.party) }]} numberOfLines={1}>
            {member.party}
          </Text>
        </View>

        {/* Portfolios */}
        {member.portfolios && member.portfolios.length > 0 && (
          <View style={styles.portfoliosSection}>
            <View style={styles.portfoliosHeader}>
              <IconSymbol name="briefcase" size={14} color={colors.textSecondary} />
              <Text style={styles.portfoliosLabel}>Portfolios:</Text>
            </View>
            <Text style={styles.portfolios} numberOfLines={2}>
              {formatPortfolios(member.portfolios)}
            </Text>
          </View>
        )}

        {/* Contact info preview */}
        <View style={styles.contactSection}>
          {member.email && (
            <View style={styles.contactItem}>
              <IconSymbol name="envelope" size={12} color={colors.textSecondary} />
              <Text style={styles.contactText} numberOfLines={1}>
                {member.email}
              </Text>
            </View>
          )}
          {member.phone && (
            <View style={styles.contactItem}>
              <IconSymbol name="phone" size={12} color={colors.textSecondary} />
              <Text style={styles.contactText} numberOfLines={1}>
                {member.phone}
              </Text>
            </View>
          )}
        </View>

        {/* Last updated indicator */}
        {member.lastUpdated && (
          <View style={styles.updateIndicator}>
            <IconSymbol name="clock" size={10} color={colors.textTertiary} />
            <Text style={styles.updateText}>
              Updated {new Date(member.lastUpdated).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {/* Arrow indicator */}
      <View style={styles.arrowContainer}>
        <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  photoContainer: {
    marginRight: 12,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.highlight,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  roleIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  chamberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chamber: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  partyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  partyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  party: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  portfoliosSection: {
    marginBottom: 12,
  },
  portfoliosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  portfoliosLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  portfolios: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
  },
  contactSection: {
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  contactText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  updateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateText: {
    fontSize: 10,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  arrowContainer: {
    paddingRight: 16,
    paddingLeft: 8,
  },
});

export { MemberCard };
export default MemberCard;
