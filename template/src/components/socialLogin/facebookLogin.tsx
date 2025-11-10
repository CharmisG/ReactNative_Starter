import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import auth, { getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { LoginManager, AccessToken, UserData } from 'react-native-fbsdk-next';
import { SafeAreaView } from 'react-native-safe-area-context';

type State = {
  userInfo: AccessToken | undefined;
  error: Error | undefined;
};
export class FacebookSignIn extends Component<{}, State> {

  state = {
    userInfo: undefined,
    error: undefined,
  };

  async onFacebookButtonPress() {
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
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    this.setState({ userInfo: data, error: undefined });


    // Sign-in the user with the credential
    return signInWithCredential(getAuth(), facebookCredential);
  }

  renderUserInfo(userInfo: AccessToken) {
    return (
      <View style={styles.container}>
        <Text selectable style={{ color: 'black' }}>
          Your user info:{' '}
          {this.prettyJson({
            ...userInfo,
            idToken: `${userInfo.userID?.slice(0, 5)}...`,
          })}
        </Text>


        <Button onPress={this._signOut} title="Log out" />
      </View>
    )
  }

  _signOut = async () => {
    try {
      await auth().signOut();
      this.setState({ userInfo: undefined, error: undefined });
    } catch (error) {
    }
  };


  prettyJson = (value: any) => {
    function sort(object: any) {
      if (!object || typeof object !== 'object' || object instanceof Array)
        return object;
      const keys = Object.keys(object);
      keys.sort();
      const newObject = {};
      for (let i = 0; i < keys.length; i++) {
        // @ts-ignore
        newObject[keys[i]] = sort(object[keys[i]]);
      }
      return newObject;
    }
    return JSON.stringify(sort(value), null, 2);
  };

  render() {
    const { userInfo } = this.state;

    const body = userInfo ? (
      this.renderUserInfo(userInfo)
    ) : (
      <View>
        <Button
          title="Facebook Sign-In"
          onPress={() => this.onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))
          }
        />
      </View>
    )
    return (
      <SafeAreaView style={[styles.pageContainer]}>
        {body}
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  pageContainer: { margin: 10, backgroundColor: '#F5FCFF' },
});