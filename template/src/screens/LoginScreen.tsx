import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/NavParamTypes';
import { useLoginScreen } from '../hooks/useLoginScreen';
import { EmailInput } from '../components/socialLogin/EmailInput';
import { PasswordInput } from '../components/socialLogin/PasswordInput';
import { SocialLoginSection } from '../components/socialLogin/SocialLoginSection';
import { BiometricButton } from '../components/socialLogin/BiometricButton';
import { LoginScreenStyles } from '../components/socialLogin/styles';
import Translate from '../hooks/Translate';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function LoginScreen({ navigation }: Props): React.JSX.Element {
    const {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        showPassword,
        hasBiometric,
        isBiometricEnabled,
        isAuthenticating,
        biometricButtonText,
        togglePasswordVisibility,
        handleEmailLogin,
        handleBiometricLogin,
    } = useLoginScreen({ navigation });

    const buttonText = useMemo(
        () => (isLoading ? Translate('Logging in...') : Translate('Login with Email')),
        [isLoading]
    );

    const showBiometricButton = useMemo(() => {
        return hasBiometric && isBiometricEnabled;
    }, [hasBiometric, isBiometricEnabled]);

    return (
        <View style={LoginScreenStyles.container}>
            <Text style={LoginScreenStyles.title}>{Translate('Welcome Back')}</Text>
            <Text style={LoginScreenStyles.subtitle}>{Translate('Login to continue')}</Text>

            <View style={LoginScreenStyles.card}>
                {showBiometricButton && (
                    <BiometricButton
                        onPress={handleBiometricLogin}
                        text={biometricButtonText}
                        isLoading={isAuthenticating}
                        disabled={isLoading}
                    />
                )}

                {showBiometricButton && (
                    <View style={LoginScreenStyles.dividerContainer}>
                        <View style={LoginScreenStyles.dividerLine} />
                        <Text style={LoginScreenStyles.dividerText}>{Translate('OR')}</Text>
                        <View style={LoginScreenStyles.dividerLine} />
                    </View>
                )}

                <EmailInput
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                />

                <PasswordInput
                    value={password}
                    onChangeText={setPassword}
                    showPassword={showPassword}
                    onToggleVisibility={togglePasswordVisibility}
                    editable={!isLoading}
                />

                <TouchableOpacity
                    style={[
                        LoginScreenStyles.emailLoginButton,
                        isLoading && LoginScreenStyles.buttonDisabled,
                    ]}
                    onPress={handleEmailLogin}
                    disabled={isLoading}
                >
                    <Text style={LoginScreenStyles.emailLoginButtonText}>
                        {buttonText}
                    </Text>
                </TouchableOpacity>

                <SocialLoginSection navigation={navigation} />
            </View>
        </View>
    );
}

export default React.memo(LoginScreen);
