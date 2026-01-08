import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { AppConstants } from '../../constants/AppConstants';
import { windowHeight, windowWidth } from '../../styles/Dimens';
import { fontHeight } from '../../styles/Fonts';
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const createMediaViewerStyles = (appTheme: string) => {
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
            padding: windowWidth(16),
        },
        buttonContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: windowWidth(12),
            marginBottom: windowHeight(20),
        },
        actionButton: {
            backgroundColor: Colors.primary,
            paddingVertical: windowHeight(12),
            paddingHorizontal: windowWidth(20),
            borderRadius: windowHeight(10),
            alignItems: 'center',
            minWidth: windowWidth(120),
            flex: 1,
        },
        actionButtonText: {
            color: Colors.white,
            fontSize: fontHeight.FONT14,
            fontWeight: '700',
        },
        clearButton: {
            backgroundColor: '#c62828',
        },
        mediaContainer: {
            marginTop: windowHeight(10),
            borderRadius: windowHeight(12),
            overflow: 'hidden',
            backgroundColor: isDark ? Colors.grey : Colors.lightGrey,
            padding: windowWidth(10),
        },
        imageContainer: {
            width: '100%',
            minHeight: windowHeight(300),
            alignItems: 'center',
            justifyContent: 'center',
        },
        image: {
            width: screenWidth - windowWidth(52),
            height: screenHeight * 0.5,
            borderRadius: windowHeight(8),
        },
        videoContainer: {
            width: '100%',
            minHeight: windowHeight(300),
            alignItems: 'center',
            justifyContent: 'center',
        },
        video: {
            width: screenWidth - windowWidth(52),
            height: screenHeight * 0.4,
            borderRadius: windowHeight(8),
        },
        documentContainer: {
            width: '100%',
            minHeight: windowHeight(400),
        },
        pdfContainer: {
            width: '100%',
            height: screenHeight * 0.6,
            borderRadius: windowHeight(8),
            overflow: 'hidden',
        },
        pdf: {
            flex: 1,
            width: screenWidth - windowWidth(52),
        },
        documentInfoContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: windowHeight(40),
        },
        documentIcon: {
            fontSize: fontHeight.FONT48,
            marginBottom: windowHeight(16),
        },
        documentName: {
            color: isDark ? Colors.white : Colors.charcoal,
            fontSize: fontHeight.FONT16,
            fontWeight: '600',
            marginBottom: windowHeight(8),
            textAlign: 'center',
        },
        documentSize: {
            color: isDark ? Colors.silver : Colors.charcoal,
            fontSize: fontHeight.FONT14,
            marginBottom: windowHeight(20),
        },
        openButton: {
            backgroundColor: Colors.primary,
            paddingVertical: windowHeight(12),
            paddingHorizontal: windowWidth(24),
            borderRadius: windowHeight(10),
            alignItems: 'center',
        },
        openButtonText: {
            color: Colors.white,
            fontSize: fontHeight.FONT14,
            fontWeight: '700',
        },
        mediaInfo: {
            color: isDark ? Colors.silver : Colors.charcoal,
            fontSize: fontHeight.FONT12,
            marginTop: windowHeight(8),
            textAlign: 'center',
        },
        emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: windowHeight(60),
        },
        emptyText: {
            color: isDark ? Colors.white : Colors.charcoal,
            fontSize: fontHeight.FONT18,
            fontWeight: '600',
            marginBottom: windowHeight(8),
        },
        emptySubtext: {
            color: isDark ? Colors.silver : Colors.charcoal,
            fontSize: fontHeight.FONT14,
            textAlign: 'center',
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: windowHeight(20),
        },
        errorText: {
            color: isDark ? Colors.white : Colors.charcoal,
            fontSize: fontHeight.FONT16,
            fontWeight: '600',
            textAlign: 'center',
        },
        errorView: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: windowHeight(40),
        },
        loadingContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: windowHeight(20),
        },
        loadingText: {
            color: isDark ? Colors.white : Colors.charcoal,
            fontSize: fontHeight.FONT14,
            marginTop: windowHeight(12),
        },
        textDocumentContainer: {
            width: '100%',
            height: screenHeight * 0.6,
            backgroundColor: isDark ? Colors.charcoal : Colors.white,
            borderRadius: windowHeight(8),
            overflow: 'hidden',
        },
        textDocumentScrollView: {
            flex: 1,
            padding: windowWidth(16),
        },
        textDocumentContent: {
            color: isDark ? Colors.white : Colors.charcoal,
            fontSize: fontHeight.FONT14,
            lineHeight: fontHeight.FONT20,
            fontFamily: 'monospace',
        },
        loadingIndicator: {
            marginVertical: windowHeight(20),
        },
        webViewContainer: {
            width: '100%',
            height: screenHeight * 0.6,
            borderRadius: windowHeight(8),
            overflow: 'hidden',
            backgroundColor: isDark ? Colors.charcoal : Colors.white,
        },
        webView: {
            flex: 1,
            backgroundColor: isDark ? Colors.charcoal : Colors.white,
        },
    });
};

