import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { AppConstants } from '../../constants/AppConstants';

export const createScreenTwoStyles = (appTheme: string) => {
  const isDark = appTheme === AppConstants.dark;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? Colors.charcoal : Colors.lightGrey,
    },
    scrollContent: {
      padding: 16,
    },
    headerText: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? Colors.white : Colors.charcoal,
      marginBottom: 20,
      letterSpacing: 0.5,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: isDark ? Colors.charcoal : Colors.white,
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    tabActive: {
      backgroundColor: Colors.primary,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    tabIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.primary,
    },
    tabIndicatorActive: {
      backgroundColor: Colors.white,
    },
    tabIndicatorWiFi: {
      backgroundColor: Colors.accent,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? Colors.silver : Colors.accent,
    },
    tabTextActive: {
      color: Colors.white,
      fontWeight: '700',
    },
    navigateButton: {
      backgroundColor: Colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      marginTop: 20,
      alignItems: 'center',
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    navigateButtonText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
  });
};

