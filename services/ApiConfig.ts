import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Base URL from the project specifications
const API_BASE_URL = 'https://deaconapi.myworkatcornerstone.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Platform': Platform.OS,
  },
  timeout: 30000, // 30 seconds timeout
});

// Interceptor to add auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // For this app, we're using a fixed Firebase UUID
        const userId = 'a6d3028d-a025-493f-a75a-8ee5e88ff52b';
        const email = 'DavidRJones3@gmail.com';

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
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;