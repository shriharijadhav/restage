import React, { useState } from 'react';
import { FiZap, FiPlay, FiEdit } from 'react-icons/fi';
import PropTypes from 'prop-types';

/**
 * QuickActions component for endpoint actions
 * @param {Object} props - Component props
 * @param {Function} props.onTest - Function to handle testing the endpoint
 * @param {Function} props.onEdit - Function to handle editing the endpoint
 */
const QuickActions = ({ onTest, onEdit }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await onTest();
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: error.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <FiZap size={18} />
        Quick Actions
      </h3>
      <div className="space-y-3">
        <button
          onClick={handleTest}
          disabled={isTesting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <FiPlay size={16} />
          {isTesting ? 'Testing...' : 'Test Endpoint'}
        </button>
        <button
          onClick={onEdit}
          className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <FiEdit size={16} />
          Edit Endpoint
        </button>
      </div>
      
      {/* Test Result Display */}
      {testResult && (
        <div className="mt-4 p-3 rounded-lg border">
          {testResult.error ? (
            <div className="text-red-600 dark:text-red-400 text-sm">
              <strong>Error:</strong> {testResult.error}
            </div>
          ) : (
            <div className="text-green-600 dark:text-green-400 text-sm">
              <strong>Success!</strong> Response received in {testResult.responseTime}ms
            </div>
          )}
        </div>
      )}
    </div>
  );
};

QuickActions.propTypes = {
  onTest: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default QuickActions; 