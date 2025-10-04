
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Platform,
  Linking,
  Alert
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { ParliamentaryMember } from '@/types/ParliamentaryMember';
import { parliamentaryMembersService } from '@/services/parliamentaryMembersService';

export default function MemberDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Find the member by ID
  const member = parliamentaryMembersService.getMemberById(id || '');

  if (!member) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Member Not Found',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={styles.headerButton}>
                <IconSymbol name="chevron.left" size={20} color={colors.primary} />
              </Pressable>
            ),
          }}
        />
        <View style={[styles.container, styles.errorContainer]}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={colors.textSecondary} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Member not found
          </Text>
          <Pressable 
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: colors.card }]}>
              Go Back
            </Text>
          </Pressable>
        </View>
      </>
    );
  }

  const handleEmailPress = () => {
    if (member.email) {
      const emailUrl = `mailto:${member.email}`;
      Linking.canOpenURL(emailUrl).then(supported => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert('Error', 'Email client not available');
        }
      });
    }
  };

  const handlePhonePress = () => {
    if (member.phone) {
      const phoneUrl = `tel:${member.phone.replace(/[^\d+]/g, '')}`;
      Linking.canOpenURL(phoneUrl).then(supported => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Phone app not available');
        }
      });
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
    <>
      <Stack.Screen
        options={{
          title: member.fullName,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <IconSymbol name="chevron.left" size={20} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
          <View style={[styles.partyBadge, { backgroundColor: getPartyColor(member.party) }]}>
            <Text style={[styles.partyBadgeText, { color: colors.card }]}>
              {member.chamber === 'Senate' ? 'SEN' : 'MP'}
            </Text>
          </View>
          <Text style={[styles.memberName, { color: colors.text }]}>
            {member.fullName}
          </Text>
          <Text style={[styles.memberParty, { color: getPartyColor(member.party) }]}>
            {member.party}
          </Text>
        </View>

        {/* Details Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Representation Details
          </Text>
          
          <View style={styles.detailRow}>
            <IconSymbol name="building.2" size={20} color={colors.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Chamber
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {member.chamber || 'Parliament'}
              </Text>
            </View>
          </View>

          {member.electorate && (
            <View style={styles.detailRow}>
              <IconSymbol name="map" size={20} color={colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Electorate
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {member.electorate}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <IconSymbol name="location" size={20} color={colors.textSecondary} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Location
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {member.suburb}, {member.state}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contact Information
          </Text>
          
          {member.email && (
            <Pressable style={styles.contactRow} onPress={handleEmailPress}>
              <IconSymbol name="envelope" size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Email
                </Text>
                <Text style={[styles.contactValue, { color: colors.primary }]}>
                  {member.email}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </Pressable>
          )}

          {member.phone && (
            <Pressable style={styles.contactRow} onPress={handlePhonePress}>
              <IconSymbol name="phone" size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Phone
                </Text>
                <Text style={[styles.contactValue, { color: colors.primary }]}>
                  {member.phone}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: colors.highlight }]}>
          <IconSymbol name="info.circle" size={20} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            This information is sourced from the Australian Parliament House directory. 
            Contact details may be subject to change.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS !== 'ios' ? 100 : 32, // Extra padding for floating tab bar
  },
  headerButton: {
    padding: 8,
    marginLeft: -8,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  partyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  partyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  memberName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  memberParty: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  detailContent: {
    flex: 1,
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
  },
});
