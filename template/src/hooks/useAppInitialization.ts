// @ts-nocheck
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
 * Maps timezone identifiers to language codes
 * This is a comprehensive mapping of major timezones to their primary languages
 */
const TIMEZONE_TO_LANGUAGE_MAP: Record<string, string> = {
    // Americas - English
    'America/New_York': 'en',
    'America/Chicago': 'en',
    'America/Denver': 'en',
    'America/Los_Angeles': 'en',
    'America/Phoenix': 'en',
    'America/Anchorage': 'en',
    'America/Honolulu': 'en',
    'America/Toronto': 'en',
    'America/Vancouver': 'en',
    'America/Montreal': 'en',
    'America/Winnipeg': 'en',
    'America/Edmonton': 'en',
    'America/Regina': 'en',
    'America/St_Johns': 'en',
    'America/Halifax': 'en',
    'America/Whitehorse': 'en',
    'America/Yellowknife': 'en',
    'America/Inuvik': 'en',
    'America/Iqaluit': 'en',
    'America/Resolute': 'en',
    'America/Dawson': 'en',
    'America/Dawson_Creek': 'en',
    'America/Fort_Nelson': 'en',
    'America/Cambridge_Bay': 'en',
    'America/Glace_Bay': 'en',
    'America/Goose_Bay': 'en',
    'America/Blanc-Sablon': 'en',
    'America/Moncton': 'en',
    'America/Nipigon': 'en',
    'America/Thunder_Bay': 'en',
    'America/Pangnirtung': 'en',
    'America/Rainy_River': 'en',
    'America/Rankin_Inlet': 'en',
    'America/Swift_Current': 'en',
    'America/Tijuana': 'es',
    'America/Mexico_City': 'es',
    'America/Monterrey': 'es',
    'America/Mazatlan': 'es',
    'America/Chihuahua': 'es',
    'America/Hermosillo': 'es',
    'America/Merida': 'es',
    'America/Cancun': 'es',
    'America/Matamoros': 'es',
    'America/Bogota': 'es',
    'America/Lima': 'es',
    'America/Caracas': 'es',
    'America/La_Paz': 'es',
    'America/Santiago': 'es',
    'America/Asuncion': 'es',
    'America/Montevideo': 'es',
    'America/Buenos_Aires': 'es',
    'America/Sao_Paulo': 'pt', // Portuguese for Brazil
    'America/Rio_Branco': 'pt',
    'America/Manaus': 'pt',
    'America/Cuiaba': 'pt',
    'America/Campo_Grande': 'pt',
    'America/Belem': 'pt',
    'America/Fortaleza': 'pt',
    'America/Recife': 'pt',
    'America/Araguaina': 'pt',
    'America/Maceio': 'pt',
    'America/Bahia': 'pt',
    'America/Santarem': 'pt',
    'America/Porto_Velho': 'pt',
    'America/Boa_Vista': 'pt',
    'America/Eirunepe': 'pt',
    'America/Noronha': 'pt',

    // Europe - Spanish
    'Europe/Madrid': 'es',
    'Europe/Barcelona': 'es',
    'Europe/Lisbon': 'pt',
    'Europe/London': 'en',
    'Europe/Dublin': 'en',
    'Europe/Paris': 'fr', // French - would need fr.json
    'Europe/Berlin': 'de', // German - would need de.json
    'Europe/Rome': 'it', // Italian - would need it.json
    'Europe/Amsterdam': 'nl', // Dutch - would need nl.json
    'Europe/Brussels': 'fr',
    'Europe/Vienna': 'de',
    'Europe/Zurich': 'de',
    'Europe/Stockholm': 'sv', // Swedish - would need sv.json
    'Europe/Oslo': 'no', // Norwegian - would need no.json
    'Europe/Copenhagen': 'da', // Danish - would need da.json
    'Europe/Helsinki': 'fi', // Finnish - would need fi.json
    'Europe/Warsaw': 'pl', // Polish - would need pl.json
    'Europe/Prague': 'cs', // Czech - would need cs.json
    'Europe/Budapest': 'hu', // Hungarian - would need hu.json
    'Europe/Bucharest': 'ro', // Romanian - would need ro.json
    'Europe/Sofia': 'bg', // Bulgarian - would need bg.json
    'Europe/Athens': 'el', // Greek - would need el.json
    'Europe/Istanbul': 'tr', // Turkish - would need tr.json
    'Europe/Moscow': 'ru', // Russian - would need ru.json
    'Europe/Kiev': 'uk', // Ukrainian - would need uk.json

    // Asia - Various languages
    'Asia/Tokyo': 'ja', // Japanese - would need ja.json
    'Asia/Shanghai': 'zh', // Chinese - would need zh.json
    'Asia/Hong_Kong': 'zh',
    'Asia/Taipei': 'zh',
    'Asia/Singapore': 'en',
    'Asia/Kuala_Lumpur': 'ms', // Malay - would need ms.json
    'Asia/Jakarta': 'id', // Indonesian - would need id.json
    'Asia/Bangkok': 'th', // Thai - would need th.json
    'Asia/Ho_Chi_Minh': 'vi', // Vietnamese - would need vi.json
    'Asia/Manila': 'en',
    'Asia/Seoul': 'ko', // Korean - would need ko.json
    'Asia/Dubai': 'ar', // Arabic - would need ar.json
    'Asia/Riyadh': 'ar',
    'Asia/Kolkata': 'hi', // Hindi - would need hi.json
    'Asia/Karachi': 'ur', // Urdu - would need ur.json
    'Asia/Dhaka': 'bn', // Bengali - would need bn.json

    // Africa - Various languages
    'Africa/Cairo': 'ar',
    'Africa/Johannesburg': 'en',
    'Africa/Lagos': 'en',
    'Africa/Nairobi': 'en',
    'Africa/Casablanca': 'ar',

    // Oceania
    'Australia/Sydney': 'en',
    'Australia/Melbourne': 'en',
    'Australia/Brisbane': 'en',
    'Australia/Perth': 'en',
    'Australia/Adelaide': 'en',
    'Australia/Darwin': 'en',
    'Australia/Hobart': 'en',
    'Pacific/Auckland': 'en',
    'Pacific/Wellington': 'en',
    'Pacific/Honolulu': 'en',
    'Pacific/Fiji': 'en',
    'Pacific/Guam': 'en',
};

