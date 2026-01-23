import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ErrorCode, ErrorSeverity, ErrorCategory } from '../utils/errors/ErrorTypes';
import { errorHandler } from '../utils/errors/ErrorHandler';
import { getErrorMessage } from '../utils/errors/ErrorMessages';
import Colors from '../styles/Colors';
import { fontHeight } from '../styles/Fonts';
import Translate from '../hooks/Translate';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * React Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to error handler
        const appError = errorHandler.createError(
            ErrorCode.SYSTEM_ERROR,
            error.message,
            ErrorSeverity.CRITICAL,
            ErrorCategory.SYSTEM,
            error,
            {
                componentStack: errorInfo.componentStack,
            }
        );

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.title}>{Translate('Something went wrong')}</Text>
                        <Text style={styles.message}>
                            {this.state.error?.message || Translate('An unexpected error occurred')}
                        </Text>
                        {__DEV__ && this.state.error && (
                            <Text style={styles.stack}>{this.state.error.stack}</Text>
                        )}
                        <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                            <Text style={styles.buttonText}>{Translate('Try Again')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 20,
    },
    content: {
        alignItems: 'center',
        maxWidth: 400,
    },
    title: {
        fontSize: fontHeight.FONT24,
        fontWeight: '700',
        color: Colors.errorText,
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: fontHeight.FONT16,
        color: Colors.charcoal,
        marginBottom: 24,
        textAlign: 'center',
    },
    stack: {
        fontSize: fontHeight.FONT12,
        color: Colors.grey,
        marginBottom: 24,
        textAlign: 'left',
        fontFamily: 'monospace',
    },
    button: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: Colors.white,
        fontSize: fontHeight.FONT16,
        fontWeight: '600',
    },
});

export default ErrorBoundary;

