import { AppError, ErrorSeverity } from './ErrorTypes';
import { FeatureFlags } from '../../config/AppConfig';

/**
 * Error Logger Service
 * Handles logging errors to console, file, and external services
 */
class ErrorLogger {
    private isEnabled: boolean = true;

    /**
     * Log error to console and file
     */
    logError(error: AppError): void {
        if (!FeatureFlags?.errorHandling?.enabled) return;

        if (!this.isEnabled) return;

        const errorLog = {
            code: error.code,
            message: error.message,
            severity: error.severity,
            category: error.category,
            timestamp: error.timestamp.toISOString(),
            context: error.context,
            stack: error.stack,
        };

        // Console logging - FileLogger automatically captures console.error when enabled
        if (FeatureFlags.errorHandling.captureConsole) {
            console.error('[ErrorLogger]', errorLog);
        }

        // Log to external service (e.g., Crashlytics, Sentry) based on severity
        if (
            FeatureFlags.errorHandling.logToExternal &&
            (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH)
        ) {
            this.logToExternalService(error);
        }
    }

    /**
     * Log to external error tracking service
     */
    private logToExternalService(error: AppError): void {
        try {
            // Example: Firebase Crashlytics
            // import crashlytics from '@react-native-firebase/crashlytics';
            // crashlytics().recordError(error.originalError || error);

            // Example: Sentry
            // Sentry.captureException(error.originalError || error, {
            //   tags: {
            //     errorCode: error.code,
            //     category: error.category,
            //   },
            //   extra: error.context,
            // });

            if (__DEV__) {
                console.log('[ErrorLogger] Would log to external service:', error);
            }
        } catch (err) {
            console.error('Failed to log to external service:', err);
        }
    }

    /**
     * Enable/disable error logging
     */
    setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }
}

export const errorLogger = new ErrorLogger();
export default errorLogger;

