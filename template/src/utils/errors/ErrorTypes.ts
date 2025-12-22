/**
 * Error Types and Enums
 * Defines all error types used in the application
 */

export enum ErrorCode {
    // Network Errors (1000-1999)
    NETWORK_ERROR = 1000,
    NETWORK_TIMEOUT = 1001,
    NETWORK_OFFLINE = 1002,
    NETWORK_CONNECTION_LOST = 1003,

    // API Errors (2000-2999)
    API_ERROR = 2000,
    API_BAD_REQUEST = 2001,
    API_UNAUTHORIZED = 2002,
    API_FORBIDDEN = 2003,
    API_NOT_FOUND = 2004,
    API_CONFLICT = 2005,
    API_VALIDATION_ERROR = 2006,
    API_SERVER_ERROR = 2007,
    API_SERVICE_UNAVAILABLE = 2008,

    // Authentication Errors (3000-3999)
    AUTH_ERROR = 3000,
    AUTH_TOKEN_EXPIRED = 3001,
    AUTH_TOKEN_INVALID = 3002,
    AUTH_USER_NOT_FOUND = 3003,
    AUTH_WRONG_PASSWORD = 3004,
    AUTH_ACCOUNT_DISABLED = 3005,

    // Business Logic Errors (4000-4999)
    BUSINESS_ERROR = 4000,
    VALIDATION_ERROR = 4001,
    PERMISSION_DENIED = 4002,
    RESOURCE_NOT_FOUND = 4003,
    OPERATION_FAILED = 4004,

    // System Errors (5000-5999)
    SYSTEM_ERROR = 5000,
    STORAGE_ERROR = 5001,
    FILE_ERROR = 5002,
    DATABASE_ERROR = 5003,
    UNKNOWN_ERROR = 5999,
}

export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export enum ErrorCategory {
    NETWORK = 'network',
    API = 'api',
    AUTHENTICATION = 'authentication',
    BUSINESS = 'business',
    SYSTEM = 'system',
    UNKNOWN = 'unknown',
}

export interface AppError {
    code: ErrorCode;
    message: string;
    severity: ErrorSeverity;
    category: ErrorCategory;
    originalError?: any;
    timestamp: Date;
    context?: Record<string, any>;
    stack?: string;
    recoverable?: boolean;
}

export class CustomError extends Error implements AppError {
    public readonly code: ErrorCode;
    public readonly severity: ErrorSeverity;
    public readonly category: ErrorCategory;
    public readonly timestamp: Date;
    public readonly context?: Record<string, any>;
    public readonly recoverable: boolean;
    public readonly originalError?: any;

    constructor(
        code: ErrorCode,
        message: string,
        severity: ErrorSeverity = ErrorSeverity.MEDIUM,
        category: ErrorCategory = ErrorCategory.UNKNOWN,
        originalError?: any,
        context?: Record<string, any>,
        recoverable: boolean = true
    ) {
        super(message);
        this.name = 'CustomError';
        this.code = code;
        this.severity = severity;
        this.category = category;
        this.timestamp = new Date();
        this.context = context;
        this.recoverable = recoverable;
        this.originalError = originalError;

        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
    }

    toJSON(): AppError {
        return {
            code: this.code,
            message: this.message,
            severity: this.severity,
            category: this.category,
            timestamp: this.timestamp,
            context: this.context,
            stack: this.stack,
            recoverable: this.recoverable,
            originalError: this.originalError,
        };
    }
}

