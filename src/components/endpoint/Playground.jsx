/**
 * Playground Component - Interactive testing interface
 * 
 * This component enables users to test mock endpoints with:
 * - Editable headers, query parameters, and request body
 * - Multiple backend language options (Node.js, Python, Ruby)
 * - Language-specific cURL command generation
 * - Mock response simulation with validation
 * - Input presets and reset functionality
 */

import React, { useState, useEffect } from 'react';
import { FiPlay, FiRotateCcw, FiCopy, FiCode, FiTerminal } from 'react-icons/fi';
import { 
  prettyJSON, 
  copyToClipboard,
  getStatusCodeColor
} from '../../utils/endpointUtils';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { ENDPOINTS } from '../../constants/strings';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

// Helper function to capitalize first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Generate cURL command for any language
const generateCurlCommand = (endpoint, playgroundData, baseUrl) => {
  const headers = playgroundData.headers
    .filter(h => h.key && h.value)
    .map(h => `-H "${h.key}: ${h.value}"`)
    .join(' ');
  
  const queryParams = playgroundData.queryParams
    .filter(p => p.key && p.value)
    .map(p => `${p.key}=${p.value}`)
    .join('&');
  
  const url = queryParams 
    ? `${baseUrl}${endpoint.path}?${queryParams}`
    : `${baseUrl}${endpoint.path}`;
  
  let curl = `curl -X ${endpoint.method} "${url}"`;
  
  if (headers) {
    curl += ` ${headers}`;
  }
  
  if (playgroundData.requestBody && endpoint.requestBody) {
    curl += ` -d '${playgroundData.requestBody}'`;
  }
  
  return curl;
};

