import React, { useMemo } from 'react';
import { View, Text, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/NavParamTypes';
import GoogleSigninSampleApp from './googleLogin';
import FacebookSignIn from './facebookLogin';
import AppleSigninSampleApp from './appleLogin';
import { FeatureFlags } from '../../config/AppConfig';
import { LoginScreenStyles } from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface SocialLoginSectionProps {
    navigation: NavigationProp;
}

export const SocialLoginSection = React.memo<SocialLoginSectionProps>(({ navigation }) => {
    const { authProviders } = FeatureFlags;

    const showDivider = useMemo(() => {
        return (
            authProviders?.google ||
            authProviders?.facebook ||
            (authProviders?.apple && Platform.OS === 'ios')
        );
    }, []);

    if (!showDivider) {
        return null;
    }

    return (
        <>
            <View style={LoginScreenStyles.dividerContainer}>
                <View style={LoginScreenStyles.dividerLine} />
                <Text style={LoginScreenStyles.dividerText}>OR</Text>
                <View style={LoginScreenStyles.dividerLine} />
            </View>
            {authProviders?.google && <GoogleSigninSampleApp navigation={navigation} />}
            {authProviders?.facebook && <FacebookSignIn navigation={navigation} />}
            {authProviders?.apple && Platform.OS === 'ios' && (
                <AppleSigninSampleApp navigation={navigation} />
            )}
        </>
    );
});

SocialLoginSection.displayName = 'SocialLoginSection';

