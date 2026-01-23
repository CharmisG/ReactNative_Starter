import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavParamTypes';
import { FeatureFlags } from '../config/AppConfig';
import { useBiometricAuth } from './useBiometricAuth';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface UseLoginScreenProps {
    navigation: NavigationProp;
}

export const useLoginScreen = ({ navigation }: UseLoginScreenProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);

    const {
        isAvailable: isBiometricAvailable,
        isBiometricEnabled,
        isAuthenticating,
        authenticate: authenticateBiometric,
        getSavedCredentials,
        saveCredentials,
        getBiometricButtonText,
    } = useBiometricAuth();

    const hasSocialLogin = useMemo(() => {
        const { authProviders } = FeatureFlags;
        return (
            authProviders?.google ||
            authProviders?.facebook ||
            (authProviders?.apple && Platform.OS === 'ios')
        );
    }, []);

    const hasBiometric = useMemo(() => {
        return FeatureFlags.authProviders?.biometric && isBiometricAvailable;
    }, [isBiometricAvailable]);

    /**
     * Load saved credentials on mount if biometric is enabled
     */
    useEffect(() => {
        const loadSavedCredentials = async () => {
            if (isBiometricEnabled && hasBiometric) {
                const credentials = await getSavedCredentials();
                if (credentials) {
                    setEmail(credentials.email);
                    // Don't auto-fill password for security
                }
            }
        };

        loadSavedCredentials();
    }, [isBiometricEnabled, hasBiometric, getSavedCredentials]);

    useEffect(() => {
        if (!hasSocialLogin && !hasBiometric) {
            navigation.replace('Tabs');
        }
    }, [hasSocialLogin, hasBiometric, navigation]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handleEmailLogin = useCallback(async () => {
        setIsLoading(true);
        try {
            // TODO: Implement actual email/password authentication
            // For now, just navigate
            login('email');

            // Save credentials for biometric if enabled
            if (hasBiometric && email && password && FeatureFlags.biometric?.saveCredentials) {
                await saveCredentials(email, password);
            }

            navigation.replace('Tabs');
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [navigation, email, password, hasBiometric, saveCredentials, login]);

    const handleBiometricLogin = useCallback(async () => {
        if (!hasBiometric || isAuthenticating) {
            return;
        }

        const success = await authenticateBiometric();
        if (success) {
            const credentials = await getSavedCredentials();
            if (credentials) {
                setEmail(credentials.email);
                setPassword(credentials.password);

                // Auto-login with saved credentials
                setIsLoading(true);
                try {
                    login('biometric');
                    navigation.replace('Tabs');
                } catch (error) {
                    console.error('Biometric login error:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    }, [hasBiometric, isAuthenticating, authenticateBiometric, getSavedCredentials, navigation, login]);

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        showPassword,
        hasSocialLogin,
        hasBiometric,
        isBiometricEnabled,
        isAuthenticating,
        biometricButtonText: getBiometricButtonText(),
        togglePasswordVisibility,
        handleEmailLogin,
        handleBiometricLogin,
    };
};