// Backend language configurations
const BACKEND_LANGUAGES = {
  nodejs: {
    name: 'Node.js',
    icon: '⚡',
    description: 'JavaScript/TypeScript',
    codeGenerator: (endpoint, playgroundData, baseUrl) => {
      const headers = playgroundData.headers
        .filter(h => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
      
      const queryParams = playgroundData.queryParams
        .filter(p => p.key && p.value)
        .reduce((acc, p) => ({ ...acc, [p.key]: p.value }), {});
      
      let code = `const axios = require('axios');\n\n`;
      
      const url = queryParams 
        ? `${baseUrl}${endpoint.path}?${Object.keys(queryParams).map(k => `${k}=${queryParams[k]}`).join('&')}`
        : `${baseUrl}${endpoint.path}`;
      
      code += `const url = "${url}";\n`;
      
      if (Object.keys(headers).length > 0) {
        code += `const headers = ${prettyJSON(headers)};\n`;
      }
      
      if (playgroundData.requestBody && endpoint.requestBody) {
        code += `const data = ${playgroundData.requestBody};\n`;
      }
      
      code += `\nconst response = await axios.${endpoint.method.toLowerCase()}(`;
      code += `url`;
      
      if (Object.keys(headers).length > 0) {
        code += `, { headers }`;
      }
      
      if (playgroundData.requestBody && endpoint.requestBody) {
        code += Object.keys(headers).length > 0 ? `, data` : `, { data }`;
      }
      
      code += `);\n`;
      code += `console.log(response.data);`;
      
      return code;
    },
    curlGenerator: generateCurlCommand
  },
  python: {
    name: 'Python',
    icon: '🐍',
    description: 'Python requests',
    codeGenerator: (endpoint, playgroundData, baseUrl) => {
      const headers = playgroundData.headers
        .filter(h => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
      
      const queryParams = playgroundData.queryParams
        .filter(p => p.key && p.value)
        .reduce((acc, p) => ({ ...acc, [p.key]: p.value }), {});
      
      let code = `import requests\n\n`;
      code += `url = "${baseUrl}${endpoint.path}"\n`;
      
      if (Object.keys(queryParams).length > 0) {
        code += `params = ${prettyJSON(queryParams)}\n`;
      }
      
      if (Object.keys(headers).length > 0) {
        code += `headers = ${prettyJSON(headers)}\n`;
      }
      
      if (playgroundData.requestBody && endpoint.requestBody) {
        code += `data = ${playgroundData.requestBody}\n`;
      }
      
      code += `\nresponse = requests.${endpoint.method.toLowerCase()}(`;
      code += `url`;
      
      if (Object.keys(queryParams).length > 0) {
        code += `, params=params`;
      }
      
      if (Object.keys(headers).length > 0) {
        code += `, headers=headers`;
      }
      
      if (playgroundData.requestBody && endpoint.requestBody) {
        code += `, json=data`;
      }
      
      code += `)\n`;
      code += `print(response.json())`;
      
      return code;
    },
    curlGenerator: generateCurlCommand
  },
  ruby: {
    name: 'Ruby',
    icon: '💎',
    description: 'Ruby Net::HTTP',
    codeGenerator: (endpoint, playgroundData, baseUrl) => {
      const headers = playgroundData.headers
        .filter(h => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
      
      const queryParams = playgroundData.queryParams
        .filter(p => p.key && p.value)
        .map(p => `${p.key}=${p.value}`)
        .join('&');
      
      let code = `require 'net/http'\nrequire 'json'\nrequire 'uri'\n\n`;
      
      const url = queryParams 
        ? `${baseUrl}${endpoint.path}?${queryParams}`
        : `${baseUrl}${endpoint.path}`;
      
      code += `uri = URI("${url}")\n`;
      code += `http = Net::HTTP.new(uri.host, uri.port)\n`;
      code += `http.use_ssl = true if uri.scheme == 'https'\n\n`;
      
      if (Object.keys(headers).length > 0) {
        code += `headers = ${prettyJSON(headers)}\n`;
      }
      
      if (playgroundData.requestBody && endpoint.requestBody) {
        code += `body = ${playgroundData.requestBody}\n`;
      }
      
      code += `request = Net::HTTP::${capitalize(endpoint.method)}.new(uri)\n`;
      
      if (Object.keys(headers).length > 0) {
        code += `headers.each { |key, value| request[key] = value }\n`;
      }
      
      if (playgroundData.requestBody && endpoint.requestBody) {
        code += `request.body = body.to_json\n`;
      }
      
      code += `\nresponse = http.request(request)\n`;
      code += `puts JSON.parse(response.body)`;
      
      return code;
    },
    curlGenerator: generateCurlCommand
  }
};

const Playground = ({ endpoint, baseUrl = API_BASE_URL }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('nodejs');
  const [playgroundData, setPlaygroundData] = useState({
    headers: [],
    queryParams: [],
    requestBody: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mockResponse, setMockResponse] = useState(null);
  const [copied, setCopied] = useState(false);
  const { showError, showWarning, showSuccess } = useSnackbar();

  // Generate cURL for selected language
  const generatedCurl = BACKEND_LANGUAGES[selectedLanguage]?.curlGenerator(endpoint, playgroundData, baseUrl) || '';

  // Validation functions
  const validateHeaders = () => {
    if (!endpoint.headers || endpoint.headers.length === 0) {
      return { isValid: true, missing: [] };
    }
    const requiredHeaders = endpoint.headers.filter(h => h.key && h.value);
    const providedHeaders = playgroundData.headers.filter(h => h.key && h.value);
    const missingHeaders = requiredHeaders.filter(required =>
      !providedHeaders.some(provided =>
        provided.key.toLowerCase() === required.key.toLowerCase() &&
        provided.value === required.value
      )
    );
    return {
      isValid: missingHeaders.length === 0,
      missing: missingHeaders.map(h => h.key)
    };
  };

  const validateQueryParams = () => {
    if (!endpoint.queryParams || endpoint.queryParams.length === 0) {
      return { isValid: true, missing: [] };
    }
    const requiredParams = endpoint.queryParams.filter(p => p.key && p.value);
    const providedParams = playgroundData.queryParams.filter(p => p.key && p.value);
    const missingParams = requiredParams.filter(required =>
      !providedParams.some(provided =>
        provided.key.toLowerCase() === required.key.toLowerCase() &&
        provided.value === required.value
      )
    );
    return {
      isValid: missingParams.length === 0,
      missing: missingParams.map(p => p.key)
    };
  };

  const validateRequestBody = () => {
    if (!endpoint.requestBody) {
      return { isValid: true };
    }
    if (!playgroundData.requestBody.trim()) {
      return { isValid: false, error: ENDPOINTS.MISSING_REQUIRED_REQUEST_BODY };
    }
    try {
      const parsedBody = JSON.parse(playgroundData.requestBody);
      const expectedSchema = endpoint.requestBody.schema || endpoint.requestBody;
      const requiredFields = Object.keys(expectedSchema);
      const providedFields = Object.keys(parsedBody);
      const missingFields = requiredFields.filter(field => !providedFields.includes(field));
      if (missingFields.length > 0) {
        return {
          isValid: false,
          error: `${ENDPOINTS.MISSING_REQUIRED_FIELDS_IN_REQUEST_BODY} ${missingFields.join(', ')}`
        };
      }
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: ENDPOINTS.INVALID_JSON_IN_REQUEST_BODY };
    }
  };

  const validateRequest = () => {
    const headerValidation = validateHeaders();
    const queryValidation = validateQueryParams();
    const bodyValidation = validateRequestBody();
    const errors = [];
    const warnings = [];
    if (!headerValidation.isValid) {
      errors.push(`${ENDPOINTS.MISSING_REQUIRED_HEADERS} ${headerValidation.missing.join(', ')}`);
    }
    if (!queryValidation.isValid) {
      errors.push(`${ENDPOINTS.MISSING_REQUIRED_QUERY_PARAMETERS} ${queryValidation.missing.join(', ')}`);
    }
    if (!bodyValidation.isValid) {
      errors.push(bodyValidation.error);
    }
    // Check for extra headers/params that might be unnecessary
    if (endpoint.headers && endpoint.headers.length > 0) {
      const extraHeaders = playgroundData.headers.filter(provided =>
        provided.key && provided.value &&
        !endpoint.headers.some(required =>
          required.key.toLowerCase() === provided.key.toLowerCase()
        )
      );
      if (extraHeaders.length > 0) {
        warnings.push(`${ENDPOINTS.EXTRA_HEADERS_PROVIDED} ${extraHeaders.map(h => h.key).join(', ')}`);
      }
    }
    if (endpoint.queryParams && endpoint.queryParams.length > 0) {
      const extraParams = playgroundData.queryParams.filter(provided =>
        provided.key && provided.value &&
        !endpoint.queryParams.some(required =>
          required.key.toLowerCase() === provided.key.toLowerCase()
        )
      );
      if (extraParams.length > 0) {
        warnings.push(`${ENDPOINTS.EXTRA_QUERY_PARAMETERS_PROVIDED} ${extraParams.map(p => p.key).join(', ')}`);
      }
    }
    return { isValid: errors.length === 0, errors, warnings };
  };

  // Copy functions with feedback
  const handleCopy = async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Playground functions
  const addKeyValue = (type) => {
    setPlaygroundData(prev => ({
      ...prev,
      [type]: [...prev[type], { key: '', value: '' }]
    }));
  };

  const updateKeyValue = (type, index, field, value) => {
    setPlaygroundData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeKeyValue = (type, index) => {
    setPlaygroundData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const resetToDefaults = () => {
    setPlaygroundData({
      headers: endpoint?.headers ? [...endpoint.headers] : [],
      queryParams: endpoint?.queryParams ? [...endpoint.queryParams] : [],
      requestBody: endpoint?.requestBody ? prettyJSON(endpoint.requestBody.schema || endpoint.requestBody) : ''
    });
    setMockResponse(null);
  };

  const sendMockRequest = async () => {
    setIsLoading(true);
    setMockResponse(null);

    // Validate request against endpoint specification
    const validation = validateRequest();

    if (!validation.isValid) {
      // Show errors and don't send response
      validation.errors.forEach(error => {
        showError(error);
      });
      validation.warnings.forEach(warning => {
        showWarning(warning);
      });
      setIsLoading(false);
      return;
    }

    // Show warnings if any
    validation.warnings.forEach(warning => {
      showWarning(warning);
    });

    // Show success message for valid request
    showSuccess(ENDPOINTS.REQUEST_VALIDATION_PASSED);

    // Simulate API call with random response time
    const responseTime = Math.floor(Math.random() * 200) + 50;
    
    setTimeout(() => {
      const response = {
        success: true,
        statusCode: endpoint?.responses?.[0]?.code || 200,
        responseTime,
        headers: {
          'Content-Type': 'application/json',
          'X-Response-Time': `${responseTime}ms`
        },
        body: endpoint?.responses?.[0]?.schema || { success: true, message: ENDPOINTS.MOCK_RESPONSE }
      };
      
      setMockResponse(response);
      setIsLoading(false);
    }, responseTime);
  };

  // Initialize playground with endpoint defaults
  useEffect(() => {
    if (endpoint) {
      resetToDefaults();
    }
  }, [endpoint]);

  if (!endpoint) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">{ENDPOINTS.NO_ENDPOINT_DATA}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Row: Language Selection + CTA Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {/* Language Selection */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{ENDPOINTS.LANGUAGE}</span>
            <div className="flex gap-2">
              {Object.entries(BACKEND_LANGUAGES).map(([key, language]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLanguage(key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    selectedLanguage === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{language.icon}</span>
                  <span className="font-medium">{language.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={sendMockRequest}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <FiPlay size={14} />
              {isLoading ? ENDPOINTS.SENDING : ENDPOINTS.SEND_REQUEST}
            </button>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
            >
              <FiRotateCcw size={14} />
              {ENDPOINTS.RESET}
            </button>
          </div>
        </div>
      </div>

      {/* cURL + Response Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generated cURL */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FiTerminal size={16} />
              {ENDPOINTS.CURL_COMMAND}
            </h2>
            <button
              onClick={() => handleCopy(generatedCurl)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              <FiCopy size={12} />
              {copied ? ENDPOINTS.COPIED : ENDPOINTS.COPY}
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-24 overflow-y-auto">
            <pre className="text-xs text-gray-800 dark:text-gray-200">
              <code>{generatedCurl}</code>
            </pre>
          </div>
        </div>

        {/* Mock Response */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{ENDPOINTS.RESPONSE}</h2>
          {mockResponse ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusCodeColor(mockResponse.statusCode)}`}>
                  {mockResponse.statusCode}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {mockResponse.responseTime}ms
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-48 overflow-y-auto">
                <pre className="text-xs text-gray-800 dark:text-gray-200">
                  <code>{prettyJSON(mockResponse.body)}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <FiPlay size={20} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">{ENDPOINTS.CLICK_TO_SEE_RESPONSE}</p>
            </div>
          )}
        </div>
      </div>

      {/* Headers + Query Parameters Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{ENDPOINTS.HEADERS}</h2>
            <button
              onClick={() => addKeyValue('headers')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
            >
              {ENDPOINTS.ADD}
            </button>
          </div>
          <div className="space-y-2">
            {playgroundData.headers.map((header, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder={ENDPOINTS.HEADER_KEY}
                  value={header.key}
                  onChange={(e) => updateKeyValue('headers', index, 'key', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="text"
                  placeholder={ENDPOINTS.HEADER_VALUE}
                  value={header.value}
                  onChange={(e) => updateKeyValue('headers', index, 'value', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={() => removeKeyValue('headers', index)}
                  className="px-2 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Query Parameters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{ENDPOINTS.QUERY_PARAMETERS}</h2>
            <button
              onClick={() => addKeyValue('queryParams')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
            >
              {ENDPOINTS.ADD}
            </button>
          </div>
          <div className="space-y-2">
            {playgroundData.queryParams.map((param, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder={ENDPOINTS.QUERY_KEY}
                  value={param.key}
                  onChange={(e) => updateKeyValue('queryParams', index, 'key', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="text"
                  placeholder={ENDPOINTS.QUERY_VALUE}
                  value={param.value}
                  onChange={(e) => updateKeyValue('queryParams', index, 'value', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={() => removeKeyValue('queryParams', index)}
                  className="px-2 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Body */}
      {endpoint.requestBody && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{ENDPOINTS.REQUEST_BODY}</h2>
          <textarea
            value={playgroundData.requestBody}
            onChange={(e) => setPlaygroundData(prev => ({ ...prev, requestBody: e.target.value }))}
            placeholder={ENDPOINTS.ENTER_JSON_REQUEST_BODY}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
          />
        </div>
      )}
    </div>
  );
};

export default Playground; 