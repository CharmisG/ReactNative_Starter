import { ErrorCode } from './ErrorTypes';
import Translate from '../../hooks/Translate';

/**
 * Error message keys for localization
 */
const ErrorMessageKeys: Record<ErrorCode, string> = {
    // Network Errors
    [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection.',
    [ErrorCode.NETWORK_TIMEOUT]: 'Request timed out. Please try again.',
    [ErrorCode.NETWORK_OFFLINE]: 'You are offline. Please check your internet connection.',
    [ErrorCode.NETWORK_CONNECTION_LOST]: 'Connection lost. Please try again.',

    // API Errors
    [ErrorCode.API_ERROR]: 'An error occurred. Please try again.',
    [ErrorCode.API_BAD_REQUEST]: 'Invalid request. Please check your input.',
    [ErrorCode.API_UNAUTHORIZED]: 'You are not authorized. Please login again.',
    [ErrorCode.API_FORBIDDEN]: 'Access denied. You don\'t have permission.',
    [ErrorCode.API_NOT_FOUND]: 'Resource not found.',
    [ErrorCode.API_CONFLICT]: 'A conflict occurred. Please try again.',
    [ErrorCode.API_VALIDATION_ERROR]: 'Validation error. Please check your input.',
    [ErrorCode.API_SERVER_ERROR]: 'Server error. Please try again later.',
    [ErrorCode.API_SERVICE_UNAVAILABLE]: 'Service unavailable. Please try again later.',

    // Authentication Errors
    [ErrorCode.AUTH_ERROR]: 'Authentication error. Please login again.',
    [ErrorCode.AUTH_TOKEN_EXPIRED]: 'Session expired. Please login again.',
    [ErrorCode.AUTH_TOKEN_INVALID]: 'Invalid session. Please login again.',
    [ErrorCode.AUTH_USER_NOT_FOUND]: 'User not found.',
    [ErrorCode.AUTH_WRONG_PASSWORD]: 'Incorrect password.',
    [ErrorCode.AUTH_ACCOUNT_DISABLED]: 'Account disabled. Please contact support.',

    // Business Logic Errors
    [ErrorCode.BUSINESS_ERROR]: 'An error occurred. Please try again.',
    [ErrorCode.VALIDATION_ERROR]: 'Validation error. Please check your input.',
    [ErrorCode.PERMISSION_DENIED]: 'Permission denied.',
    [ErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found.',
    [ErrorCode.OPERATION_FAILED]: 'Operation failed. Please try again.',

    // System Errors
    [ErrorCode.SYSTEM_ERROR]: 'System error. Please try again later.',
    [ErrorCode.STORAGE_ERROR]: 'Storage error. Please try again.',
    [ErrorCode.FILE_ERROR]: 'File error. Please try again.',
    [ErrorCode.DATABASE_ERROR]: 'Database error. Please try again.',
    [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

/**
 * Get user-friendly error message (localized)
 */
export const getErrorMessage = (code: ErrorCode, customMessage?: string): string => {
    const defaultMessage = ErrorMessageKeys[code] || ErrorMessageKeys[ErrorCode.UNKNOWN_ERROR];
    const message = customMessage || defaultMessage;

    // Try to translate, fallback to original message if translation fails
    try {
        return Translate(message) || message;
    } catch {
        return message;
    }
};

/**
 * Get error message key (for direct translation)
 */
export const getErrorMessageKey = (code: ErrorCode): string => {
    return ErrorMessageKeys[code] || ErrorMessageKeys[ErrorCode.UNKNOWN_ERROR];
};

/**
 * Export error message keys for reference
 */
export const ErrorMessages = ErrorMessageKeys;

