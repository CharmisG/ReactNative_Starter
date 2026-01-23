import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { errorHandler } from '../utils/errors/ErrorHandler';

/**
 * Setup Axios Interceptors for error handling
 */
export const setupApiInterceptors = (axiosInstance: AxiosInstance): void => {
    // Request interceptor
    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            // Add any request modifications here
            // e.g., add auth token, modify headers
            return config;
        },
        (error) => {
            // Handle request error
            const appError = errorHandler.handleError(error, {
                type: 'request',
            });
            return Promise.reject(appError);
        }
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            // Handle successful response
            return response;
        },
        (error) => {
            // Handle response error
            const appError = errorHandler.handleError(error, {
                type: 'response',
            });
            return Promise.reject(appError);
        }
    );
};

/**
 * Create axios instance with error handling
 */
export const createApiInstance = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        timeout: 30000, // 30 seconds
    });

    setupApiInterceptors(instance);
    return instance;
};

