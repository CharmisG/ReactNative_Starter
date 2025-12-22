import { useState, useEffect, useCallback } from 'react';
import { LogBox } from 'react-native';
import i18n from '../Localization/Localize';
import * as RNLocalize from 'react-native-localize';
import { FileLogger, LogLevel } from 'react-native-file-logger';
import { getItem, setItem } from '../components/localStorage';
import { StorageKeys } from '../constants/StorageKeys';
import { FeatureFlags } from '../config/AppConfig';

declare global {
    var appLanguage: string | undefined;
}

const FILE_LOGGER_CONFIG = {
    logLevel: LogLevel.Debug,
    maximumFileSize: 1024,
} as const;

/**
 * Initialize localization with saved preference or device locale
 */
const initializeLocalization = async (): Promise<void> => {
    const { localization: config } = FeatureFlags;

    if (!config?.enabled) {
        return;
    }

    const supportedLanguages = config.supportedLanguages ?? [];
    const defaultLanguage = config.defaultLanguage ?? 'en';

    let selectedLanguage: string | null = null;
    try {
        selectedLanguage = await getItem(StorageKeys.SELECTED_LANGUAGE);
    } catch (error) {
        if (__DEV__) {
            console.warn('Failed to load saved language preference:', error);
        }
    }

    let languageToUse = defaultLanguage;

    if (selectedLanguage && supportedLanguages.includes(selectedLanguage)) {
        languageToUse = selectedLanguage;
    } else if (config.autoDetectDevice) {
        try {
            const deviceLocale = RNLocalize.getLocales()[0]?.languageCode;
            if (deviceLocale && supportedLanguages.includes(deviceLocale)) {
                languageToUse = deviceLocale;
                await setItem(StorageKeys.SELECTED_LANGUAGE, deviceLocale);
            }
        } catch (error) {
            if (__DEV__) {
                console.warn('Failed to detect device locale:', error);
            }
        }
    }

    i18n.changeLanguage(languageToUse);
    global.appLanguage = languageToUse;

    if (__DEV__) {
        console.log(`Localization initialized: ${languageToUse}`);
    }
};

/**
 * Configure file logger
 */
const configureFileLogger = (): void => {
    FileLogger.configure(FILE_LOGGER_CONFIG)
        .then(() => {
            if (__DEV__) {
                console.log('File-logger configured');
            }
        })
        .catch((error) => {
            if (__DEV__) {
                console.warn('Failed to configure file logger:', error);
            }
        });
};

/**
 * Custom hook for app initialization
 * @returns boolean indicating if app is initialized
 */
export const useAppInitialization = (): boolean => {
    const [isInitialized, setIsInitialized] = useState(false);

    const initializeApp = useCallback(async (): Promise<void> => {
        try {
            LogBox.ignoreAllLogs();
            configureFileLogger();
            await initializeLocalization();
        } catch (error) {
            console.error('App initialization error:', error);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    return isInitialized;
};

