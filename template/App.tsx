/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { LogBox, StyleSheet, View, Button, Alert, Text } from 'react-native';
import i18n from './src/Localization/Localize';
import * as RNLocalize from 'react-native-localize';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import { Provider } from 'react-redux';
import { Store } from './src/redux/Store';
import { FileLogger, LogLevel } from "react-native-file-logger";
import analytics from '@react-native-firebase/analytics';
import { firebase } from '@react-native-firebase/analytics';
import { GoogleSigninSampleApp } from './src/components/socialLogin/googleLogin';
import { FacebookSignIn } from './src/components/socialLogin/facebookLogin';


function App(): React.JSX.Element {
	useEffect(() => {
		// SplashScreen.hide();
		const locale = RNLocalize.getLocales()[0].languageCode;
		i18n.changeLanguage(locale);
		LogBox.ignoreAllLogs();
		FileLogger.configure({ logLevel: LogLevel.Debug, maximumFileSize: 1024 }).then(() =>
			console.log("File-logger configured")
		);
		// analyticsTest();
	}, []);

	const analyticsTest = async () => {
		firebase.analytics().setUserId('user123');
		await analytics().logEvent('test_event', {
			id: 123456,
			item: 'Test Item',
			description: ['This is a test event'],
			size: 'M',
		});
		Alert.alert('Analytics Event Logged', 'A test analytics event has been logged.');
	}

	return (
		<Provider store={Store}>
			<GoogleSigninSampleApp />
			<FacebookSignIn />
			{/* <MainStackNavigator /> */}
		</Provider>
	);
}

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
	},
	highlight: {
		fontWeight: '700',
	},
});

export default App;
