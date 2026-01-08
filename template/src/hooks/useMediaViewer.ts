import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { launchImageLibrary, launchCamera, Asset } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import { FeatureFlags } from '../config/AppConfig';
import Translate from './Translate';

export type MediaType = 'video' | 'image' | 'document' | null;

export interface MediaItem {
    uri: string;
    type: MediaType;
    name?: string;
    size?: number;
}

export const useMediaViewer = () => {
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isMediaViewerEnabled = FeatureFlags.mediaViewer?.enabled ?? false;
    const videoPlayerEnabled = FeatureFlags.mediaViewer?.videoPlayer?.enabled ?? true;
    const imageViewerEnabled = FeatureFlags.mediaViewer?.imageViewer?.enabled ?? true;
    const documentViewerEnabled = FeatureFlags.mediaViewer?.documentViewer?.enabled ?? true;

    const selectImageFromGallery = useCallback(async () => {
        if (!isMediaViewerEnabled || !imageViewerEnabled) {
            Alert.alert('', Translate('Image viewer is disabled'));
            return;
        }

        if (!FeatureFlags.mediaViewer?.imageViewer?.allowGallerySelection) {
            Alert.alert('', Translate('Gallery selection is disabled'));
            return;
        }

        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 1,
                selectionLimit: 1,
            });

            if (result.didCancel) {
                return;
            }

            if (result.errorMessage) {
                Alert.alert(Translate('Error'), result.errorMessage);
                return;
            }

            if (result.assets && result.assets[0]?.uri) {
                const asset = result.assets[0];
                setSelectedMedia({
                    uri: asset.uri!,
                    type: 'image',
                    name: asset.fileName || 'image.jpg',
                    size: asset.fileSize,
                });
            }
        } catch (error: any) {
            console.error('Error selecting image:', error);
            Alert.alert(Translate('Error'), Translate('Failed to select image'));
        }
    }, [isMediaViewerEnabled, imageViewerEnabled]);

    const selectVideoFromGallery = useCallback(async () => {
        if (!isMediaViewerEnabled || !videoPlayerEnabled) {
            Alert.alert('', Translate('Video player is disabled'));
            return;
        }

        try {
            const result = await launchImageLibrary({
                mediaType: 'video',
                quality: 1,
                selectionLimit: 1,
            });

            if (result.didCancel) {
                return;
            }

            if (result.errorMessage) {
                Alert.alert(Translate('Error'), result.errorMessage);
                return;
            }

            if (result.assets && result.assets[0]?.uri) {
                const asset = result.assets[0];
                setSelectedMedia({
                    uri: asset.uri!,
                    type: 'video',
                    name: asset.fileName || 'video.mp4',
                    size: asset.fileSize,
                });
            }
        } catch (error: any) {
            console.error('Error selecting video:', error);
            Alert.alert(Translate('Error'), Translate('Failed to select video'));
        }
    }, [isMediaViewerEnabled, videoPlayerEnabled]);

    const selectDocument = useCallback(async () => {
        if (!isMediaViewerEnabled || !documentViewerEnabled) {
            Alert.alert('', Translate('Document viewer is disabled'));
            return;
        }

        if (!FeatureFlags.mediaViewer?.documentViewer?.allowFileSelection) {
            Alert.alert('', Translate('File selection is disabled'));
            return;
        }

        try {
            const result = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.pdf,
                    DocumentPicker.types.doc,
                    DocumentPicker.types.docx,
                    DocumentPicker.types.xls,
                    DocumentPicker.types.xlsx,
                    DocumentPicker.types.ppt,
                    DocumentPicker.types.pptx,
                    DocumentPicker.types.plainText,
                ],
                allowMultiSelection: false,
            });

            if (result && result[0]) {
                const file = result[0];
                setSelectedMedia({
                    uri: file.uri,
                    type: 'document',
                    name: file.name,
                    size: file.size,
                });
            }
        } catch (error: any) {
            if (DocumentPicker.isCancel(error)) {
                // User cancelled
                return;
            }
            console.error('Error selecting document:', error);
            Alert.alert(Translate('Error'), Translate('Failed to select document'));
        }
    }, [isMediaViewerEnabled, documentViewerEnabled]);

    const openDocument = useCallback(async (uri: string) => {
        try {
            setIsLoading(true);
            await FileViewer.open(uri, {
                showOpenWithDialog: true,
                showAppsSuggestions: true,
            });
        } catch (error: any) {
            console.error('Error opening document:', error);
            Alert.alert(
                Translate('Error'),
                Translate('Failed to open document. Please ensure you have an app installed to view this file type.'),
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearMedia = useCallback(() => {
        setSelectedMedia(null);
    }, []);

    return {
        selectedMedia,
        isLoading,
        isMediaViewerEnabled,
        videoPlayerEnabled,
        imageViewerEnabled,
        documentViewerEnabled,
        selectImageFromGallery,
        selectVideoFromGallery,
        selectDocument,
        openDocument,
        clearMedia,
    };
};

