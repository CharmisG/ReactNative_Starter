import i18n from '../Localization/Localize';
import { FeatureFlags } from '../config/AppConfig';

const LANGUAGE_TO_LOCALE_MAP: Record<string, string> = {
    en: 'en-US',      // English (US) - uses $ and . as decimal
    es: 'es-ES',      // Spanish (Spain) - uses € and , as decimal
    // Add more mappings as needed:
    // fr: 'fr-FR',   // French - uses € and , as decimal
    // de: 'de-DE',   // German - uses € and , as decimal
    // ja: 'ja-JP',   // Japanese - uses ¥
    // etc.
};


const LANGUAGE_TO_CURRENCY_MAP: Record<string, string> = {
    en: 'USD',        // US Dollar
    es: 'EUR',        // Euro
    // Add more mappings as needed:
    // fr: 'EUR',
    // de: 'EUR',
    // ja: 'JPY',
    // etc.
};

const getCurrentLocale = (): string => {
    const currentLanguage = i18n.language || FeatureFlags.localization.defaultLanguage || 'en';

    // Try to get locale from language code mapping
    const locale = LANGUAGE_TO_LOCALE_MAP[currentLanguage];
    if (locale) {
        return locale;
    }

    // Fallback: try to construct locale from language code
    if (currentLanguage.length >= 2) {
        const langCode = currentLanguage.substring(0, 2);
        const countryCode = langCode.toUpperCase();
        return `${langCode}-${countryCode}`;
    }

    // Final fallback
    return 'en-US';
};

/**
 * Gets the currency code for the current language
 */
const getCurrentCurrency = (): string => {
    const currentLanguage = i18n.language || FeatureFlags.localization.defaultLanguage || 'en';
    return LANGUAGE_TO_CURRENCY_MAP[currentLanguage] || 'USD';
};

/**
 * Number and Currency Formatting Utility
 * Provides localized number/currency formatting based on the current app language
 */
export class NumberFormatter {
    static format(
        value: number,
        options?: Intl.NumberFormatOptions
    ): string {
        const locale = getCurrentLocale();
        return new Intl.NumberFormat(locale, options).format(value);
    }

    static formatNumber(
        value: number,
        minimumFractionDigits: number = 0,
        maximumFractionDigits: number = 3
    ): string {
        return this.format(value, {
            minimumFractionDigits,
            maximumFractionDigits,
        });
    }

    static formatCurrency(
        value: number,
        currency?: string,
        style: 'currency' = 'currency'
    ): string {
        const currencyCode = currency || getCurrentCurrency();
        const locale = getCurrentLocale();

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
        }).format(value);
    }

    static formatPercentage(
        value: number,
        asDecimal: boolean = false,
        minimumFractionDigits: number = 0,
        maximumFractionDigits: number = 1
    ): string {
        const percentageValue = asDecimal ? value * 100 : value;
        const locale = getCurrentLocale();

        return new Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(percentageValue / 100);
    }

    static formatWithSeparators(
        value: number,
        decimals: number = 0
    ): string {
        return this.format(value, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }

    static formatFileSize(
        bytes: number,
        decimals: number = 2
    ): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        const locale = getCurrentLocale();
        const formattedValue = new Intl.NumberFormat(locale, {
            minimumFractionDigits: dm,
            maximumFractionDigits: dm,
        }).format(bytes / Math.pow(k, i));

        return `${formattedValue} ${sizes[i]}`;
    }


    static formatCompact(
        value: number,
        compactDisplay: 'short' | 'long' = 'short'
    ): string {
        const locale = getCurrentLocale();
        return new Intl.NumberFormat(locale, {
            notation: 'compact',
            compactDisplay,
        }).format(value);
    }


    static formatWithUnit(
        value: number,
        unit: string,
        unitDisplay: 'short' | 'long' | 'narrow' = 'short'
    ): string {
        try {
            const locale = getCurrentLocale();
            return new Intl.NumberFormat(locale, {
                style: 'unit',
                unit,
                unitDisplay,
            }).format(value);
        } catch (error) {
            // Fallback for unsupported units - format number and append unit manually
            const formattedValue = this.format(value, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            });
            // Return formatted number with unit as-is (caller should handle unit symbol)
            return `${formattedValue} ${unit}`;
        }
    }

    static parse(formattedString: string): number {
        // Remove common formatting characters
        const cleaned = formattedString
            .replace(/[^\d.,-]/g, '') // Remove all non-numeric except digits, dots, commas, and minus
            .replace(/,/g, ''); // Remove thousand separators

        return parseFloat(cleaned);
    }

    static formatRange(
        min: number,
        max: number,
        decimals: number = 0
    ): string {
        const locale = getCurrentLocale();
        const formatter = new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });

        return `${formatter.format(min)} - ${formatter.format(max)}`;
    }

}

export const formatNumber = (
    value: number,
    options?: Intl.NumberFormatOptions
): string => NumberFormatter.format(value, options);

/**
 * Convenience function for currency formatting
 */
export const formatCurrency = (
    value: number,
    currency?: string,
    style: 'currency' = 'currency'
): string => NumberFormatter.formatCurrency(value, currency, style);

/**
 * Convenience function for percentage formatting
 */
export const formatPercentage = (
    value: number,
    asDecimal: boolean = false,
    minimumFractionDigits: number = 0,
    maximumFractionDigits: number = 1
): string => NumberFormatter.formatPercentage(value, asDecimal, minimumFractionDigits, maximumFractionDigits);

/**
 * Convenience function for compact number formatting
 */
export const formatCompact = (
    value: number,
    compactDisplay: 'short' | 'long' = 'short'
): string => NumberFormatter.formatCompact(value, compactDisplay);

/**
 * Convenience function for file size formatting
 */
export const formatFileSize = (
    bytes: number,
    decimals: number = 2
): string => NumberFormatter.formatFileSize(bytes, decimals);

export default NumberFormatter;

