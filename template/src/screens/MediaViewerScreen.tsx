import React, { useMemo, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavParamTypes';
import { RootState } from '../redux/store';
import Navbar from '../components/Navbar';
import { useMediaViewerScreen } from '../hooks/useMediaViewerScreen';
import { createMediaViewerStyles } from '../components/mediaViewer/MediaViewerStyles';
import { ActionButtons, EmptyState, LoadingIndicator } from '../components/mediaViewer/MediaViewerComponents';
import { MediaDisplay } from '../components/mediaViewer/MediaDisplay';
import Translate from '../hooks/Translate';

type Props = NativeStackScreenProps<RootStackParamList, 'MediaViewer'>;

const MediaViewerScreen = ({ navigation }: Props) => {
    const { appTheme } = useSelector((state: RootState) => state.Settings);
    const styles = useMemo(() => createMediaViewerStyles(appTheme), [appTheme]);
    const hookData = useMediaViewerScreen();
    const screenTitle = useMemo(() => Translate('Media Viewer'), []);
    const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

    if (!hookData.isMediaViewerEnabled) {
        return (
            <SafeAreaView style={styles.container}>
                <Navbar screenTitle={screenTitle} leftIconPressed={handleGoBack} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{Translate('Media Viewer is disabled')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Navbar screenTitle={screenTitle} leftIconPressed={handleGoBack} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <ActionButtons
                    styles={styles}
                    imageViewerEnabled={hookData.imageViewerEnabled}
                    videoPlayerEnabled={hookData.videoPlayerEnabled}
                    documentViewerEnabled={hookData.documentViewerEnabled}
                    hasSelectedMedia={!!hookData.selectedMedia}
                    onSelectImage={hookData.selectImageFromGallery}
                    onSelectVideo={hookData.selectVideoFromGallery}
                    onSelectDocument={hookData.selectDocument}
                    onClear={hookData.clearMedia}
                />
                <MediaDisplay
                    styles={styles}
                    selectedMedia={hookData.selectedMedia}
                    imageViewerEnabled={hookData.imageViewerEnabled}
                    videoPlayerEnabled={hookData.videoPlayerEnabled}
                    documentViewerEnabled={hookData.documentViewerEnabled}
                    videoError={hookData.videoError}
                    pdfError={hookData.pdfError}
                    documentError={hookData.documentError}
                    documentContent={hookData.documentContent}
                    documentUri={hookData.documentUri}
                    documentBase64={hookData.documentBase64}
                    isPdfFile={hookData.isPdfFile}
                    isTextFile={hookData.isTextFile}
                    videoControls={hookData.videoControls}
                    videoAutoplay={hookData.videoAutoplay}
                    videoLoop={hookData.videoLoop}
                    documentProcessingState={hookData.documentProcessingState}
                    onOpenDocument={hookData.handleOpenDocument}
                    onVideoError={hookData.handleVideoError}
                    onPdfError={hookData.handlePdfError}
                    onWebViewError={hookData.handleWebViewError}
                    onWebViewHttpError={hookData.handleWebViewHttpError}
                />
                {!hookData.selectedMedia && <EmptyState styles={styles} />}
                {hookData.isLoading && <LoadingIndicator styles={styles} />}
            </ScrollView>
        </SafeAreaView>
    );
};

export default MediaViewerScreen;

