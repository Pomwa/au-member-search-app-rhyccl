
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export const AppInfo: React.FC = () => {
  const features = [
    {
      icon: 'magnifyingglass',
      title: 'Search Members',
      description: 'Find parliamentary members by name, party, suburb, or electorate'
    },
    {
      icon: 'map',
      title: 'Filter by State',
      description: 'Filter results by Australian states and territories'
    },
    {
      icon: 'person.2',
      title: 'Contact Information',
      description: 'Access email and phone contact details for each member'
    },
    {
      icon: 'arrow.clockwise',
      title: 'Daily Updates',
      description: 'Data is automatically updated daily to ensure accuracy'
    },
    {
      icon: 'building.2',
      title: 'Chamber Information',
      description: 'View whether members serve in the House of Representatives or Senate'
    },
    {
      icon: 'location',
      title: 'Electorate Details',
      description: 'See which electorate or region each member represents'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
          <IconSymbol name="building.2" size={32} color={colors.card} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          Australian Parliamentary Members Search
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Find and connect with your representatives
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Features
        </Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.highlight }]}>
              <IconSymbol name={feature.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          How to Use
        </Text>
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepNumberText, { color: colors.card }]}>1</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>
              Use the search bar to find members by name, party, or location
            </Text>
          </View>
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepNumberText, { color: colors.card }]}>2</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>
              Filter by state or territory using the filter buttons
            </Text>
          </View>
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepNumberText, { color: colors.card }]}>3</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>
              Tap on any member to view their detailed information and contact details
            </Text>
          </View>
          <View style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepNumberText, { color: colors.card }]}>4</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>
              Pull down to refresh and get the latest member information
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.infoSection, { backgroundColor: colors.highlight }]}>
        <IconSymbol name="info.circle" size={20} color={colors.textSecondary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            Data Source
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            All information is sourced from the Australian Parliament House directory. 
            The app automatically updates daily to ensure you have the most current 
            information about your parliamentary representatives.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  stepContainer: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AppInfo;
