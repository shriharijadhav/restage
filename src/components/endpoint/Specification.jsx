/**
 * Specification Component - Displays complete endpoint definition
 * 
 * This component shows all details related to the endpoint in a structured format:
 * - Method & Path
 * - Module Name and Version
 * - Created By and Created At
 * - Headers, Query Parameters, Request Body Schema
 * - Sample Response Body and Status Code
 * - Possible Errors
 */

import React, { useState } from 'react';
import { FiCopy, FiExternalLink, FiClock, FiUser, FiTag } from 'react-icons/fi';
import { 
  prettyJSON, 
  getMethodColor,
  getStatusCodeColor,
  getStatusText,
  formatDate,
  copyToClipboard
} from '../../utils/endpointUtils';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

// Language configurations for examples
const EXAMPLE_LANGUAGES = {
  nodejs: {
    name: 'Node.js',
    icon: '⚡',
    description: 'JavaScript/TypeScript',
    codeGenerator: (endpoint, baseUrl) => {
      const headers = endpoint.headers
        ?.filter(h => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}) || {};
      
      let code = `const axios = require('axios');\n\n`;
      
      if (Object.keys(headers).length > 0) {
        code += `const headers = ${prettyJSON(headers)};\n`;
      }
      
      if (endpoint.requestBody) {
        const requestData = endpoint.requestBody.schema || endpoint.requestBody;
        code += `const data = ${prettyJSON(requestData)};\n`;
      }
      
      code += `const response = await axios.${endpoint.method.toLowerCase()}(`;
      code += `'${baseUrl}${endpoint.path}'`;
      
      if (Object.keys(headers).length > 0) {
        code += `, { headers }`;
      }
      
      if (endpoint.requestBody) {
        code += Object.keys(headers).length > 0 ? `, data` : `, { data }`;
      }
      
      code += `);\n`;
      code += `console.log(response.data);`;
      
      return code;
    }
  },
  python: {
    name: 'Python',
    icon: '🐍',
    description: 'Python requests',
    codeGenerator: (endpoint, baseUrl) => {
      const headers = endpoint.headers
        ?.filter(h => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}) || {};
      
      let code = `import requests\n\n`;
      
      if (Object.keys(headers).length > 0) {
        code += `headers = ${prettyJSON(headers)}\n`;
      }
      
      if (endpoint.requestBody) {
        const requestData = endpoint.requestBody.schema || endpoint.requestBody;
        code += `data = ${prettyJSON(requestData)}\n`;
      }
      
      code += `response = requests.${endpoint.method.toLowerCase()}(`;
      code += `'${baseUrl}${endpoint.path}'`;
      
      if (Object.keys(headers).length > 0) {
        code += `, headers=headers`;
      }
      
      if (endpoint.requestBody) {
        code += `, json=data`;
      }
      
      code += `)\n`;
      code += `print(response.json())`;
      
      return code;
    }
  },
  ruby: {
    name: 'Ruby',
    icon: '💎',
    description: 'Ruby Net::HTTP',
    codeGenerator: (endpoint, baseUrl) => {
      const headers = endpoint.headers
        ?.filter(h => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}) || {};
      
      let code = `require 'net/http'\nrequire 'json'\nrequire 'uri'\n\n`;
      
      code += `uri = URI('${baseUrl}${endpoint.path}')\n`;
      code += `http = Net::HTTP.new(uri.host, uri.port)\n`;
      code += `http.use_ssl = true if uri.scheme == 'https'\n\n`;
      
      if (Object.keys(headers).length > 0) {
        code += `headers = ${prettyJSON(headers)}\n`;
      }
      
      if (endpoint.requestBody) {
        const requestData = endpoint.requestBody.schema || endpoint.requestBody;
        code += `body = ${prettyJSON(requestData)}\n`;
      }
      
      code += `request = Net::HTTP::${endpoint.method.charAt(0).toUpperCase() + endpoint.method.slice(1).toLowerCase()}.new(uri)\n`;
      
      if (Object.keys(headers).length > 0) {
        code += `headers.each { |key, value| request[key] = value }\n`;
      }
      
      if (endpoint.requestBody) {
        code += `request.body = body.to_json\n`;
      }
      
      code += `\nresponse = http.request(request)\n`;
      code += `puts JSON.parse(response.body)`;
      
      return code;
    }
  }
};

