import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MediaItem } from '../../hooks/useMediaViewer';
import { createMediaViewerStyles } from './MediaViewerStyles';
import {
    ImageDisplay,
    VideoDisplay,
    PdfDisplay,
    TextDocumentDisplay,
    WebViewDocumentDisplay,
} from './MediaViewerComponents';
import Translate from '../../hooks/Translate';
import Colors from '../../styles/Colors';
import { ActivityIndicator } from 'react-native';

interface MediaDisplayProps {
    styles: ReturnType<typeof createMediaViewerStyles>;
    selectedMedia: MediaItem | null;
    imageViewerEnabled: boolean;
    videoPlayerEnabled: boolean;
    documentViewerEnabled: boolean;
    videoError: string | null;
    pdfError: string | null;
    documentError: string | null;
    documentContent: string | null;
    documentUri: string | null;
    documentBase64: string | null;
    isPdfFile: boolean;
    isTextFile: boolean;
    videoControls: boolean;
    videoAutoplay: boolean;
    videoLoop: boolean;
    documentProcessingState: {
        isLoading: boolean;
        hasError: boolean;
        hasUri: boolean;
        hasBase64: boolean;
        hasContent: boolean;
    };
    onOpenDocument: () => void;
    onVideoError: (error: any) => void;
    onPdfError: (error: any) => void;
    onWebViewError: (syntheticEvent: any) => void;
    onWebViewHttpError: (syntheticEvent: any) => void;
}

export const MediaDisplay = memo<MediaDisplayProps>(({
    styles,
    selectedMedia,
    imageViewerEnabled,
    videoPlayerEnabled,
    documentViewerEnabled,
    videoError,
    pdfError,
    documentError,
    documentContent,
    documentUri,
    documentBase64,
    isPdfFile,
    isTextFile,
    videoControls,
    videoAutoplay,
    videoLoop,
    documentProcessingState,
    onOpenDocument,
    onVideoError,
    onPdfError,
    onWebViewError,
    onWebViewHttpError,
}) => {
    if (!selectedMedia) return null;

    return (
        <View style={styles.mediaContainer}>
            {selectedMedia.type === 'image' && imageViewerEnabled && (
                <ImageDisplay styles={styles} media={selectedMedia} />
            )}

            {selectedMedia.type === 'video' && videoPlayerEnabled && (
                <VideoDisplay
                    styles={styles}
                    media={selectedMedia}
                    error={videoError}
                    onError={onVideoError}
                    controls={videoControls}
                    autoplay={videoAutoplay}
                    loop={videoLoop}
                />
            )}

            {selectedMedia.type === 'document' && documentViewerEnabled && (
                <View style={styles.documentContainer}>
                    {pdfError ? (
                        <View style={styles.errorView}>
                            <Text style={styles.errorText}>{pdfError}</Text>
                            <TouchableOpacity
                                style={styles.openButton}
                                onPress={onOpenDocument}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.openButtonText}>
                                    {Translate('Open with External App')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : isPdfFile ? (
                        <PdfDisplay
                            styles={styles}
                            media={selectedMedia}
                            isLoading={documentProcessingState.isLoading}
                            documentUri={documentUri}
                            onError={onPdfError}
                        />
                    ) : isTextFile && documentContent !== null ? (
                        <TextDocumentDisplay
                            styles={styles}
                            media={selectedMedia}
                            content={documentContent}
                        />
                    ) : selectedMedia.name ? (
                        <View style={styles.documentContainer}>
                            {documentProcessingState.isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                    <Text style={styles.loadingText}>
                                        {Translate('Loading document...')}
                                    </Text>
                                </View>
                            ) : documentProcessingState.hasError ? (
                                <View style={styles.errorView}>
                                    <Text style={styles.errorText}>{documentError}</Text>
                                    <TouchableOpacity
                                        style={styles.openButton}
                                        onPress={onOpenDocument}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.openButtonText}>
                                            {Translate('Open with External App')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : documentProcessingState.hasBase64 ? (
                                <WebViewDocumentDisplay
                                    styles={styles}
                                    media={selectedMedia}
                                    documentBase64={documentBase64}
                                    onError={onWebViewError}
                                    onHttpError={onWebViewHttpError}
                                />
                            ) : (
                                <View style={styles.documentInfoContainer}>
                                    <Text style={styles.documentIcon}>📄</Text>
                                    <Text style={styles.documentName}>{selectedMedia.name}</Text>
                                    <Text style={styles.documentSize}>
                                        {selectedMedia.size
                                            ? `${(selectedMedia.size / 1024).toFixed(2)} KB`
                                            : ''}
                                    </Text>
                                    <Text style={styles.errorText}>
                                        {Translate('Document is being processed...')}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ) : null}
                </View>
            )}
        </View>
    );
});
MediaDisplay.displayName = 'MediaDisplay';

