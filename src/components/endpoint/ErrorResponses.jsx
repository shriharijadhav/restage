import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import PropTypes from 'prop-types';

/**
 * ErrorResponses component for displaying error information
 * @param {Object} props - Component props
 * @param {Array} props.errors - Array of error objects
 */
const ErrorResponses = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <FiAlertTriangle size={20} />
        Error Responses
      </h2>
      <div className="space-y-4">
        {errors.map((error, index) => (
          <div key={index} className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusCodeColor(error.code)}`}>
                {error.code}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {error.message || error.description}
              </span>
            </div>
            {error.description && error.description !== error.message && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{error.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

ErrorResponses.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.number.isRequired,
      message: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};

export default ErrorResponses; 