const Specification = ({ endpoint, baseUrl = API_BASE_URL }) => {
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('nodejs');

  // Define requestData at component level
  const requestData = endpoint?.requestBody?.schema || endpoint?.requestBody;

  // Debug: Check what baseUrl is being used
  console.log('Specification baseUrl:', baseUrl, 'API_BASE_URL:', API_BASE_URL);

  const handleCopy = async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate example code for selected language
  const generatedExample = EXAMPLE_LANGUAGES[selectedLanguage]?.codeGenerator(endpoint, baseUrl) || '';

  if (!endpoint) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No endpoint data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* API Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Schema */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Request Schema</h2>
          
          {/* Method & URL */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Endpoint</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                {endpoint.method} {baseUrl}{endpoint.path}
              </code>
            </div>
          </div>

          {/* Headers */}
          {endpoint.headers && endpoint.headers.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Required Headers</h3>
              <div className="space-y-2">
                {endpoint.headers.map((header, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{header.key}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{header.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Query Parameters */}
          {endpoint.queryParams && endpoint.queryParams.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Query Parameters</h3>
              <div className="space-y-2">
                {endpoint.queryParams.map((param, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{param.key}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{param.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Body */}
          {endpoint.requestBody && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Request Body Schema</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                  <code>{prettyJSON(endpoint.requestBody.schema || endpoint.requestBody)}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Response Schema */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Response Schema</h2>
          
          {/* Status Code */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Status Code</h3>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusCodeColor(endpoint.responses?.[0]?.code || 200)}`}>
                {endpoint.responses?.[0]?.code || 200}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getStatusText(endpoint.responses?.[0]?.code || 200)}
              </span>
            </div>
          </div>

          {/* Response Body */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Response Body</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                <code>{prettyJSON(endpoint.responses?.[0]?.schema || {})}</code>
              </pre>
            </div>
          </div>

          {/* Error Responses */}
          {endpoint.errors && endpoint.errors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Error Responses</h3>
              <div className="space-y-2">
                {endpoint.errors.map((error, index) => (
                  <div key={index} className="border border-red-200 dark:border-red-800 rounded-lg p-3 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusCodeColor(error.code)}`}>
                        {error.code}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {error.message}
                      </span>
                    </div>
                    {error.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">{error.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usage Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Usage Examples</h2>
          
          {/* Language Selection */}
          <div className="flex gap-2 mb-4">
            {Object.entries(EXAMPLE_LANGUAGES).map(([key, language]) => (
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

          {/* Generated Code */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {EXAMPLE_LANGUAGES[selectedLanguage]?.name} Example
              </h3>
              <button
                onClick={() => handleCopy(generatedExample)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <FiCopy size={12} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                <code>{generatedExample}</code>
              </pre>
            </div>
          </div>

          {/* cURL Example */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">cURL</h3>
              <button
                onClick={() => {
                  const curlCommand = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"${endpoint.headers?.map(h => ` -H "${h.key}: ${h.value}"`).join('') || ''}${requestData ? ` -d '${prettyJSON(requestData)}'` : ''}`;
                  handleCopy(curlCommand);
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <FiCopy size={12} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                <code>
                  curl -X {endpoint.method} "{baseUrl}{endpoint.path}"{endpoint.headers?.map(h => ` -H "${h.key}: ${h.value}"`).join('') || ''}{requestData ? ` -d '${prettyJSON(requestData)}'` : ''}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specification;