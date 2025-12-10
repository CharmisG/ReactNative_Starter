/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { LogBox, StyleSheet, Alert, Button } from 'react-native';
import i18n from './src/Localization/Localize';
import * as RNLocalize from 'react-native-localize';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import { Provider } from 'react-redux';
import { Store } from './src/redux/Store';
import { FileLogger, LogLevel } from "react-native-file-logger";
import { AuthProvider } from './src/hooks/AuthContext';
import { ToastProvider } from './src/contexts/ToastContext';

function App(): React.JSX.Element {

	useEffect(() => {
		// SplashScreen.hide();
		const locale = RNLocalize.getLocales()[0].languageCode;
		i18n.changeLanguage(locale);
		LogBox.ignoreAllLogs();
		FileLogger.configure({ logLevel: LogLevel.Debug, maximumFileSize: 1024 }).then(() =>
			console.log("File-logger configured")
		);
	}, []);

	return (
		<AuthProvider>
			<Provider store={Store}>
				<ToastProvider>
					<MainStackNavigator />
				</ToastProvider>
			</Provider>
		</AuthProvider>
	);
}
export default App;
