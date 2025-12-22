/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useMemo } from 'react';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import { Provider } from 'react-redux';
import { Store } from './src/redux/Store';
import { AuthProvider } from './src/hooks/AuthContext';
import { ToastProvider } from './src/components/ToastContext';
import { useAppInitialization } from './src/hooks/useAppInitialization';
import { ErrorBoundary } from './src/components/ErrorBoundary';

/**
 * App Providers Component - Memoized to prevent unnecessary re-renders
 */
const AppProviders = React.memo(({ children }: { children: React.ReactNode }) => (
	<ErrorBoundary>
		<AuthProvider>
			<Provider store={Store}>
				<ToastProvider>
					{children}
				</ToastProvider>
			</Provider>
		</AuthProvider>
	</ErrorBoundary>
));

AppProviders.displayName = 'AppProviders';

function App(): React.JSX.Element {
	const isInitialized = useAppInitialization();

	const appContent = useMemo(() => {
		if (!isInitialized) {
			return null;
		}
		return <MainStackNavigator />;
	}, [isInitialized]);

	return <AppProviders>{appContent}</AppProviders>;
}

export default App;
