/**
 * MediaViewer Sub-Components
 * 
 * Extracted components for better performance and reusability
 */

import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
// @ts-ignore - react-native-video doesn't have TypeScript definitions
import Video from 'react-native-video';
import Pdf from 'react-native-pdf';
import { WebView } from 'react-native-webview';
import { MediaItem } from '../../hooks/useMediaViewer';
import { createMediaViewerStyles } from './MediaViewerStyles';
import Translate from '../../hooks/Translate';
import Colors from '../../styles/Colors';
import { FeatureFlags } from '../../config/AppConfig';

interface BaseComponentProps {
    styles: ReturnType<typeof createMediaViewerStyles>;
    media: MediaItem;
}

// Action Buttons Component
interface ActionButtonsProps {
    styles: ReturnType<typeof createMediaViewerStyles>;
    imageViewerEnabled: boolean;
    videoPlayerEnabled: boolean;
    documentViewerEnabled: boolean;
    hasSelectedMedia: boolean;
    onSelectImage: () => void;
    onSelectVideo: () => void;
    onSelectDocument: () => void;
    onClear: () => void;
}

export const ActionButtons = memo<ActionButtonsProps>(({
    styles,
    imageViewerEnabled,
    videoPlayerEnabled,
    documentViewerEnabled,
    hasSelectedMedia,
    onSelectImage,
    onSelectVideo,
    onSelectDocument,
    onClear,
}) => {
    return (
        <View style={styles.buttonContainer}>
            {imageViewerEnabled && (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onSelectImage}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>{Translate('Select Image')}</Text>
                </TouchableOpacity>
            )}

            {videoPlayerEnabled && (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onSelectVideo}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>{Translate('Select Video')}</Text>
                </TouchableOpacity>
            )}

            {documentViewerEnabled && (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onSelectDocument}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>{Translate('Select Document')}</Text>
                </TouchableOpacity>
            )}

            {hasSelectedMedia && (
                <TouchableOpacity
                    style={[styles.actionButton, styles.clearButton]}
                    onPress={onClear}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>{Translate('Clear')}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
});
ActionButtons.displayName = 'ActionButtons';

// Image Display Component
export const ImageDisplay = memo<BaseComponentProps>(({ styles, media }) => {
    const imageSource = useMemo(
        () => ({ uri: media.uri, priority: FastImage.priority.high }),
        [media.uri]
    );

    return (
        <View style={styles.imageContainer}>
            <FastImage
                source={imageSource}
                style={styles.image}
                resizeMode={FastImage.resizeMode.contain}
            />
            {media.name && <Text style={styles.mediaInfo}>{media.name}</Text>}
        </View>
    );
});
ImageDisplay.displayName = 'ImageDisplay';

// Video Display Component
interface VideoDisplayProps extends BaseComponentProps {
    error: string | null;
    onError: (error: any) => void;
    controls: boolean;
    autoplay: boolean;
    loop: boolean;
}

export const VideoDisplay = memo<VideoDisplayProps>(({
    styles,
    media,
    error,
    onError,
    controls,
    autoplay,
    loop,
}) => {
    const videoSource = useMemo(() => ({ uri: media.uri }), [media.uri]);

    if (error) {
        return (
            <View style={styles.videoContainer}>
                <View style={styles.errorView}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
                {media.name && <Text style={styles.mediaInfo}>{media.name}</Text>}
            </View>
        );
    }

    return (
        <View style={styles.videoContainer}>
            <Video
                source={videoSource}
                style={styles.video}
                controls={controls}
                paused={!autoplay}
                loop={loop}
                resizeMode="contain"
                onError={onError}
            />
            {media.name && <Text style={styles.mediaInfo}>{media.name}</Text>}
        </View>
    );
});
VideoDisplay.displayName = 'VideoDisplay';

// PDF Display Component
interface PdfDisplayProps extends BaseComponentProps {
    isLoading: boolean;
    documentUri: string | null;
    onError: (error: any) => void;
}

export const PdfDisplay = memo<PdfDisplayProps>(({
    styles,
    media,
    isLoading,
    documentUri,
    onError,
}) => {
    const pdfSource = useMemo(
        () => (documentUri ? { uri: `file://${documentUri}`, cache: true } : null),
        [documentUri]
    );

    if (isLoading || !pdfSource) {
        return (
            <View style={styles.pdfContainer}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>{Translate('Loading PDF...')}</Text>
                </View>
                {media.name && <Text style={styles.mediaInfo}>{media.name}</Text>}
            </View>
        );
    }

    return (
        <View style={styles.pdfContainer}>
            <Pdf
                source={pdfSource}
                style={styles.pdf}
                onLoadComplete={(numberOfPages) => {
                    console.log(`PDF loaded: ${numberOfPages} pages`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Page ${page} of ${numberOfPages}`);
                }}
                onError={onError}
            />
            {media.name && <Text style={styles.mediaInfo}>{media.name}</Text>}
        </View>
    );
});
PdfDisplay.displayName = 'PdfDisplay';

// Text Document Display Component
interface TextDocumentDisplayProps extends BaseComponentProps {
    content: string | null;
}

export const TextDocumentDisplay = memo<TextDocumentDisplayProps>(({
    styles,
    media,
    content,
}) => {
    if (content === null) return null;

    return (
        <View style={styles.textDocumentContainer}>
            <ScrollView style={styles.textDocumentScrollView}>
                <Text style={styles.textDocumentContent}>{content}</Text>
            </ScrollView>
            {media.name && <Text style={styles.mediaInfo}>{media.name}</Text>}
        </View>
    );
});
TextDocumentDisplay.displayName = 'TextDocumentDisplay';

// WebView Document Display Component
interface WebViewDocumentDisplayProps extends BaseComponentProps {
    documentBase64: string | null;
    onError: (syntheticEvent: any) => void;
    onHttpError: (syntheticEvent: any) => void;
}

export const WebViewDocumentDisplay = memo<WebViewDocumentDisplayProps>(({
    styles,
    media,
    documentBase64,
    onError,
    onHttpError,
}) => {
    const webViewSource = useMemo(
        () => (documentBase64 ? { uri: documentBase64 } : null),
        [documentBase64]
    );

    if (!webViewSource) return null;

    return (
        <View style={styles.webViewContainer}>
            <WebView
                source={webViewSource}
                style={styles.webView}
                originWhitelist={['*']}
                allowFileAccess={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onError={onError}
                onHttpError={onHttpError}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                )}
            />
            {media.name && <Text style={styles.mediaInfo}>{media.name}</Text>}
        </View>
    );
});
WebViewDocumentDisplay.displayName = 'WebViewDocumentDisplay';

// Empty State Component
export const EmptyState = memo<{ styles: ReturnType<typeof createMediaViewerStyles> }>(({ styles }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{Translate('No media selected')}</Text>
        <Text style={styles.emptySubtext}>
            {Translate('Select an image, video, or document to view')}
        </Text>
    </View>
));
EmptyState.displayName = 'EmptyState';

// Loading Indicator Component
export const LoadingIndicator = memo<{ styles: ReturnType<typeof createMediaViewerStyles> }>(({ styles }) => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{Translate('Loading...')}</Text>
    </View>
));
LoadingIndicator.displayName = 'LoadingIndicator';

