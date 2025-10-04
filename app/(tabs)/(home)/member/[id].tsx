
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Platform,
  Linking,
  Alert,
  Image
} from 'react-native';
import { ParliamentaryMember } from '@/types/ParliamentaryMember';
import { colors, commonStyles } from '@/styles/commonStyles';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { parliamentaryMembersService } from '@/services/parliamentaryMembersService';
import { IconSymbol } from '@/components/IconSymbol';

const MemberDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [member, setMember] = useState<ParliamentaryMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMember = async () => {
      if (id) {
        try {
          // First try to get from service
          let foundMember = parliamentaryMembersService.getMemberById(id);
          
          if (!foundMember) {
            // If not found, fetch all members and try again
            await parliamentaryMembersService.fetchMembers();
            foundMember = parliamentaryMembersService.getMemberById(id);
          }
          
          setMember(foundMember || null);
        } catch (error) {
          console.error('Error loading member:', error);
          Alert.alert('Error', 'Failed to load member details');
        }
      }
      setLoading(false);
    };

    loadMember();
  }, [id]);

  const handleEmailPress = () => {
    if (member?.email) {
      const emailUrl = `mailto:${member.email}`;
      Linking.openURL(emailUrl).catch(() => {
        Alert.alert('Error', 'Could not open email client');
      });
    }
  };

  const handlePhonePress = () => {
    if (member?.phone) {
      const phoneUrl = Platform.OS === 'ios' ? `tel:${member.phone}` : `tel:${member.phone}`;
      Linking.openURL(phoneUrl).catch(() => {
        Alert.alert('Error', 'Could not open phone dialer');
      });
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

  const getRoleInfo = () => {
    const roles = [];
    if (member?.isMinister) roles.push('Minister');
    if (member?.isShadowMinister) roles.push('Shadow Minister');
    return roles;
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <Text style={styles.loadingText}>Loading member details...</Text>
      </View>
    );
  }

  if (!member) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <Stack.Screen options={{ title: 'Member Not Found' }} />
        <IconSymbol name="person.slash" size={64} color={colors.textSecondary} />
        <Text style={styles.errorText}>Member not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const roles = getRoleInfo();

  return (
    <View style={commonStyles.container}>
      <Stack.Screen 
        options={{ 
          title: member.fullName,
          headerBackTitle: 'Members',
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section with Photo */}
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
                <IconSymbol name="person.circle" size={80} color={colors.textSecondary} />
              </View>
            )}
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{member.fullName}</Text>
            
            {roles.length > 0 && (
              <View style={styles.rolesContainer}>
                {roles.map((role, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.roleTag, 
                      { backgroundColor: role === 'Minister' ? '#FFD700' : '#C0C0C0' }
                    ]}
                  >
                    <Text style={styles.roleTagText}>{role}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={[styles.partyContainer, { backgroundColor: getPartyColor(member.party) + '20' }]}>
              <View style={[styles.partyIndicator, { backgroundColor: getPartyColor(member.party) }]} />
              <Text style={[styles.party, { color: getPartyColor(member.party) }]}>
                {member.party}
              </Text>
            </View>
          </View>
        </View>

        {/* Location Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="location" size={20} color={colors.accent} />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>State:</Text>
            <Text style={styles.infoValue}>{member.state}</Text>
          </View>
          
          {member.electorate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Electorate:</Text>
              <Text style={styles.infoValue}>{member.electorate}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Suburb:</Text>
            <Text style={styles.infoValue}>{member.suburb}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chamber:</Text>
            <Text style={styles.infoValue}>{member.chamber}</Text>
          </View>
        </View>

        {/* Portfolios */}
        {member.portfolios && member.portfolios.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="briefcase" size={20} color={colors.accent} />
              <Text style={styles.sectionTitle}>Portfolios</Text>
            </View>
            
            {member.portfolios.map((portfolio, index) => (
              <View key={index} style={styles.portfolioItem}>
                <View style={styles.portfolioBullet} />
                <Text style={styles.portfolioText}>{portfolio}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="phone" size={20} color={colors.accent} />
            <Text style={styles.sectionTitle}>Contact</Text>
          </View>
          
          {member.email && (
            <Pressable style={styles.contactItem} onPress={handleEmailPress}>
              <IconSymbol name="envelope" size={18} color={colors.accent} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{member.email}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </Pressable>
          )}
          
          {member.phone && (
            <Pressable style={styles.contactItem} onPress={handlePhonePress}>
              <IconSymbol name="phone" size={18} color={colors.accent} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{member.phone}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Last Updated */}
        {member.lastUpdated && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="clock" size={20} color={colors.textSecondary} />
              <Text style={styles.sectionTitle}>Last Updated</Text>
            </View>
            
            <Text style={styles.lastUpdated}>
              {new Date(member.lastUpdated).toLocaleString()}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  headerSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  photoContainer: {
    marginRight: 16,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.highlight,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  roleTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  partyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
  },
  section: {
    backgroundColor: colors.card,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  portfolioItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  portfolioBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 6,
    marginRight: 12,
  },
  portfolioText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: colors.text,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MemberDetailsScreen;
