import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Breadcrumb component for endpoint navigation
 * @param {Object} props - Component props
 * @param {string} props.projectName - Name of the project
 * @param {string} props.projectId - ID of the project
 * @param {string} props.module - Name of the module
 * @param {string} props.moduleId - ID of the module
 * @param {string} props.endpointTitle - Title of the endpoint
 */
const Breadcrumb = ({ projectName, projectId, module, moduleId, endpointTitle }) => {
  return (
    <nav className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Projects
          </Link>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li>
          {module && moduleId ? (
            <>
              <Link to={`/project/${projectId}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {projectName}
              </Link>
              <span className="mx-2">/</span>
              <Link to={`/project/${projectId}/module/${moduleId}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize">
                {module}
              </Link>
            </>
          ) : (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {projectName}
            </span>
          )}
        </li>
        {endpointTitle && (
          <>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 dark:text-gray-100 font-medium">
              {endpointTitle}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  module: PropTypes.string,
  moduleId: PropTypes.string,
  endpointTitle: PropTypes.string,
};

export default Breadcrumb; 