/**
 * Utility functions for endpoint-related operations
 */

/**
 * Formats JSON data with proper indentation
 * @param {any} data - Data to format
 * @returns {string} Formatted JSON string
 */
export const prettyJSON = (data) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return String(data);
  }
};

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

/**
 * Generates cURL command for an endpoint
 * @param {Object} endpoint - Endpoint object
 * @param {string} baseUrl - Base URL for the API
 * @returns {string} cURL command
 */
export const generateCurlCommand = (endpoint, baseUrl) => {
  if (!endpoint) return '';
  
  let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;
  
  if (endpoint.headers && endpoint.headers.length > 0) {
    endpoint.headers.forEach(header => {
      curl += ` -H "${header.key}: ${header.value}"`;
    });
  }
  
  if (endpoint.requestBody) {
    curl += ` -d '${endpoint.requestBody}'`;
  }
  
  return curl;
};

/**
 * Gets color classes for HTTP method
 * @param {string} method - HTTP method
 * @returns {string} Tailwind CSS classes
 */
export const getMethodColor = (method) => {
  const colors = {
    GET: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    PATCH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[method] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

/**
 * Gets color classes for HTTP status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Tailwind CSS classes
 */
export const getStatusCodeColor = (statusCode) => {
  if (statusCode >= 200 && statusCode < 300) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  } else if (statusCode >= 500) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

/**
 * Gets human-readable status text for HTTP status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Status text
 */
export const getStatusText = (statusCode) => {
  const statusTexts = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error'
  };
  return statusTexts[statusCode] || 'Unknown';
};

/**
 * Formats date to locale string
 * @param {string} iso - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (iso) => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleString();
}; 