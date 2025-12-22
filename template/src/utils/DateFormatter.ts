import i18n from '../Localization/Localize';
import { FeatureFlags } from '../config/AppConfig';

/**
 * Maps language codes to locale codes for proper date/time formatting
 * Add more mappings as you add more languages
 */
const LANGUAGE_TO_LOCALE_MAP: Record<string, string> = {
    en: 'en-US',      // English (US)
    es: 'es-ES',      // Spanish (Spain)
    // Add more mappings as needed:
    // fr: 'fr-FR',   // French
    // de: 'de-DE',   // German
    // ja: 'ja-JP',   // Japanese
    // etc.
};

/**
 * Gets the current locale based on the active i18n language
 * Falls back to device locale or 'en-US' if unavailable
 */
const getCurrentLocale = (): string => {
    const currentLanguage = i18n.language || FeatureFlags.localization.defaultLanguage || 'en';

    // Try to get locale from language code mapping
    const locale = LANGUAGE_TO_LOCALE_MAP[currentLanguage];
    if (locale) {
        return locale;
    }

    // Fallback: try to construct locale from language code
    // e.g., 'en' -> 'en-US', 'es' -> 'es-ES'
    if (currentLanguage.length >= 2) {
        const langCode = currentLanguage.substring(0, 2);
        const countryCode = langCode.toUpperCase();
        return `${langCode}-${countryCode}`;
    }

    // Final fallback
    return 'en-US';
};

/**
 * Date and Time Formatting Utility
 * Provides localized date/time formatting based on the current app language
 */
export class DateFormatter {
    /**
     * Format a date with custom options
     * @param date - Date object, timestamp, or date string
     * @param options - Intl.DateTimeFormatOptions
     * @returns Formatted date string
     */
    static format(
        date: Date | number | string,
        options?: Intl.DateTimeFormatOptions
    ): string {
        const dateObj = typeof date === 'string' || typeof date === 'number'
            ? new Date(date)
            : date;

        const locale = getCurrentLocale();
        return new Intl.DateTimeFormat(locale, options).format(dateObj);
    }

    /**
     * Format date only (e.g., "12/25/2023" or "25/12/2023")
     * @param date - Date object, timestamp, or date string
     * @param style - 'short', 'medium', 'long', or 'full'
     * @returns Formatted date string
     */
    static formatDate(
        date: Date | number | string,
        style: 'short' | 'medium' | 'long' | 'full' = 'medium'
    ): string {
        return this.format(date, { dateStyle: style });
    }

    /**
     * Format time only (e.g., "3:45 PM" or "15:45")
     * @param date - Date object, timestamp, or date string
     * @param style - 'short', 'medium', or 'long'
     * @param hour12 - Use 12-hour format (default: true)
     * @returns Formatted time string
     */
    static formatTime(
        date: Date | number | string,
        style: 'short' | 'medium' | 'long' = 'short',
        hour12: boolean = true
    ): string {
        return this.format(date, {
            timeStyle: style,
            hour12,
        });
    }

    /**
     * Format date and time together
     * @param date - Date object, timestamp, or date string
     * @param dateStyle - Date style
     * @param timeStyle - Time style
     * @param hour12 - Use 12-hour format (default: true)
     * @returns Formatted date and time string
     */
    static formatDateTime(
        date: Date | number | string,
        dateStyle: 'short' | 'medium' | 'long' | 'full' = 'medium',
        timeStyle: 'short' | 'medium' | 'long' = 'short',
        hour12: boolean = true
    ): string {
        return this.format(date, {
            dateStyle,
            timeStyle,
            hour12,
        });
    }

