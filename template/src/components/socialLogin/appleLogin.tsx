import React, { Component, useContext, useEffect } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import { AppleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { windowHeight } from '../../styles/Dimens';
import { AuthContext } from '../../hooks/AuthContext';

type State = {
    userInfo: AppleAuthProvider | undefined;
    error: Error | undefined;
};

export default function AppleSigninSampleApp({ navigation }) {

    const { login } = useContext(AuthContext);

    const onAppleButtonPress = async () => {
        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
            // See: https://github.com/invertase/react-native-apple-authentication#faqs
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identify token returned');
        }

        // Create a Firebase credential from the response
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = AppleAuthProvider.credential(identityToken, nonce);

        signInWithCredential(getAuth(), appleCredential).then((data) => {
            login('apple');
            navigation.replace('Tabs');
            console.log('Apple Sign-In Successful', data);

        }).catch((error) => {

        });

        // Sign the user in with the credential
        return signInWithCredential(getAuth(), appleCredential);
    }

    return (
        <AppleButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={styles.appleButton}
            onPress={onAppleButtonPress}
        />
    );
}


const styles = StyleSheet.create({
    appleButton: {
        width: "100%",
        height: windowHeight(35),
        marginTop: windowHeight(10),
    },
});