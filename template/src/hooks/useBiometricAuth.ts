import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { biometricAuth, BiometricType } from '../utils/BiometricAuth';
import { FeatureFlags } from '../config/AppConfig';

export const useBiometricAuth = () => {
    const [isAvailable, setIsAvailable] = useState(false);
    const [biometricType, setBiometricType] = useState<BiometricType>(BiometricType.NONE);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    /**
     * Check biometric availability on mount
     */
    useEffect(() => {
        const checkAvailability = async () => {
            if (!FeatureFlags.biometric?.enabled) {
                setIsAvailable(false);
                return;
            }

            const available = await biometricAuth.isAvailable();
            setIsAvailable(available);

            if (available) {
                const type = await biometricAuth.getBiometricType();
                setBiometricType(type);

                const enabled = await biometricAuth.isBiometricLoginEnabled();
                setIsBiometricEnabled(enabled);
            }
        };

        checkAvailability();
    }, []);

    /**
     * Authenticate using biometric
     */
    const authenticate = useCallback(async (): Promise<boolean> => {
        if (!isAvailable || isAuthenticating) {
            return false;
        }
        setIsAuthenticating(true);
        try {
            const result = await biometricAuth.authenticate();
            return result.success;
        } catch (error) {
            console.error('Biometric authentication error:', error);
            return false;
        } finally {
            setIsAuthenticating(false);
        }
    }, [isAvailable, isAuthenticating]);

    /**
     * Get saved credentials
     */
    const getSavedCredentials = useCallback(async () => {
        return await biometricAuth.getSavedCredentials();
    }, []);

    /**
     * Save credentials for biometric login
     */
    const saveCredentials = useCallback(async (email: string, password: string) => {
        return await biometricAuth.saveCredentials(email, password);
    }, []);

    /**
     * Clear saved credentials
     */
    const clearCredentials = useCallback(async () => {
        await biometricAuth.clearCredentials();
        setIsBiometricEnabled(false);
    }, []);

    /**
     * Get biometric icon name based on type
     */
    const getBiometricIcon = useCallback((): string => {
        if (Platform.OS === 'ios') {
            return biometricType === BiometricType.FACE_ID ? 'face-id' : 'touch-id';
        } else {
            return 'fingerprint';
        }
    }, [biometricType]);

    /**
     * Get biometric button text
     */
    const getBiometricButtonText = useCallback((): string => {
        if (Platform.OS === 'ios') {
            return biometricType === BiometricType.FACE_ID ? 'Face ID' : 'Touch ID';
        } else {
            return 'Fingerprint';
        }
    }, [biometricType]);

    return {
        isAvailable,
        biometricType,
        isBiometricEnabled,
        isAuthenticating,
        authenticate,
        getSavedCredentials,
        saveCredentials,
        clearCredentials,
        getBiometricIcon,
        getBiometricButtonText,
    };
};