    /**
     * Format date in a custom pattern
     * Common patterns:
     * - 'YYYY-MM-DD' -> "2023-12-25"
     * - 'MM/DD/YYYY' -> "12/25/2023"
     * - 'DD MMM YYYY' -> "25 Dec 2023"
     * @param date - Date object, timestamp, or date string
     * @param pattern - Custom format pattern
     * @returns Formatted date string
     */
    static formatCustom(
        date: Date | number | string,
        pattern: string
    ): string {
        const dateObj = typeof date === 'string' || typeof date === 'number'
            ? new Date(date)
            : date;

        const locale = getCurrentLocale();

        // Map common patterns to Intl options
        const patternMap: Record<string, Intl.DateTimeFormatOptions> = {
            'YYYY-MM-DD': { year: 'numeric', month: '2-digit', day: '2-digit' },
            'MM/DD/YYYY': { year: 'numeric', month: '2-digit', day: '2-digit' },
            'DD/MM/YYYY': { year: 'numeric', month: '2-digit', day: '2-digit' },
            'DD MMM YYYY': { year: 'numeric', month: 'short', day: '2-digit' },
            'MMMM DD, YYYY': { year: 'numeric', month: 'long', day: 'numeric' },
            'HH:mm': { hour: '2-digit', minute: '2-digit', hour12: false },
            'hh:mm A': { hour: '2-digit', minute: '2-digit', hour12: true },
        };

        const options = patternMap[pattern];
        if (options) {
            const formatter = new Intl.DateTimeFormat(locale, options);
            let formatted = formatter.format(dateObj);

            // Handle specific pattern formatting
            if (pattern === 'YYYY-MM-DD') {
                const parts = formatter.formatToParts(dateObj);
                const year = parts.find(p => p.type === 'year')?.value;
                const month = parts.find(p => p.type === 'month')?.value.padStart(2, '0');
                const day = parts.find(p => p.type === 'day')?.value.padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            return formatted;
        }

        // Fallback to default formatting
        return new Intl.DateTimeFormat(locale).format(dateObj);
    }

    /**
     * Format relative time (e.g., "2 hours ago", "in 3 days")
     * @param date - Date object, timestamp, or date string
     * @param style - 'long', 'short', or 'narrow'
     * @returns Relative time string
     */
    static formatRelative(
        date: Date | number | string,
        style: 'long' | 'short' | 'narrow' = 'short'
    ): string {
        const dateObj = typeof date === 'string' || typeof date === 'number'
            ? new Date(date)
            : date;

        const locale = getCurrentLocale();
        const now = new Date();
        const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);

        // Use Intl.RelativeTimeFormat if available
        if (typeof Intl.RelativeTimeFormat !== 'undefined') {
            const rtf = new Intl.RelativeTimeFormat(locale, { style });

            const intervals = [
                { unit: 'year' as const, seconds: 31536000 },
                { unit: 'month' as const, seconds: 2592000 },
                { unit: 'week' as const, seconds: 604800 },
                { unit: 'day' as const, seconds: 86400 },
                { unit: 'hour' as const, seconds: 3600 },
                { unit: 'minute' as const, seconds: 60 },
                { unit: 'second' as const, seconds: 1 },
            ];

            for (const interval of intervals) {
                const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
                if (count >= 1) {
                    return rtf.format(diffInSeconds > 0 ? count : -count, interval.unit);
                }
            }

            return rtf.format(0, 'second');
        }

        // Fallback for older environments
        const absDiff = Math.abs(diffInSeconds);
        if (absDiff < 60) return diffInSeconds > 0 ? 'in a few seconds' : 'a few seconds ago';
        if (absDiff < 3600) {
            const mins = Math.floor(absDiff / 60);
            return diffInSeconds > 0 ? `in ${mins} minute${mins > 1 ? 's' : ''}` : `${mins} minute${mins > 1 ? 's' : ''} ago`;
        }
        if (absDiff < 86400) {
            const hours = Math.floor(absDiff / 3600);
            return diffInSeconds > 0 ? `in ${hours} hour${hours > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        const days = Math.floor(absDiff / 86400);
        return diffInSeconds > 0 ? `in ${days} day${days > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`;
    }

    /**
     * Get the day of the week name
     * @param date - Date object, timestamp, or date string
     * @param style - 'long', 'short', or 'narrow'
     * @returns Day name
     */
    static getDayName(
        date: Date | number | string,
        style: 'long' | 'short' | 'narrow' = 'long'
    ): string {
        return this.format(date, { weekday: style });
    }

    /**
     * Get the month name
     * @param date - Date object, timestamp, or date string
     * @param style - 'long', 'short', or 'narrow'
     * @returns Month name
     */
    static getMonthName(
        date: Date | number | string,
        style: 'long' | 'short' | 'narrow' = 'long'
    ): string {
        return this.format(date, { month: style });
    }
}

/**
 * Convenience function for quick date formatting
 * @param date - Date object, timestamp, or date string
 * @param options - Format options
 * @returns Formatted date string
 */
export const formatDate = (
    date: Date | number | string,
    options?: Intl.DateTimeFormatOptions
): string => DateFormatter.format(date, options);

/**
 * Convenience function for date-only formatting
 */
export const formatDateOnly = (
    date: Date | number | string,
    style: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string => DateFormatter.formatDate(date, style);

/**
 * Convenience function for time-only formatting
 */
export const formatTimeOnly = (
    date: Date | number | string,
    style: 'short' | 'medium' | 'long' = 'short',
    hour12: boolean = true
): string => DateFormatter.formatTime(date, style, hour12);

/**
 * Convenience function for date and time formatting
 */
export const formatDateTime = (
    date: Date | number | string,
    dateStyle: 'short' | 'medium' | 'long' | 'full' = 'medium',
    timeStyle: 'short' | 'medium' | 'long' = 'short',
    hour12: boolean = true
): string => DateFormatter.formatDateTime(date, dateStyle, timeStyle, hour12);

/**
 * Convenience function for relative time formatting
 */
export const formatRelativeTime = (
    date: Date | number | string,
    style: 'long' | 'short' | 'narrow' = 'short'
): string => DateFormatter.formatRelative(date, style);

export default DateFormatter;

