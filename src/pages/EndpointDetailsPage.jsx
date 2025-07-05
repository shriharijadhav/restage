/**
 * EndpointDetailsPage - Displays detailed information about a specific API endpoint
 * 
 * This page provides comprehensive documentation for individual API endpoints including:
 * - Specification tab: Complete endpoint definition with all details
 * - Playground tab: Interactive testing with editable inputs and mock responses
 * 
 * The page is designed to be a professional API documentation interface similar to
 * popular platforms like Stripe, GitHub, and Postman.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCopy, FiShare2, FiFileText, FiPlay, FiTag, FiClock, FiUser } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading, setError } from '../features/projectSlice';
import projectService from '../services/projectService';
import moduleService from '../services/moduleService';
import { useSnackbar } from '../contexts/SnackbarContext';

// Import components
import Breadcrumb from '../components/endpoint/Breadcrumb';
import Specification from '../components/endpoint/Specification';
import Playground from '../components/endpoint/Playground';

// Import utilities
import { 
  copyToClipboard, 
  getMethodColor,
  formatDate
} from '../utils/endpointUtils';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

const EndpointDetailsPage = () => {
  const { projectId, moduleId, endpointId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showError } = useSnackbar();
  const [activeTab, setActiveTab] = useState('specification');
  const [copied, setCopied] = useState(false);
  const [endpoint, setEndpoint] = useState(null);
  const [module, setModule] = useState(null);
  const [project, setProject] = useState(null);

  // Fetch endpoint data from API
  useEffect(() => {
    const fetchEndpointData = async () => {
      if (!projectId || !moduleId || !endpointId) {
        showError('Invalid endpoint parameters');
        navigate('/dashboard');
        return;
      }

      dispatch(setLoading(true));
      try {
        // Fetch project
        const projectResult = await projectService.getProject(projectId);
        if (!projectResult.success) {
          showError(projectResult.error);
          navigate('/dashboard');
          return;
        }
        setProject(projectResult.project);

        // Fetch module
        const moduleResult = await moduleService.getModule(projectId, moduleId);
        if (!moduleResult.success) {
          showError(moduleResult.error);
          navigate('/dashboard');
          return;
        }
        setModule(moduleResult.module);

        // Find endpoint in module
        const foundEndpoint = moduleResult.module.endpoints.find(e => e._id === endpointId);
        if (!foundEndpoint) {
          showError('Endpoint not found');
          navigate('/dashboard');
          return;
        }
        setEndpoint(foundEndpoint);
      } catch (error) {
        console.error('Error fetching endpoint data:', error);
        showError('Failed to fetch endpoint data');
        navigate('/dashboard');
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchEndpointData();
  }, [projectId, moduleId, endpointId, dispatch, showError, navigate]);

  // Copy functions with feedback
  const handleCopy = async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyEndpointUrl = () => {
    const url = `${API_BASE_URL}${endpoint?.path || '/api/endpoint'}`;
    handleCopy(url);
  };

  const shareEndpoint = () => {
    if (navigator.share) {
      navigator.share({
        title: `${endpoint?.method || 'GET'} ${endpoint?.path || '/api/endpoint'}`,
        text: `Check out this API endpoint: ${endpoint?.path || '/api/endpoint'}`,
        url: window.location.href
      });
    } else {
      copyEndpointUrl();
    }
  };

  if (!project || !module || !endpoint) {
    return (
      <div className="min-h-screen bg-gradient-app flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Loading...</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Fetching endpoint details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-app">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        projectName={project.name}
        projectId={projectId}
        module={module.name}
        moduleId={moduleId}
        endpointTitle={endpoint.summary || endpoint.path}
      />

      {/* Enhanced Endpoint Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getMethodColor(endpoint.method)}`}>
                {endpoint.method}
              </span>
              <code className="text-lg font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                {endpoint.path}
              </code>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {endpoint.summary || endpoint.path}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {endpoint.description || 'API endpoint documentation and reference'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyEndpointUrl}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
            >
              <FiCopy size={14} />
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
            <button
              onClick={shareEndpoint}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
            >
              <FiShare2 size={14} />
              Share
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiTag className="text-gray-400" size={16} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Module</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{module.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-gray-400" size={16} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(endpoint.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiUser className="text-gray-400" size={16} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Updated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(endpoint.updatedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-gray-400" size={16} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tags</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {endpoint.tags?.length > 0 ? endpoint.tags.join(', ') : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'specification', label: 'Specification', icon: <FiFileText size={18} /> },
            { id: 'playground', label: 'Playground', icon: <FiPlay size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'specification' && (
        <Specification endpoint={endpoint} />
      )}

      {activeTab === 'playground' && (
        <Playground endpoint={endpoint} />
      )}
    </div>
  );
};

export default EndpointDetailsPage; 