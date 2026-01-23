import React, { Component, createContext, useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    Alert,
    TouchableOpacity,
} from 'react-native';
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { fontHeight } from '../../styles/Fonts';
import { AuthContext } from '../../hooks/AuthContext';
import Colors from '../../styles/Colors';
import Translate from '../../hooks/Translate';
import { AuthConfig } from '../../config/AppConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/NavParamTypes';

interface GoogleSigninSampleAppProps {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

export default function GoogleSigninSampleApp({ navigation }: GoogleSigninSampleAppProps): React.JSX.Element {
    const { login } = useContext(AuthContext);

    const configureGoogleSignIn = () => {
        GoogleSignin.configure(AuthConfig.providers.google);
    };

    useEffect(() => {
        console.log('GoogleSigninSampleApp mounted');
        configureGoogleSignIn();
    }, []);

    const _signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { type, data } = await GoogleSignin.signIn();
            console.log('type', type);
            if (type === 'success') {
                console.log({ data });
                login('google')
                navigation.replace('Tabs');
            } else {
                // sign in was cancelled by user
                setTimeout(() => {
                    Alert.alert('cancelled');
                }, 500);
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                console.log('error', error.message);
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        Alert.alert(
                            'in progress',
                            'operation (eg. sign in) already in progress',
                        );
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // android only
                        Alert.alert('play services not available or outdated');
                        break;
                    default:
                        Alert.alert('Something went wrong: ', error.toString());
                }
            } else {
                Alert.alert(`an error that's not related to google sign in occurred`);
            }
        }
    };

    return (
        <TouchableOpacity style={styles.button}
            onPress={_signIn}>
            <Text style={styles.buttonText}>{Translate('Sign in with Google')}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
        backgroundColor: Colors.primary,
    },
    buttonText: {
        color: Colors.black,
        fontSize: fontHeight.FONT14,
        fontWeight: "600",
    },
});