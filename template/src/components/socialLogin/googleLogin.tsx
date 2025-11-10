import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    Button,
    SafeAreaView,
} from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
    isErrorWithCode,
    NativeModuleError,
    statusCodes,
    User,
} from '@react-native-google-signin/google-signin';

type State = {
    userInfo: User | undefined;
    error: Error | undefined;
};

export class GoogleSigninSampleApp extends Component<{}, State> {
    state = {
        userInfo: undefined,
        error: undefined,
    };


    configureGoogleSignIn = () => {
        GoogleSignin.configure({
            webClientId: '',
            iosClientId: '',
            offlineAccess: false,
            profileImageSize: 150,
        });
    };

    async componentDidMount() {
        console.log('GoogleSigninSampleApp mounted');
        this.configureGoogleSignIn();
    }

    render() {
        const { userInfo } = this.state;

        const body = userInfo ? (
            this.renderUserInfo(userInfo)
        ) : (
            <Button
                title="Google Sign-In"
                onPress={() => this._signIn()}
            />
        );
        return (
            <SafeAreaView style={[styles.pageContainer]}>
                {body}
            </SafeAreaView>
        );
    }

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

    renderUserInfo(userInfo: User) {
        return (
            <View style={styles.container}>
                <Text style={styles.welcomeText}>Welcome, {userInfo.user.name}</Text>
                <Text selectable style={{ color: 'black' }}>
                    Your user info:{' '}
                    {this.prettyJson({
                        ...userInfo,
                        idToken: `${userInfo.idToken?.slice(0, 5)}...`,
                    })}
                </Text>
                <Button onPress={this._signOut} title="Log out" />
            </View>
        );
    }

    _signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { type, data } = await GoogleSignin.signIn();
            console.log('type', type);
            if (type === 'success') {
                console.log({ data });
                this.setState({ userInfo: data, error: undefined });
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
                this.setState({
                    error,
                });
            } else {
                Alert.alert(`an error that's not related to google sign in occurred`);
            }
        }
    };

    _signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();

            this.setState({ userInfo: undefined, error: undefined });
        } catch (error) {
            this.setState({
                error: error as NativeModuleError,
            });
        }
    };

}

const styles = StyleSheet.create({
    container: {
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