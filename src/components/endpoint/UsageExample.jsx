import React, { useState } from 'react';
import { FiCode, FiCopy } from 'react-icons/fi';
import PropTypes from 'prop-types';

/**
 * UsageExample component for displaying cURL commands
 * @param {Object} props - Component props
 * @param {string} props.curlCommand - The cURL command to display
 * @param {Function} props.onCopy - Function to handle copying the command
 */
const UsageExample = ({ curlCommand, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <FiCode size={20} />
        Usage Example
      </h2>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">cURL</span>
          <button
            onClick={handleCopy}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1"
          >
            <FiCopy size={14} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
          <code>{curlCommand}</code>
        </pre>
      </div>
    </div>
  );
};

UsageExample.propTypes = {
  curlCommand: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default UsageExample; 