import React, { Component, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FacebookAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { LoginManager, AccessToken, UserData } from 'react-native-fbsdk-next';
import { AuthContext } from '../../hooks/AuthContext';
import { fontHeight } from '../../styles/Fonts';
import Colors from '../../styles/Colors';
import Translate from '../../hooks/Translate';

export default function FacebookSignIn({ navigation }) {
  const { login } = useContext(AuthContext);

  const onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    // Create a Firebase credential with the AccessToken
    const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
    login('facebook')
    navigation.replace('Tabs');

    // Sign-in the user with the credential
    return signInWithCredential(getAuth(), facebookCredential);
  }

  return (
    <TouchableOpacity style={[styles.button]} onPress={onFacebookButtonPress}>
      <Text style={styles.buttonText}>{Translate('Sign in with Facebook')}</Text>
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