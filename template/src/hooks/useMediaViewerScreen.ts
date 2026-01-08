import { useState, useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { useMediaViewer } from './useMediaViewer';
import Translate from './Translate';
import { FeatureFlags } from '../config/AppConfig';

const MIME_TYPES: Record<string, string> = {
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

export const useMediaViewerScreen = () => {
    const mediaViewer = useMediaViewer();
    const [videoError, setVideoError] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [documentContent, setDocumentContent] = useState<string | null>(null);
    const [isLoadingDocument, setIsLoadingDocument] = useState(false);
    const [documentError, setDocumentError] = useState<string | null>(null);
    const [documentUri, setDocumentUri] = useState<string | null>(null);
    const [documentBase64, setDocumentBase64] = useState<string | null>(null);

    const getFileExtension = useCallback((fileName: string): string => {
        return fileName.split('.').pop()?.toLowerCase() || '';
    }, []);

    const isPdfFile = useMemo(() => {
        if (!mediaViewer.selectedMedia) return false;
        return (
            mediaViewer.selectedMedia.uri.endsWith('.pdf') ||
            mediaViewer.selectedMedia.name?.toLowerCase().endsWith('.pdf') ||
            false
        );
    }, [mediaViewer.selectedMedia]);

    const isTextFile = useMemo(() => {
        if (!mediaViewer.selectedMedia?.name) return false;
        return getFileExtension(mediaViewer.selectedMedia.name) === 'txt';
    }, [mediaViewer.selectedMedia, getFileExtension]);

    const loadTextFile = useCallback(async (uri: string) => {
        try {
            setIsLoadingDocument(true);
            setDocumentError(null);
            const response = await fetch(uri);
            const content = await response.text();
            setDocumentContent(content);
        } catch (error: any) {
            console.error('Error reading text file:', error);
            setDocumentError(Translate('Failed to load document'));
        } finally {
            setIsLoadingDocument(false);
        }
    }, []);

    const convertContentUriToFileUri = useCallback(async (uri: string, fileName: string): Promise<string | null> => {
        try {
            if (uri.startsWith('file://')) {
                return uri.replace('file://', '');
            }
            if (Platform.OS === 'android' && uri.startsWith('content://')) {
                const tempDir = RNFS.CachesDirectoryPath;
                const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
                const tempFilePath = `${tempDir}/${sanitizedFileName || 'document'}`;
                await RNFS.copyFile(uri, tempFilePath);
                return tempFilePath;
            }
            return uri.replace('file://', '');
        } catch (error: any) {
            console.error('Error converting content URI:', error);
            return null;
        }
    }, []);

    const convertFileToBase64 = useCallback(async (filePath: string, mimeType: string): Promise<string | null> => {
        try {
            const base64 = await RNFS.readFile(filePath, 'base64');
            return `data:${mimeType};base64,${base64}`;
        } catch (error: any) {
            console.error('Error converting file to base64:', error);
            return null;
        }
    }, []);

    useEffect(() => {
        if (!mediaViewer.selectedMedia || mediaViewer.selectedMedia.type !== 'document') {
            setDocumentContent(null);
            setDocumentUri(null);
            setDocumentBase64(null);
            setDocumentError(null);
            return;
        }

        const fileName = mediaViewer.selectedMedia.name || '';
        const fileExtension = getFileExtension(fileName);

        if (fileExtension === 'txt') {
            loadTextFile(mediaViewer.selectedMedia.uri);
            setDocumentUri(null);
            setDocumentBase64(null);
        } else {
            setDocumentContent(null);
            setIsLoadingDocument(true);
            setDocumentError(null);

            convertContentUriToFileUri(mediaViewer.selectedMedia.uri, fileName)
                .then(async (convertedUri: string | null) => {
                    if (!convertedUri) {
                        setDocumentError(Translate('Failed to access document file'));
                        setIsLoadingDocument(false);
                        return;
                    }
                    if (isPdfFile) {
                        setDocumentUri(convertedUri);
                        setDocumentError(null);
                        setIsLoadingDocument(false);
                        return;
                    }
                    const mimeType = MIME_TYPES[fileExtension] || 'application/octet-stream';
                    const base64Uri = await convertFileToBase64(convertedUri, mimeType);
                    if (base64Uri) {
                        setDocumentBase64(base64Uri);
                        setDocumentError(null);
                    } else {
                        setDocumentError(Translate('Failed to load document'));
                    }
                    setIsLoadingDocument(false);
                })
                .catch((error: any) => {
                    console.error('Error converting URI:', error);
                    setDocumentError(Translate('Failed to access document file'));
                    setIsLoadingDocument(false);
                });
        }
    }, [mediaViewer.selectedMedia, loadTextFile, convertContentUriToFileUri, convertFileToBase64, getFileExtension, isPdfFile]);

    const handleOpenDocument = useCallback(async () => {
        if (mediaViewer.selectedMedia && mediaViewer.selectedMedia.type === 'document') {
            await mediaViewer.openDocument(mediaViewer.selectedMedia.uri);
        }
    }, [mediaViewer.selectedMedia, mediaViewer.openDocument]);

    const handleVideoError = useCallback((error: any) => {
        console.error('Video error:', error);
        setVideoError(Translate('Failed to load video'));
    }, []);

    const handlePdfError = useCallback((error: any) => {
        console.error('PDF error:', error);
        setPdfError(Translate('Failed to load PDF'));
    }, []);

    const handleWebViewError = useCallback((syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error:', nativeEvent);
        setDocumentError(Translate('This document format cannot be displayed in-app. Please use external app.'));
    }, []);

    const handleWebViewHttpError = useCallback((syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView HTTP error:', nativeEvent);
        setDocumentError(Translate('Document format may not be supported for in-app viewing'));
    }, []);

    const mediaViewerConfig = useMemo(() => FeatureFlags.mediaViewer, []);
    const videoConfig = useMemo(() => mediaViewerConfig?.videoPlayer, [mediaViewerConfig]);
    const videoControls = useMemo(() => videoConfig?.controls ?? true, [videoConfig]);
    const videoAutoplay = useMemo(() => videoConfig?.autoplay ?? false, [videoConfig]);
    const videoLoop = useMemo(() => videoConfig?.loop ?? false, [videoConfig]);

    const documentProcessingState = useMemo(
        () => ({
            isLoading: isLoadingDocument,
            hasError: !!documentError,
            hasUri: !!documentUri,
            hasBase64: !!documentBase64,
            hasContent: !!documentContent,
        }),
        [isLoadingDocument, documentError, documentUri, documentBase64, documentContent]
    );

    return {
        ...mediaViewer,
        videoError,
        pdfError,
        documentContent,
        documentError,
        documentUri,
        documentBase64,
        isPdfFile,
        isTextFile,
        videoControls,
        videoAutoplay,
        videoLoop,
        documentProcessingState,
        handleOpenDocument,
        handleVideoError,
        handlePdfError,
        handleWebViewError,
        handleWebViewHttpError,
    };
};

