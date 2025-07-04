import React from 'react';
import { FiInfo } from 'react-icons/fi';
import PropTypes from 'prop-types';

/**
 * MetaInfo component for displaying endpoint metadata
 * @param {Object} props - Component props
 * @param {Object} props.endpoint - The endpoint object containing metadata
 */
const MetaInfo = ({ endpoint }) => {
  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <FiInfo size={18} />
        Meta Information
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Created</span>
          <span className="text-gray-900 dark:text-gray-100">{formatDate(endpoint?.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Last Modified</span>
          <span className="text-gray-900 dark:text-gray-100">{formatDate(endpoint?.lastModified)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Response Time</span>
          <span className="text-gray-900 dark:text-gray-100">~{endpoint?.responseTime || 150}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Rate Limit</span>
          <span className="text-gray-900 dark:text-gray-100">{endpoint?.rateLimit || '1000/hour'}</span>
        </div>
        {endpoint?.version && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Version</span>
            <span className="text-gray-900 dark:text-gray-100">{endpoint.version}</span>
          </div>
        )}
        {endpoint?.createdBy && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Created By</span>
            <span className="text-gray-900 dark:text-gray-100">{endpoint.createdBy}</span>
          </div>
        )}
      </div>
    </div>
  );
};

MetaInfo.propTypes = {
  endpoint: PropTypes.shape({
    createdAt: PropTypes.string,
    lastModified: PropTypes.string,
    responseTime: PropTypes.number,
    rateLimit: PropTypes.string,
    version: PropTypes.string,
    createdBy: PropTypes.string,
  }),
};

export default MetaInfo; 