import React, { useState } from 'react';
import { FiSend, FiCopy } from 'react-icons/fi';
import PropTypes from 'prop-types';

/**
 * RequestBodyViewer component for displaying request body JSON
 * @param {Object} props - Component props
 * @param {Object|string} props.requestBody - The request body data
 * @param {Function} props.onCopy - Function to handle copying the request body
 */
const RequestBodyViewer = ({ requestBody, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const bodyText = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody, null, 2);
    await onCopy(bodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!requestBody) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <FiSend size={20} />
        Request Body
      </h2>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Schema</span>
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
            {typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody, null, 2)}
          </code>
        </pre>
      </div>
    </div>
  );
};

RequestBodyViewer.propTypes = {
  requestBody: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onCopy: PropTypes.func.isRequired,
};

export default RequestBodyViewer; 