import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { AppConstants } from '../../constants/AppConstants';
import { windowHeight } from '../../styles/Dimens';
import { fontHeight } from '../../styles/Fonts';

export const createAccessibilityStyles = (appTheme: string) => {
    const isDark = appTheme === AppConstants.dark;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? Colors.charcoal : Colors.white,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            padding: windowHeight(16),
            paddingBottom: windowHeight(32),
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: windowHeight(20),
        },
        errorText: {
            fontSize: fontHeight.FONT16,
            color: isDark ? Colors.white : Colors.black,
            textAlign: 'center',
        },
        section: {
            marginBottom: windowHeight(24),
            padding: windowHeight(16),
            backgroundColor: isDark ? Colors.charcoal : Colors.lightGrey,
            borderRadius: windowHeight(12),
        },
        sectionTitle: {
            fontSize: fontHeight.FONT15,
            fontWeight: 'bold',
            color: isDark ? Colors.white : Colors.black,
            marginBottom: windowHeight(16),
        },
        settingRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        settingLabel: {
            fontSize: fontHeight.FONT14,
            color: isDark ? Colors.white : Colors.black,
            flex: 1,
        },
        settingValue: {
            fontSize: fontHeight.FONT14,
            color: isDark ? Colors.lightGrey : Colors.charcoal,
            fontWeight: '700',
        },
        enabledText: {
            color: Colors.primary,
            fontWeight: 'bold',
        },
        controlRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: windowHeight(12),
            gap: windowHeight(12),
        },
        controlButton: {
            flex: 1,
            height: windowHeight(48),
            backgroundColor: Colors.primary,
            borderRadius: windowHeight(8),
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: windowHeight(48),
        },
        controlButtonDisabled: {
            backgroundColor: isDark ? Colors.charcoal : Colors.lightGrey,
            opacity: 0.5,
        },
        controlButtonText: {
            fontSize: fontHeight.FONT20,
            fontWeight: 'bold',
            color: Colors.white,
        },
        resetButton: {
            flex: 1,
            height: windowHeight(48),
            backgroundColor: isDark ? Colors.charcoal : Colors.lightGrey,
            borderRadius: windowHeight(8),
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: windowHeight(80),
        },
        resetButtonText: {
            fontSize: fontHeight.FONT13,
            fontWeight: '600',
            color: isDark ? Colors.white : Colors.black,
        },
        colorBlindOptions: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        colorBlindOption: {
            paddingHorizontal: windowHeight(16),
            paddingVertical: windowHeight(8),
            borderRadius: windowHeight(8),
            backgroundColor: isDark ? Colors.charcoal : Colors.lightGrey,
            borderWidth: 1,
            borderColor: isDark ? Colors.charcoal : Colors.lightGrey,
        },
        colorBlindOptionActive: {
            backgroundColor: Colors.primary,
            borderColor: Colors.primary,
        },
        colorBlindOptionText: {
            fontSize: fontHeight.FONT14,
            color: isDark ? Colors.white : Colors.black,
        },
        colorBlindOptionTextActive: {
            color: Colors.white,
            fontWeight: 'bold',
        },
        infoSection: {
            marginTop: windowHeight(24),
            padding: windowHeight(16),
            backgroundColor: isDark ? Colors.charcoal : Colors.lightGrey,
            borderRadius: windowHeight(12),
        },
        infoText: {
            fontSize: fontHeight.FONT14,
            color: isDark ? Colors.grey : Colors.charcoal,
            lineHeight: fontHeight.FONT20,
            textAlign: 'center',
        },
    });
};


