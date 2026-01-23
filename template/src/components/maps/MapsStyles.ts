import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { AppConstants } from '../../constants/AppConstants';
import { windowHeight, windowWidth } from '../../styles/Dimens';
import { fontHeight } from '../../styles/Fonts';

export const createMapsStyles = (appTheme: string) => {
    const isDark = appTheme === AppConstants.dark;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? Colors.charcoal : Colors.white,
        },
        mapContainer: {
            flex: 1,
            position: 'relative',
        },
        map: {
            flex: 1,
            width: '100%',
            height: '100%',
        },
        loadingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? Colors.charcoal : Colors.lightGrey,
        },
        loadingText: {
            color: isDark ? Colors.white : Colors.charcoal,
            fontSize: fontHeight.FONT16,
            marginTop: windowHeight(12),
        },
        infoContainer: {
            backgroundColor: isDark ? Colors.grey : Colors.white,
            padding: windowHeight(16),
            borderTopWidth: 1,
            borderTopColor: isDark ? Colors.charcoal : Colors.lightGrey,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: windowHeight(8),
        },
        infoLabel: {
            color: isDark ? Colors.silver : Colors.charcoal,
            fontSize: fontHeight.FONT14,
            fontWeight: '600',
        },
        infoValue: {
            color: isDark ? Colors.white : Colors.black,
            fontSize: fontHeight.FONT14,
            fontFamily: 'monospace',
        },
        trackingIndicator: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: windowHeight(8),
            paddingTop: windowHeight(8),
            borderTopWidth: 1,
            borderTopColor: isDark ? Colors.charcoal : Colors.lightGrey,
        },
        trackingDot: {
            width: windowWidth(10),
            height: windowWidth(10),
            borderRadius: windowWidth(5),
            backgroundColor: Colors.primary,
            marginRight: windowWidth(8),
        },
        trackingText: {
            color: Colors.primary,
            fontSize: fontHeight.FONT14,
            fontWeight: '700',
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: windowHeight(20),
            backgroundColor: isDark ? Colors.charcoal : Colors.lightGrey,
        },
        errorText: {
            color: isDark ? Colors.white : Colors.charcoal,
            fontSize: fontHeight.FONT16,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: windowHeight(20),
        },
        permissionButton: {
            backgroundColor: Colors.primary,
            paddingVertical: windowHeight(14),
            paddingHorizontal: windowWidth(28),
            borderRadius: windowHeight(10),
            alignItems: 'center',
        },
        permissionButtonText: {
            color: Colors.white,
            fontSize: fontHeight.FONT16,
            fontWeight: '700',
        },
        errorBanner: {
            backgroundColor: '#ffebee',
            padding: windowHeight(12),
            marginHorizontal: windowWidth(16),
            marginBottom: windowHeight(8),
            borderRadius: windowHeight(8),
        },
        errorBannerText: {
            color: '#c62828',
            fontSize: fontHeight.FONT14,
            textAlign: 'center',
        },
        trackingButton: {
            backgroundColor: Colors.primary,
            paddingVertical: windowHeight(14),
            paddingHorizontal: windowWidth(28),
            borderRadius: windowHeight(10),
            alignItems: 'center',
            margin: windowWidth(16),
            marginTop: windowHeight(8),
        },
        trackingButtonActive: {
            backgroundColor: '#c62828',
        },
        trackingButtonText: {
            color: Colors.white,
            fontSize: fontHeight.FONT16,
            fontWeight: '700',
        },
    });
};

