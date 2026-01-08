import { useCallback, useState, useEffect, useMemo } from 'react';
import { Alert, Platform, PermissionsAndroid, Vibration, Linking } from 'react-native';
import Translate from './Translate';

// Clipboard import - try both old and new API
let Clipboard: any = null;
try {
    Clipboard = require('react-native').Clipboard;
} catch (e) {
    try {
        Clipboard = require('@react-native-clipboard/clipboard').default;
    } catch (e2) {
        console.warn('Clipboard not available');
    }
}

export interface QRScannerResult {
    data: string;
    type: string;
}

export const useQRScanner = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    // Default QR Scanner configuration
    const qrConfig = useMemo(() => {
        return {
            enabled: true,
            requestPermissions: true,
            vibrateOnRead: true,
            showTorch: true,
            reactivate: true,
            reactivateTimeout: 2000,
        };
    }, []);

    // QR Scanner is always enabled
    const isQRScannerEnabled = true;

    const checkCameraPermission = useCallback(async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            try {
                const checkResult = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                );
                return checkResult;
            } catch (error) {
                console.error('Camera permission check failed:', error);
                return false;
            }
        }
        // iOS - permissions are checked when camera is accessed
        return true;
    }, []);

    const requestCameraPermission = useCallback(async (): Promise<boolean> => {
        if (!qrConfig.requestPermissions) {
            Alert.alert('', Translate('Permission requests are disabled'));
            return false;
        }

        if (Platform.OS === 'android') {
            try {
                // First check if permission is already granted
                const hasPermission = await checkCameraPermission();
                if (hasPermission) {
                    setHasPermission(true);
                    return true;
                }

                // Request permission
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: Translate('Camera Permission'),
                        message: Translate('This app needs access to your camera to scan QR codes'),
                        buttonNeutral: Translate('Ask Me Later'),
                        buttonNegative: Translate('Cancel'),
                        buttonPositive: Translate('OK'),
                    },
                );

                const permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
                setHasPermission(permissionGranted);

                if (!permissionGranted) {
                    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                        Alert.alert(
                            Translate('Permission Denied'),
                            Translate('Camera permission has been permanently denied. Please enable it in app settings.'),
                            [
                                { text: Translate('Cancel'), style: 'cancel' },
                                {
                                    text: Translate('Open Settings'),
                                    onPress: () => Linking.openSettings(),
                                },
                            ],
                        );
                    } else {
                        Alert.alert(
                            Translate('Permission Denied'),
                            Translate('Camera permission is required to scan QR codes')
                        );
                    }
                }

                return permissionGranted;
            } catch (error) {
                console.error('Camera permission request failed:', error);
                setHasPermission(false);
                Alert.alert(Translate('Error'), Translate('Failed to request camera permission'));
                return false;
            }
        }

        // iOS - permissions are requested automatically when camera is accessed
        setHasPermission(true);
        return true;
    }, [qrConfig, checkCameraPermission]);

    const onQRCodeRead = useCallback(
        (e: QRScannerResult) => {
            const data = e.data;
            setScannedData(data);
            setIsScanning(false);

            // Vibrate on read if enabled
            if (qrConfig.vibrateOnRead) {
                Vibration.vibrate(200);
            }

            // Show dialog with QR code result
            Alert.alert(
                Translate('QR Code Scanned'),
                data,
                [
                    {
                        text: Translate('Copy'),
                        onPress: async () => {
                            try {
                                if (Clipboard) {
                                    if (Platform.OS === 'android' && Clipboard.setStringAsync) {
                                        await Clipboard.setStringAsync(data);
                                    } else if (Clipboard.setString) {
                                        Clipboard.setString(data);
                                    } else {
                                        throw new Error('Clipboard API not available');
                                    }
                                    Alert.alert('', Translate('Copied to clipboard'));
                                } else {
                                    Alert.alert('', Translate('Clipboard not available'));
                                }
                            } catch (error) {
                                console.error('Failed to copy to clipboard:', error);
                                Alert.alert('', Translate('Failed to copy to clipboard'));
                            }
                        },
                    },
                    {
                        text: Translate('Open Link'),
                        onPress: () => {
                            // Check if it's a URL
                            if (data.startsWith('http://') || data.startsWith('https://')) {
                                Linking.openURL(data).catch((err) => {
                                    console.error('Failed to open URL:', err);
                                    Alert.alert(Translate('Error'), Translate('Failed to open link'));
                                });
                            } else {
                                Alert.alert('', Translate('Not a valid URL'));
                            }
                        },
                        style: data.startsWith('http://') || data.startsWith('https://') ? 'default' : 'cancel',
                    },
                    {
                        text: Translate('OK'),
                        onPress: () => {
                            // Reactivate scanner after timeout if enabled
                            if (qrConfig.reactivate) {
                                const timeout = qrConfig.reactivateTimeout || 2000;
                                setTimeout(() => {
                                    setIsScanning(true);
                                    setScannedData(null);
                                }, timeout);
                            }
                        },
                    },
                ],
                { cancelable: true }
            );
        },
        [qrConfig],
    );

    const startScanning = useCallback(() => {
        setIsScanning(true);
        setScannedData(null);
    }, []);

    const stopScanning = useCallback(() => {
        setIsScanning(false);
    }, []);

    const resetScanner = useCallback(() => {
        setScannedData(null);
        setIsScanning(true);
    }, []);

    // Check permissions on mount
    useEffect(() => {
        const checkPermission = async () => {
            if (qrConfig.requestPermissions) {
                const hasPermission = await checkCameraPermission();
                setHasPermission(hasPermission);
            } else {
                setHasPermission(false);
            }
        };
        checkPermission();
    }, [qrConfig, checkCameraPermission]);

    return {
        hasPermission,
        scannedData,
        isScanning,
        isQRScannerEnabled,
        onQRCodeRead,
        startScanning,
        stopScanning,
        resetScanner,
        requestCameraPermission,
        qrConfig, // Expose config for use in components
    };
};
