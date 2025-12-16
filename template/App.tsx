/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { LogBox, StyleSheet, Alert, Button } from 'react-native';
import i18n from './src/Localization/Localize';
import * as RNLocalize from 'react-native-localize';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import { Provider } from 'react-redux';
import { Store } from './src/redux/Store';
import { FileLogger, LogLevel } from "react-native-file-logger";
import { AuthProvider } from './src/hooks/AuthContext';
import { ToastProvider } from './src/contexts/ToastContext';
import { getItem, setItem } from './src/components/localStorage';
import { StorageKeys } from './src/constants/StorageKeys';
import { FeatureFlags } from './src/config/AppConfig';

function App(): React.JSX.Element {
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		initializeApp();
	}, []);

	const initializeApp = async () => {
		try {
			// SplashScreen.hide();
			LogBox.ignoreAllLogs();
			
			// Configure file logger
			FileLogger.configure({ logLevel: LogLevel.Debug, maximumFileSize: 1024 }).then(() =>
				console.log("File-logger configured")
			);

			// Initialize localization with saved preference or device locale
			await initializeLocalization();
			setIsInitialized(true);
		} catch (error) {
			console.error('App initialization error:', error);
			setIsInitialized(true); // Continue even if initialization fails
		}
	};

	const initializeLocalization = async () => {
		const localizationConfig = FeatureFlags.localization;
	
		// Skip if localization is disabled
		if (!localizationConfig?.enabled) {
			return;
		}
		const supportedLanguages = localizationConfig.supportedLanguages ?? [];
		const defaultLanguage = localizationConfig.defaultLanguage ?? 'en';

		// Try to load saved language preference
		let selectedLanguage: string | null = null;
		try {
			selectedLanguage = await getItem(StorageKeys.SELECTED_LANGUAGE);
		} catch (error) {
			if (__DEV__) {
				console.warn('Failed to load saved language preference:', error);
			}
		}

		// Determine which language to use
		let languageToUse = defaultLanguage;

		if (selectedLanguage && supportedLanguages.includes(selectedLanguage)) {
			// Use saved preference if valid
			languageToUse = selectedLanguage;
		} else if (localizationConfig.autoDetectDevice) {
			// Try device locale if auto-detect is enabled
			try {
				const deviceLocale = RNLocalize.getLocales()[0]?.languageCode;
				if (deviceLocale && supportedLanguages.includes(deviceLocale)) {
					languageToUse = deviceLocale;
					// Save device locale as preference
					await setItem(StorageKeys.SELECTED_LANGUAGE, deviceLocale);
				}
			} catch (error) {
				if (__DEV__) {
					console.warn('Failed to detect device locale:', error);
				}
			}
		}

		// Set the language
		i18n.changeLanguage(languageToUse);
		
		// Update global variable for backward compatibility
		(global as any).appLanguage = languageToUse;

		if (__DEV__) {
			console.log(`Localization initialized: ${languageToUse}`);
		}
	};

	// Show loading/splash screen while initializing
	if (!isInitialized) {
		return null; // Or return a SplashScreen component
	}

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
