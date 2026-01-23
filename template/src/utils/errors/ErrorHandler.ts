import axios, { AxiosError } from 'axios';
import { NetInfoState } from '@react-native-community/netinfo';
import {
    CustomError,
    ErrorCode,
    ErrorSeverity,
    ErrorCategory,
    AppError,
} from './ErrorTypes';
import { getErrorMessage } from './ErrorMessages';
import { errorLogger } from './ErrorLogger';
import { FeatureFlags } from '../../config/AppConfig';

/**
 * Error Handler Service
 * Centralized error handling and transformation
 */
class ErrorHandler {
    /**
     * Handle and transform errors into AppError
     */
    handleError(error: any, context?: Record<string, any>): AppError {
        // Respect feature flag: return a minimal AppError without logging when disabled
        if (!FeatureFlags?.errorHandling?.enabled) {
            return new CustomError(
                ErrorCode.UNKNOWN_ERROR,
                getErrorMessage(ErrorCode.UNKNOWN_ERROR),
                ErrorSeverity.MEDIUM,
                ErrorCategory.UNKNOWN,
                error,
                context
            ).toJSON();
        }

        let appError: AppError;

        if (error instanceof CustomError) {
            appError = error.toJSON();
        } else if (axios.isAxiosError(error)) {
            appError = this.handleAxiosError(error, context);
        } else {
            appError = this.handleUnknownError(error, context);
        }

        // Log the error
        errorLogger.logError(appError);

        return appError;
    }

    /**
     * Handle Axios/API errors
     */
    private handleAxiosError(error: AxiosError, context?: Record<string, any>): AppError {
        const status = error.response?.status;
        let code: ErrorCode;
        let severity: ErrorSeverity;
        let message: string;

        switch (status) {
            case 400:
                code = ErrorCode.API_BAD_REQUEST;
                severity = ErrorSeverity.MEDIUM;
                message = (error.response?.data as any)?.message || getErrorMessage(code);
                break;
            case 401:
                code = ErrorCode.API_UNAUTHORIZED;
                severity = ErrorSeverity.HIGH;
                message = getErrorMessage(code);
                break;
            case 403:
                code = ErrorCode.API_FORBIDDEN;
                severity = ErrorSeverity.HIGH;
                message = getErrorMessage(code);
                break;
            case 404:
                code = ErrorCode.API_NOT_FOUND;
                severity = ErrorSeverity.MEDIUM;
                message = getErrorMessage(code);
                break;
            case 409:
                code = ErrorCode.API_CONFLICT;
                severity = ErrorSeverity.MEDIUM;
                message = getErrorMessage(code);
                break;
            case 422:
                code = ErrorCode.API_VALIDATION_ERROR;
                severity = ErrorSeverity.MEDIUM;
                message = (error.response?.data as any)?.message || getErrorMessage(code);
                break;
            case 500:
            case 502:
            case 503:
                code = ErrorCode.API_SERVER_ERROR;
                severity = ErrorSeverity.HIGH;
                message = getErrorMessage(code);
                break;
            case 503:
                code = ErrorCode.API_SERVICE_UNAVAILABLE;
                severity = ErrorSeverity.HIGH;
                message = getErrorMessage(code);
                break;
            default:
                if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                    code = ErrorCode.NETWORK_TIMEOUT;
                    severity = ErrorSeverity.MEDIUM;
                    message = getErrorMessage(code);
                } else if (error.code === 'ERR_NETWORK' || !error.response) {
                    code = ErrorCode.NETWORK_ERROR;
                    severity = ErrorSeverity.HIGH;
                    message = getErrorMessage(code);
                } else {
                    code = ErrorCode.API_ERROR;
                    severity = ErrorSeverity.MEDIUM;
                    message = getErrorMessage(code);
                }
        }

        return new CustomError(
            code,
            message,
            severity,
            ErrorCategory.API,
            error,
            {
                ...context,
                url: error.config?.url,
                method: error.config?.method,
                status,
                responseData: error.response?.data,
            },
            code !== ErrorCode.API_UNAUTHORIZED && code !== ErrorCode.API_FORBIDDEN
        ).toJSON();
    }

    /**
     * Handle unknown error types
     */
    private handleUnknownError(error: any, context?: Record<string, any>): AppError {
        return new CustomError(
            ErrorCode.UNKNOWN_ERROR,
            getErrorMessage(ErrorCode.UNKNOWN_ERROR),
            ErrorSeverity.MEDIUM,
            ErrorCategory.UNKNOWN,
            error,
            context
        ).toJSON();
    }

    /**
     * Handle network state errors
     */
    handleNetworkError(networkState: NetInfoState, context?: Record<string, any>): AppError {
        if (!networkState.isConnected) {
            return new CustomError(
                ErrorCode.NETWORK_OFFLINE,
                getErrorMessage(ErrorCode.NETWORK_OFFLINE),
                ErrorSeverity.HIGH,
                ErrorCategory.NETWORK,
                null,
                { ...context, networkState }
            ).toJSON();
        }

        return new CustomError(
            ErrorCode.NETWORK_CONNECTION_LOST,
            getErrorMessage(ErrorCode.NETWORK_CONNECTION_LOST),
            ErrorSeverity.MEDIUM,
            ErrorCategory.NETWORK,
            null,
            { ...context, networkState }
        ).toJSON();
    }

    /**
     * Create a custom error
     */
    createError(
        code: ErrorCode,
        message?: string,
        severity: ErrorSeverity = ErrorSeverity.MEDIUM,
        category: ErrorCategory = ErrorCategory.UNKNOWN,
        originalError?: any,
        context?: Record<string, any>
    ): AppError {
        const error = new CustomError(
            code,
            message || getErrorMessage(code),
            severity,
            category,
            originalError,
            context
        );

        errorLogger.logError(error.toJSON());
        return error.toJSON();
    }
}

export const errorHandler = new ErrorHandler();
export default errorHandler;

