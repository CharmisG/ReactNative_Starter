// @ts-nocheck
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useMemo } from 'react';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import { Provider } from 'react-redux';
import { Store } from './src/redux/Store';
import { AuthProvider } from './src/hooks/AuthContext';
import { ToastProvider } from './src/components/ToastContext';
import { useAppInitialization } from './src/hooks/useAppInitialization';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import SplashScreen from 'react-native-splash-screen';
import { FeatureFlags } from './src/config/AppConfig';

/**
 * App Providers Component - Memoized to prevent unnecessary re-renders
 */
type AppProvidersProps = React.PropsWithChildren<{}>;

const AppProviders: React.FC<AppProvidersProps> = ({ children }: AppProvidersProps) => {
	return (
		<ErrorBoundary>
			<AuthProvider>
				<Provider store={Store}>
					<ToastProvider>
						{children}
					</ToastProvider>
				</Provider>
			</AuthProvider>
		</ErrorBoundary>
	);
};

AppProviders.displayName = 'AppProviders';

function App(): React.JSX.Element {
	const isInitialized = useAppInitialization();

	useEffect(() => {
		if (isInitialized && FeatureFlags.splashScreen?.enabled && FeatureFlags.splashScreen?.autoHide) {
			const hideSplash = () => {
				try {
					SplashScreen.hide();
				} catch (error) {
					console.warn('Failed to hide splash screen:', error);
				}
			};

			const minimumDisplayTime = FeatureFlags.splashScreen?.minimumDisplayTime || 0;
			if (minimumDisplayTime > 0) {
				setTimeout(hideSplash, minimumDisplayTime);
			} else {
				hideSplash();
			}
		}
	}, [isInitialized]);

	const appContent = useMemo(() => {
		if (!isInitialized) {
			return null;
		}
		return <MainStackNavigator />;
	}, [isInitialized]);

	return <AppProviders>{appContent}</AppProviders>;
}

export default App;
