import React, { useState } from 'react';
import { FiDownload, FiCopy } from 'react-icons/fi';
import PropTypes from 'prop-types';

/**
 * ResponseViewer component for displaying response data
 * @param {Object} props - Component props
 * @param {Object|string} props.responseBody - The response body data
 * @param {number} props.statusCode - The HTTP status code
 * @param {Function} props.onCopy - Function to handle copying the response body
 */
const ResponseViewer = ({ responseBody, statusCode, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const responseText = typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody, null, 2);
    await onCopy(responseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusCodeColor = (code) => {
    if (code >= 200 && code < 300) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (code >= 400 && code < 500) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else if (code >= 500) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getStatusText = (code) => {
    const statusTexts = {
      200: 'OK',
      201: 'Created',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error'
    };
    return statusTexts[code] || 'Unknown';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <FiDownload size={20} />
        Response
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusCodeColor(statusCode)}`}>
            {statusCode}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getStatusText(statusCode)}
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Body</span>
            <button
              onClick={handleCopy}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1"
            >
              <FiCopy size={14} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
            <code>
              {typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody, null, 2)}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

ResponseViewer.propTypes = {
  responseBody: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  statusCode: PropTypes.number.isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default ResponseViewer; 