/**
 * Get language code from timezone
 * @param timezone - The timezone identifier (e.g., 'America/New_York')
 * @returns Language code (e.g., 'en', 'es') or null if not found
 */
const getLanguageFromTimezone = (timezone: string): string | null => {
    // Direct match
    if (TIMEZONE_TO_LANGUAGE_MAP[timezone]) {
        return TIMEZONE_TO_LANGUAGE_MAP[timezone];
    }

    // Try to match by region prefix (e.g., 'America/' -> check for Spanish-speaking countries)
    if (timezone.startsWith('America/')) {
        // Most Central and South American countries speak Spanish
        const spanishCountries = ['Mexico', 'Guatemala', 'El_Salvador', 'Honduras', 'Nicaragua',
            'Costa_Rica', 'Panama', 'Colombia', 'Ecuador', 'Peru', 'Venezuela', 'Bolivia',
            'Chile', 'Paraguay', 'Uruguay', 'Argentina'];
        for (const country of spanishCountries) {
            if (timezone.includes(country)) {
                return 'es';
            }
        }
    }

    // Try to match by region prefix for Europe
    if (timezone.startsWith('Europe/')) {
        const spanishRegions = ['Madrid', 'Barcelona'];
        for (const region of spanishRegions) {
            if (timezone.includes(region)) {
                return 'es';
            }
        }
    }

    return null;
};

/**
 * Get device timezone
 * @returns Timezone identifier or null
 */
