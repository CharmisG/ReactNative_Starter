import React, { useMemo, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavParamTypes';
import { RootState } from '../redux/store';
import Navbar from '../components/Navbar';
import { useQRScanner } from '../hooks/useQRScanner';
import { createQRScannerStyles } from '../components/qrScanner/QRScannerStyles';
import Translate from '../hooks/Translate';
import QRCodeScanner from 'react-native-qrcode-scanner';

type Props = NativeStackScreenProps<RootStackParamList, 'QRScanner'>;

const QRScannerScreen = ({ navigation }: Props) => {
    const { appTheme } = useSelector((state: RootState) => state.Settings);
    const styles = useMemo(() => createQRScannerStyles(appTheme), [appTheme]);
    const {
        hasPermission,
        scannedData,
        isScanning,
        isQRScannerEnabled,
        onQRCodeRead,
        startScanning,
        stopScanning,
        resetScanner,
        requestCameraPermission,
        qrConfig,
    } = useQRScanner();

    useEffect(() => {
        startScanning();
        return () => {
            stopScanning();
        };
    }, [startScanning, stopScanning]);

    const handleQRCodeRead = (e: any) => {
        if (!isScanning) return;
        onQRCodeRead({ data: e.data, type: e.type });
    };

    const handleResultPress = () => {
        if (scannedData) {
            Alert.alert(
                Translate('QR Code Scanned'),
                scannedData,
                [
                    {
                        text: Translate('Copy'),
                        onPress: () => {
                            // You can add clipboard functionality here
                            Alert.alert('', Translate('Copied to clipboard'));
                        },
                    },
                    {
                        text: Translate('OK'),
                        onPress: resetScanner,
                    },
                ],
            );
        }
    };

    const handleRequestPermission = async () => {
        const granted = await requestCameraPermission();
        if (granted) {
            // Permission granted, component will re-render automatically
            // The scanner will be shown on next render
        }
    };

    if (hasPermission === false) {
        return (
            <SafeAreaView style={styles.container}>
                <Navbar
                    screenTitle={Translate('QR Scanner')}
                    leftIconPressed={navigation.goBack}
                />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {Translate('Camera permission is required to scan QR codes')}
                    </Text>
                    <TouchableOpacity
                        style={styles.permissionButton}
                        onPress={handleRequestPermission}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.permissionButtonText}>
                            {Translate('Grant Permission')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (hasPermission === null) {
        return (
            <SafeAreaView style={styles.container}>
                <Navbar
                    screenTitle={Translate('QR Scanner')}
                    leftIconPressed={navigation.goBack}
                />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{Translate('Requesting camera permission...')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Navbar
                screenTitle={Translate('QR Scanner')}
                leftIconPressed={navigation.goBack}
            />
            <View style={styles.scannerContainer}>
                <QRCodeScanner
                    onRead={handleQRCodeRead}
                    reactivate={qrConfig?.reactivate ?? true}
                    reactivateTimeout={qrConfig?.reactivateTimeout ?? 2000}
                    showMarker={true}
                    markerStyle={styles.scanArea}
                    cameraStyle={StyleSheet.absoluteFillObject}
                    topContent={
                        scannedData ? (
                            <View style={styles.resultContainer}>
                                <Text style={styles.resultTitle}>{Translate('QR Code Scanned')}</Text>
                                <Text style={styles.resultText} numberOfLines={3}>
                                    {scannedData}
                                </Text>
                                <TouchableOpacity
                                    style={styles.resultButton}
                                    onPress={handleResultPress}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.resultButtonText}>{Translate('View Details')}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : undefined
                    }
                    bottomContent={
                        <View style={styles.instructionContainer}>
                            <Text style={styles.instructionText}>
                                {Translate('Position QR code within the frame')}
                            </Text>
                            <Text style={styles.instructionSubtext}>
                                {Translate('The scanner will automatically detect the code')}
                            </Text>
                        </View>
                    }
                    fadeIn={true}
                />
            </View>
        </SafeAreaView>
    );
};

export default QRScannerScreen;

