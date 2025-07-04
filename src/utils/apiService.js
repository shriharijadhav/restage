import axios from 'axios';
import { logout } from '../features/userSlice';
import { API_CONFIG } from '../config/api';
import store from '../store';

// Base URL configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Endpoints that should NEVER be cancelled
 */
const NON_CANCELLABLE_ENDPOINTS = [
  '/api/auth/me',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout'
];

/**
 * Endpoints that should log request started - add new endpoints here when needed
 */
const LOG_REQUEST_STARTED_ENDPOINTS = [
  '/api/projects',
  '/api/endpoints',
  '/api/modules'
];

/**
 * Endpoints that should log response data - add new endpoints here when needed
 */
const LOG_RESPONSE_DATA_ENDPOINTS = [
  '/api/projects',
  '/api/endpoints',
  '/api/modules'
];

const formatEndpointToEventName = (url) => {
  try {
    const apiPath = url.split('/api/')[1];
    if (!apiPath) return 'unknown_endpoint';
    const formattedPath = apiPath
      .split('?')[0]
      .replace(/[-/]/g, '_')
      .replace(/\/$/, '');
    return formattedPath;
  } catch (error) {
    console.error('Error formatting endpoint:', error);
    return 'unknown_endpoint';
  }
};

const shouldLogRequestStarted = (url) => {
  return API_CONFIG.LOG_REQUEST_STARTED_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

const shouldLogResponseData = (url) => {
  return API_CONFIG.LOG_RESPONSE_DATA_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true, // Important for cookie-based auth
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const pendingRequests = new Map();

// Request Interceptor
axiosInstance.interceptors.request.use(async (config) => {
  // Add request cancellation logic
  const controller = new AbortController();
  config.signal = config.signal || controller.signal;

  const requestKey = `${config.method}-${config.url}-${JSON.stringify(config.params || {})}`;
  if (!pendingRequests.has(requestKey)) {
    pendingRequests.set(requestKey, { controller, url: config.url });
  }

  // Log request if needed
  if (shouldLogRequestStarted(config.url)) {
    const eventName = formatEndpointToEventName(config.url);
    console.log(`API Request Started: ${eventName}`, {
      endpoint: config.url,
      method: config.method,
      timestamp: new Date().toISOString(),
    });
  }

  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method}-${response.config.url}-${JSON.stringify(response.config.params || {})}`;
    pendingRequests.delete(requestKey);

    const eventName = formatEndpointToEventName(response.config.url);
    const shouldLogData = shouldLogResponseData(response.config.url);

    if (shouldLogData) {
      console.log(`API Request Success: ${eventName}`, {
        endpoint: response.config.url,
        method: response.config.method,
        status: response.status,
        timestamp: new Date().toISOString(),
      });
    }

    return response;
  },

  async (error) => {
    if (!error.response) {
      const eventName = formatEndpointToEventName(error.config?.url || '');
      console.error(`API Request Failed (Network Error): ${eventName}`, {
        endpoint: error.config?.url,
        method: error.config?.method,
        error: {
          message: error.message,
          code: 'NETWORK_ERROR',
        },
        timestamp: new Date().toISOString(),
      });
      return Promise.reject(error);
    }

    const requestKey = `${error.config.method}-${error.config.url}`;
    pendingRequests.delete(requestKey);

    const eventName = formatEndpointToEventName(error.config.url);
    console.error(`API Request Failed: ${eventName}`, {
      endpoint: error.config.url,
      method: error.config.method,
      error: {
        message: error.message,
        status: error.response.status,
        data: error.response.data,
      },
      timestamp: new Date().toISOString(),
    });

    // Handle specific error status codes
    switch (error.response.status) {
      case 401:
        // Unauthorized - clear user state and redirect to login
        store.dispatch(logout());
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        break;
      case 403:
        // Forbidden - you can add specific handling here
        console.warn('Access forbidden for this resource');
        break;
      case 500:
        // Server error
        console.error('Server error occurred');
        break;
    }

    return Promise.reject(error);
  }
);

/**
 * Cancels all requests except the ones in NON_CANCELLABLE_ENDPOINTS
 */
export const cancelAllRequests = () => {
  pendingRequests.forEach(({ controller, url }, key) => {
    const isNonCancellable = API_CONFIG.NON_CANCELLABLE_ENDPOINTS.some(endpoint => url?.includes(endpoint));
    if (!isNonCancellable) {
      controller.abort();
      pendingRequests.delete(key);
    }
  });
};

/**
 * Generic API connector function
 */
export const apiConnector = (method, url, bodyData = null, headers = null, params = null, signal = null) => {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers,
    params,
    signal
  });
};

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get: (url, params = null, signal = null) => apiConnector('GET', url, null, null, params, signal),
  post: (url, data = null, signal = null) => apiConnector('POST', url, data, null, null, signal),
  put: (url, data = null, signal = null) => apiConnector('PUT', url, data, null, null, signal),
  patch: (url, data = null, signal = null) => apiConnector('PATCH', url, data, null, null, signal),
  delete: (url, signal = null) => apiConnector('DELETE', url, null, null, null, signal),
};

export default axiosInstance; 