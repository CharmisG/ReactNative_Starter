import { Platform, Alert } from 'react-native';
import { FeatureFlags } from '../config/AppConfig';
import { getItem, setItem } from '../components/localStorage';
import { StorageKeys } from '../constants/StorageKeys';

export enum BiometricType {
    NONE = 'none',
    TOUCH_ID = 'TouchID',
    FACE_ID = 'FaceID',
    FINGERPRINT = 'Fingerprint',
    FACE = 'Face',
    IRIS = 'Iris',
}

export interface BiometricResult {
    success: boolean;
    error?: string;
    errorCode?: string;
}

class BiometricAuth {
    private isEnabled(): boolean {
        return FeatureFlags.biometric?.enabled ?? false;
    }

    async isAvailable(): Promise<boolean> {
        if (!this.isEnabled()) {
            return false;
        }

        try {
            return Platform.OS === 'ios' || Platform.OS === 'android';
        } catch (error) {
            console.error('Biometric availability check failed:', error);
            return false;
        }
    }

    async getBiometricType(): Promise<BiometricType> {
        if (!this.isEnabled()) {
            return BiometricType.NONE;
        }

        try {
            if (Platform.OS === 'ios') {
                return BiometricType.FACE_ID; // or TouchID based on device
            } else if (Platform.OS === 'android') {
                return BiometricType.FINGERPRINT;
            }
            return BiometricType.NONE;
        } catch (error) {
            console.error('Biometric type check failed:', error);
            return BiometricType.NONE;
        }
    }

    async authenticate(promptMessage?: string): Promise<BiometricResult> {
        if (!this.isEnabled()) {
            return {
                success: false,
                error: 'Biometric authentication is disabled',
                errorCode: 'DISABLED',
            };
        }

        const isAvailable = await this.isAvailable();
        if (!isAvailable) {
            return {
                success: false,
                error: 'Biometric authentication is not available on this device',
                errorCode: 'NOT_AVAILABLE',
            };
        }

        try {
            const message = promptMessage || FeatureFlags.biometric?.promptMessage || 'Authenticate to login';
            const cancelButtonText = FeatureFlags.biometric?.cancelButtonText || 'Cancel';

            return new Promise((resolve) => {
                Alert.alert(
                    'Biometric Authentication',
                    message,
                    [
                        {
                            text: cancelButtonText,
                            style: 'cancel',
                            onPress: () => resolve({
                                success: false,
                                error: 'User cancelled',
                                errorCode: 'USER_CANCEL',
                            }),
                        },
                        {
                            text: 'Authenticate',
                            onPress: () => resolve({ success: true }),
                        },
                    ],
                    { cancelable: true }
                );
            });
        } catch (error: any) {
            return {
                success: false,
                error: error?.message || 'Biometric authentication failed',
                errorCode: error?.code || 'UNKNOWN_ERROR',
            };
        }
    }

    async saveCredentials(email: string, password: string): Promise<boolean> {
        if (!this.isEnabled() || !FeatureFlags.biometric?.saveCredentials) {
            return false;
        }

        try {
            await setItem(StorageKeys.BIOMETRIC_EMAIL, email);
            await setItem(StorageKeys.BIOMETRIC_PASSWORD, password);
            await setItem(StorageKeys.BIOMETRIC_ENABLED, 'true');
            return true;
        } catch (error) {
            console.error('Failed to save biometric credentials:', error);
            return false;
        }
    }

    async getSavedCredentials(): Promise<{ email: string; password: string } | null> {
        if (!this.isEnabled() || !FeatureFlags.biometric?.saveCredentials) {
            return null;
        }

        try {
            const email = await getItem(StorageKeys.BIOMETRIC_EMAIL);
            const password = await getItem(StorageKeys.BIOMETRIC_PASSWORD);
            const enabled = await getItem(StorageKeys.BIOMETRIC_ENABLED);

            if (enabled === 'true' && email && password) {
                return { email, password };
            }
            return null;
        } catch (error) {
            console.error('Failed to get saved credentials:', error);
            return null;
        }
    }

    async clearCredentials(): Promise<void> {
        try {
            await setItem(StorageKeys.BIOMETRIC_EMAIL, '');
            await setItem(StorageKeys.BIOMETRIC_PASSWORD, '');
            await setItem(StorageKeys.BIOMETRIC_ENABLED, 'false');
        } catch (error) {
            console.error('Failed to clear credentials:', error);
        }
    }

    async isBiometricLoginEnabled(): Promise<boolean> {
        if (!this.isEnabled()) {
            return false;
        }

        try {
            const enabled = await getItem(StorageKeys.BIOMETRIC_ENABLED);
            return enabled === 'true';
        } catch (error) {
            return false;
        }
    }
}

export const biometricAuth = new BiometricAuth();
export default biometricAuth;

