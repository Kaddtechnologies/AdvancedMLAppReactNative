import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Sentry from '@sentry/react-native';
import { checkOnlineStatus } from '../utils/networkMonitor';

// Base URL from the project specifications
const API_BASE_URL = 'https://deaconapi.myworkatcornerstone.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Platform': Platform.OS,
    'App-Version': '2.0.22', // Add app version to headers for debugging
  },
  timeout: 30000, // 30 seconds timeout
});

// Interceptor to add auth token to requests and handle offline state
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Check if device is online before making request
      const isOnline = await checkOnlineStatus();
      if (!isOnline) {
        // Add breadcrumb for offline request attempt
        Sentry.addBreadcrumb({
          category: 'network',
          message: `Attempted API request while offline: ${config.url}`,
          level: 'warning',
          data: {
            url: config.url,
            method: config.method,
          },
        });

        throw new Error('Device is offline. Please check your internet connection.');
      }

      // Add request start time for performance tracking
      // Use a type assertion to add custom property
      (config as any).startTime = new Date().getTime();

      // Add auth token to request
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add breadcrumb for API request
      Sentry.addBreadcrumb({
        category: 'api',
        message: `API Request: ${config.method?.toUpperCase()} ${config.url}`,
        level: 'info',
        data: {
          url: config.url,
          method: config.method,
          params: config.params,
        },
      });

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      Sentry.captureException(error, {
        tags: {
          component: 'ApiConfig',
          interceptor: 'request',
        },
      });
      return Promise.reject(error);
    }
  },
  (error) => {
    Sentry.captureException(error, {
      tags: {
        component: 'ApiConfig',
        interceptor: 'request_error',
      },
    });
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    try {
      // Calculate request duration for performance monitoring
      const { config } = response;
      if ((config as any).startTime) {
        const endTime = new Date().getTime();
        const duration = endTime - (config as any).startTime;

        // Add breadcrumb for successful API response
        Sentry.addBreadcrumb({
          category: 'api',
          message: `API Response: ${response.status} ${config.method?.toUpperCase()} ${config.url}`,
          level: 'info',
          data: {
            url: config.url,
            status: response.status,
            duration: `${duration}ms`,
          },
        });

        // Log slow requests (over 1 second)
        if (duration > 1000) {
          console.warn(`Slow API request: ${config.method?.toUpperCase()} ${config.url} took ${duration}ms`);
          Sentry.addBreadcrumb({
            category: 'performance',
            message: `Slow API request: ${config.method?.toUpperCase()} ${config.url}`,
            level: 'warning',
            data: {
              url: config.url,
              duration: `${duration}ms`,
            },
          });
        }
      }

      return response;
    } catch (error) {
      console.error('Error in response success handler:', error);
      return response;
    }
  },
  async (error) => {
    try {
      const originalRequest = error.config;

      // Add breadcrumb for API error
      Sentry.addBreadcrumb({
        category: 'api',
        message: `API Error: ${error.response?.status || 'Network Error'} ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
        level: 'error',
        data: {
          url: originalRequest?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        },
      });

      // Handle network errors
      if (!error.response) {
        Sentry.captureMessage(`Network error: ${error.message}`, 'error');
        return Promise.reject(new Error('Network error. Please check your internet connection.'));
      }

      // Handle 401 Unauthorized errors with token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Get the user ID from Firebase if possible
          const FirebaseService = require('./FirebaseService').default;
          let userId = 'a6d3028d-a025-493f-a75a-8ee5e88ff52b'; // Default fallback
          let email = 'DavidRJones3@gmail.com'; // Default fallback

          try {
            const firebaseUser = FirebaseService.getCurrentUser();
            if (firebaseUser) {
              userId = firebaseUser.uid;
              email = firebaseUser.email || email;

              Sentry.addBreadcrumb({
                category: 'auth',
                message: 'Using Firebase user for token refresh',
                level: 'info',
                data: { userId, email }
              });
            }
          } catch (userError) {
            console.warn('Error getting Firebase user, using default:', userError);
          }

          // Add breadcrumb for token refresh attempt
          Sentry.addBreadcrumb({
            category: 'auth',
            message: 'Attempting to refresh auth token',
            level: 'info',
          });

          // Get a new token using the test endpoint
          const response = await axios.get(
            `${API_BASE_URL}/api/Default/GenerateTestToken`,
            {
              params: {
                userId,
                email
              }
            }
          );

          if (response.data?.token) {
            await SecureStore.setItemAsync('auth_token', response.data.token);
            apiClient.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;

            // Add breadcrumb for successful token refresh
            Sentry.addBreadcrumb({
              category: 'auth',
              message: 'Auth token refreshed successfully',
              level: 'info',
            });

            return apiClient(originalRequest);
          } else {
            throw new Error('Failed to refresh token: No token in response');
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          Sentry.captureException(refreshError, {
            tags: {
              component: 'ApiConfig',
              action: 'token_refresh',
            },
          });
          return Promise.reject(new Error('Authentication failed. Please try again later.'));
        }
      }

      // Handle other error statuses
      switch (error.response.status) {
        case 400:
          return Promise.reject(new Error('Bad request. Please check your input.'));
        case 403:
          return Promise.reject(new Error('Access denied. You do not have permission to access this resource.'));
        case 404:
          return Promise.reject(new Error('Resource not found.'));
        case 500:
          Sentry.captureMessage(`Server error: ${error.response.data?.message || 'Unknown server error'}`, 'error');
          return Promise.reject(new Error('Server error. Please try again later.'));
        default:
          return Promise.reject(error);
      }
    } catch (handlerError) {
      console.error('Error in response error handler:', handlerError);
      Sentry.captureException(handlerError, {
        tags: {
          component: 'ApiConfig',
          interceptor: 'response_error_handler',
        },
      });
      return Promise.reject(error);
    }
  }
);

export default apiClient;