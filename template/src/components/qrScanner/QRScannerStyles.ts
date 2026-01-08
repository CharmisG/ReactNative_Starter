import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { AppConstants } from '../../constants/AppConstants';
import { windowHeight, windowWidth } from '../../styles/Dimens';
import { fontHeight } from '../../styles/Fonts';

export const createQRScannerStyles = (appTheme: string) => {
    const isDark = appTheme === AppConstants.dark;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? Colors.charcoal : Colors.black,
        },
        scannerContainer: {
            flex: 1,
        },
        overlay: {
            flex: 1,
            backgroundColor: 'transparent',
        },
        topOverlay: {
        },
        bottomOverlay: {
        },
        leftOverlay: {
        },
        rightOverlay: {
        },
        scanArea: {
            width: windowWidth(250),
            height: windowWidth(250),
            borderWidth: 2,
            borderColor: Colors.primary,
            borderRadius: windowHeight(20),
            backgroundColor: 'transparent',
        },
        corner: {
            width: windowWidth(30),
            height: windowHeight(30),
            borderColor: Colors.primary,
        },
        topLeft: {
            borderTopWidth: 4,
            borderLeftWidth: 4,
            borderTopLeftRadius: windowHeight(20),
        },
        topRight: {
            borderTopWidth: 4,
            borderRightWidth: 4,
            borderTopRightRadius: windowHeight(20),
        },
        bottomLeft: {
            borderBottomWidth: 4,
            borderLeftWidth: 4,
            borderBottomLeftRadius: windowHeight(20),
        },
        bottomRight: {
            borderBottomWidth: 4,
            borderRightWidth: 4,
            borderBottomRightRadius: windowHeight(20),
        },
        instructionContainer: {
            position: 'absolute',
            bottom: windowHeight(100),
            left: 0,
            right: 0,
            alignItems: 'center',
            paddingHorizontal: windowWidth(20),
        },
        instructionText: {
            color: Colors.white,
            fontSize: fontHeight.FONT16,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: windowHeight(8),
        },
        instructionSubtext: {
            color: Colors.silver,
            fontSize: fontHeight.FONT14,
            textAlign: 'center',
        },
        resultContainer: {
            position: 'absolute',
            top: windowHeight(100),
            left: windowWidth(20),
            right: windowWidth(20),
            backgroundColor: isDark ? Colors.charcoal : Colors.white,
            padding: windowHeight(16),
            borderRadius: windowHeight(12),
            borderWidth: 1,
            borderColor: Colors.primary,
        },
        resultTitle: {
            color: isDark ? Colors.white : Colors.charcoal,
            fontSize: fontHeight.FONT16,
            fontWeight: '700',
            marginBottom: windowHeight(8),
        },
        resultText: {
            color: isDark ? Colors.silver : Colors.charcoal,
            fontSize: fontHeight.FONT14,
            marginBottom: windowHeight(12),
        },
        resultButton: {
            backgroundColor: Colors.primary,
            paddingVertical: windowHeight(10),
            paddingHorizontal: windowWidth(20),
            borderRadius: windowHeight(8),
            alignItems: 'center',
        },
        resultButtonText: {
            color: Colors.white,
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
        galleryButton: {
            position: 'absolute',
            top: windowHeight(20),
            right: windowWidth(20),
            backgroundColor: Colors.primary,
            paddingVertical: windowHeight(12),
            paddingHorizontal: windowWidth(20),
            borderRadius: windowHeight(10),
            flexDirection: 'row',
            alignItems: 'center',
            gap: windowWidth(8),
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: windowHeight(2) },
            shadowOpacity: 0.3,
            shadowRadius: windowHeight(4),
            elevation: 5,
        },
        galleryButtonText: {
            color: Colors.white,
            fontSize: fontHeight.FONT14,
            fontWeight: '700',
        },
    });
};

