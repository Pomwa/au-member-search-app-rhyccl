import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  background: '#f0f4f7',     // Light gray for a clean look
  text: '#2d3436',           // Dark gray for readability
  textSecondary: '#747d8c',  // Medium gray for less important information
  primary: '#007bff',        // A classic blue for interactive elements
  secondary: '#6c757d',      // A softer gray for accents
  accent: '#ffc107',         // A yellow for highlights
  card: '#ffffff',           // White for content containers
  highlight: '#e9ecef',      // A lighter gray for subtle emphasis
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.highlight,
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderColor: colors.highlight,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  memberCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  memberParty: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 2,
  },
  memberSuburb: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  memberState: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
