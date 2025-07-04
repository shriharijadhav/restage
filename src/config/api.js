// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Endpoints that should never be cancelled
  NON_CANCELLABLE_ENDPOINTS: [
    '/api/auth/me',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/logout'
  ],
  
  // Endpoints that should log request started
  LOG_REQUEST_STARTED_ENDPOINTS: [
    '/api/projects',
    '/api/endpoints',
    '/api/modules'
  ],
  
  // Endpoints that should log response data
  LOG_RESPONSE_DATA_ENDPOINTS: [
    '/api/projects',
    '/api/endpoints',
    '/api/modules'
  ]
};

// Environment configuration
export const ENV_CONFIG = {
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  IS_DEVELOPMENT: import.meta.env.VITE_NODE_ENV === 'development',
  IS_PRODUCTION: import.meta.env.VITE_NODE_ENV === 'production'
}; 