const getDeviceTimezone = (): string | null => {
    try {
        // Use react-native-localize to get timezone
        // Note: getTimeZone() might not be available in all versions, so we use try-catch
        let timezone: string | null = null;

        try {
            // Try the getTimeZone method if available
            if (typeof RNLocalize.getTimeZone === 'function') {
                timezone = RNLocalize.getTimeZone();
            }
        } catch (e) {
            // Method not available, continue to fallback
        }

        if (timezone) {
            return timezone;
        }

        // Fallback: try to get from Intl API (if available)
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
            try {
                const formatter = new Intl.DateTimeFormat();
                const resolved = formatter.resolvedOptions();
                if (resolved.timeZone) {
                    return resolved.timeZone;
                }
            } catch (e) {
                // Intl API not available or failed
            }
        }

        return null;
    } catch (error) {
        if (__DEV__) {
            console.warn('Failed to get device timezone:', error);
        }
        return null;
    }
};

/**
 * Initialize localization with saved preference, timezone-based detection, or device locale
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

    // Priority 1: Try timezone-based detection first (if auto-detect is enabled)
    if (config.autoDetectDevice) {
        try {
            const deviceTimezone = getDeviceTimezone();
            if (__DEV__) {
                console.log(`[Localization] Device timezone detected: ${deviceTimezone}`);
            }

            if (deviceTimezone) {
                const timezoneLanguage = getLanguageFromTimezone(deviceTimezone);
                if (__DEV__) {
                    console.log(`[Localization] Language from timezone ${deviceTimezone}: ${timezoneLanguage}`);
                }

                if (timezoneLanguage && supportedLanguages.includes(timezoneLanguage)) {
                    languageToUse = timezoneLanguage;
                    if (__DEV__) {
                        console.log(`[Localization] Using language from timezone: ${timezoneLanguage}`);
                    }
                } else {
                    // Timezone language not supported, try device locale as fallback
                    const deviceLocale = RNLocalize.getLocales()[0]?.languageCode;
                    if (__DEV__) {
                        console.log(`[Localization] Device locale: ${deviceLocale}`);
                    }
                    if (deviceLocale && supportedLanguages.includes(deviceLocale)) {
                        languageToUse = deviceLocale;
                        if (__DEV__) {
                            console.log(`[Localization] Using language from device locale: ${deviceLocale}`);
                        }
                    } else {
                        // Final fallback to default (English)
                        languageToUse = defaultLanguage;
                        if (__DEV__) {
                            console.log(`[Localization] Using default language: ${defaultLanguage} (timezone: ${deviceTimezone}, locale: ${deviceLocale}, timezoneLanguage: ${timezoneLanguage})`);
                        }
                    }
                }
            } else {
                // No timezone available, try device locale
                const deviceLocale = RNLocalize.getLocales()[0]?.languageCode;
                if (__DEV__) {
                    console.log(`[Localization] No timezone available, trying device locale: ${deviceLocale}`);
                }
                if (deviceLocale && supportedLanguages.includes(deviceLocale)) {
                    languageToUse = deviceLocale;
                    if (__DEV__) {
                        console.log(`[Localization] Using language from device locale: ${deviceLocale}`);
                    }
                }
            }

            // Save the detected language (only if different from saved preference or if no preference exists)
            if (languageToUse !== selectedLanguage) {
                await setItem(StorageKeys.SELECTED_LANGUAGE, languageToUse);
                if (__DEV__) {
                    console.log(`[Localization] Saved detected language: ${languageToUse}`);
                }
            }
        } catch (error) {
            if (__DEV__) {
                console.warn('[Localization] Failed to detect language from timezone/locale:', error);
            }
        }
    }

    // Priority 2: Use saved language preference if timezone detection didn't work or wasn't enabled
    if (languageToUse === defaultLanguage && selectedLanguage && supportedLanguages.includes(selectedLanguage)) {
        languageToUse = selectedLanguage;
        if (__DEV__) {
            console.log(`[Localization] Using saved language preference: ${selectedLanguage}`);
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

