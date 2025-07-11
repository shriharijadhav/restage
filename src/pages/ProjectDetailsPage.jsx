import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiPlus, FiChevronDown, FiChevronRight, FiSettings, FiActivity, FiCode, FiX, FiTrash2, FiCopy, FiUsers, FiCalendar, FiFolder, FiGitBranch, FiStar, FiEye, FiDownload, FiSave, FiShare2, FiMoreVertical } from 'react-icons/fi';
import { Accordion, AccordionSummary, AccordionDetails, IconButton, Menu, MenuItem } from '@mui/material';
import { ExpandMore, MoreVert } from '@mui/icons-material';
import MultiPageForm from '../components/common/MultiPageForm';
import Breadcrumb from '../components/endpoint/Breadcrumb';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentProject, setLoading, setError } from '../features/projectSlice';
import projectService from '../services/projectService';
import moduleService from '../services/moduleService';
import { useSnackbar } from '../contexts/SnackbarContext';

// Map project IDs to names for navigation
const projectIdToName = {
  'proj-1': 'user-api',
  'proj-2': 'product-catalog',
  'proj-3': 'payment-gateway'
};

const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const getLoggedInUserName = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.firstName) {
      return user.firstName + (user.lastName ? ' ' + user.lastName : '');
    }
  } catch {}
  return '';
};

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useSnackbar();
  const currentProject = useSelector(state => state.project.currentProject);
  const loading = useSelector(state => state.project.loading);
  const [activeTab, setActiveTab] = useState('endpoints');
  const [showNewEndpointModal, setShowNewEndpointModal] = useState(false);
  const [moduleMenuAnchor, setModuleMenuAnchor] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [newEndpoint, setNewEndpoint] = useState({
    method: 'GET',
    path: '',
    description: '',
    module: '',
    statusCode: 200,
    version: 'v1.0',
    headers: [],
    queryParams: [],
    requestBody: '',
    responseBody: '',
    errors: [],
  });

  // Get method color
  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      PATCH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[method] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  // Get status code color
  const getStatusCodeColor = (code) => {
    if (code >= 200 && code < 300) return 'text-green-600 dark:text-green-400';
    if (code >= 400 && code < 500) return 'text-yellow-600 dark:text-yellow-400';
    if (code >= 500) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // Format date
  const formatDate = (iso) => new Date(iso).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Copy project ID
  const copyProjectId = () => {
    navigator.clipboard.writeText(projectId);
    // You could add a toast notification here
  };

  // Module menu handlers
  const handleModuleMenuOpen = (event, module) => {
    setModuleMenuAnchor(event.currentTarget);
    setSelectedModule(module);
  };

  const handleModuleMenuClose = () => {
    setModuleMenuAnchor(null);
    setSelectedModule(null);
  };

  const handleViewModuleDetails = () => {
    if (selectedModule) {
      navigate(`/project/${currentProject._id}/module/${selectedModule._id}`);
    }
    handleModuleMenuClose();
  };

  const handleShareModule = () => {
    if (selectedModule) {
      const shareUrl = `${window.location.origin}/project/${currentProject._id}/module/${selectedModule._id}`;
      navigator.clipboard.writeText(shareUrl);
      showSuccess('Module link copied to clipboard!');
    }
    handleModuleMenuClose();
  };

  // MultiPageForm steps
  const endpointFormSteps = [
    {
      label: 'Basic Info',
      render: ({ formData, setFormData, errors }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HTTP Method *</label>
              <select
                value={formData.method}
                onChange={e => setFormData(f => ({ ...f, method: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {httpMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Path *</label>
              <input
                type="text"
                value={formData.path}
                onChange={e => setFormData(f => ({ ...f, path: e.target.value }))}
                placeholder="/api/endpoint"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              {errors.path && <p className="text-red-500 text-xs mt-1">{errors.path}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe what this endpoint does..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Module</label>
              <input
                type="text"
                value={formData.module}
                onChange={e => setFormData(f => ({ ...f, module: e.target.value }))}
                placeholder="Enter module name (e.g., auth, users, products)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty to use 'api' as default</p>
              {errors.module && <p className="text-red-500 text-xs mt-1">{errors.module}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status Code</label>
              <select
                value={formData.statusCode}
                onChange={e => setFormData(f => ({ ...f, statusCode: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value={200}>200 - OK</option>
                <option value={201}>201 - Created</option>
                <option value={204}>204 - No Content</option>
                <option value={400}>400 - Bad Request</option>
                <option value={401}>401 - Unauthorized</option>
                <option value={403}>403 - Forbidden</option>
                <option value={404}>404 - Not Found</option>
                <option value={500}>500 - Internal Server Error</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Version</label>
            <input
              type="text"
              value={formData.version}
              onChange={e => setFormData(f => ({ ...f, version: e.target.value }))}
              placeholder="v1.0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      ),
      validate: (formData) => {
        const errors = {};
        if (!formData.path) errors.path = 'Path is required';
        if (!formData.description) errors.description = 'Description is required';
        return errors;
      },
    },
    {
      label: 'Headers',
      render: ({ formData, setFormData }) => (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Headers</label>
          {(formData.headers || []).map((header, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Key"
                value={header.key}
                onChange={e => setFormData(f => {
                  const headers = [...(f.headers || [])];
                  headers[idx].key = e.target.value;
                  return { ...f, headers };
                })}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={e => setFormData(f => {
                  const headers = [...(f.headers || [])];
                  headers[idx].value = e.target.value;
                  return { ...f, headers };
                })}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, headers: (f.headers || []).filter((_, i) => i !== idx) }))}
                className="px-2 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >×</button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData(f => ({ ...f, headers: [...(f.headers || []), { key: '', value: '' }] }))}
            className="mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
          >+ Add Header</button>
        </div>
      ),
    },
    {
      label: 'Query Parameters',
      render: ({ formData, setFormData }) => (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Query Parameters</label>
          {(formData.queryParams || []).map((param, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Key"
                value={param.key}
                onChange={e => setFormData(f => {
                  const queryParams = [...(f.queryParams || [])];
                  queryParams[idx].key = e.target.value;
                  return { ...f, queryParams };
                })}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={e => setFormData(f => {
                  const queryParams = [...(f.queryParams || [])];
                  queryParams[idx].value = e.target.value;
                  return { ...f, queryParams };
                })}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, queryParams: (f.queryParams || []).filter((_, i) => i !== idx) }))}
                className="px-2 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >×</button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData(f => ({ ...f, queryParams: [...(f.queryParams || []), { key: '', value: '' }] }))}
            className="mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
          >+ Add Query Param</button>
        </div>
      ),
    },
    {
      label: 'Request Body',
      render: ({ formData, setFormData, errors }) => (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Body (JSON)</label>
          <textarea
            value={formData.requestBody}
            onChange={e => setFormData(f => ({ ...f, requestBody: e.target.value }))}
            placeholder={`{
  "username": "string",
  "password": "string"
}`}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
          />
          {errors.requestBody && <p className="text-red-500 text-xs mt-1">{errors.requestBody}</p>}
        </div>
      ),
      validate: (formData) => {
        const errors = {};
        if (formData.requestBody) {
          try {
            JSON.parse(formData.requestBody);
          } catch {
            errors.requestBody = 'Invalid JSON';
          }
        }
        return errors;
      },
    },
    {
      label: 'Sample Response',
      render: ({ formData, setFormData, errors }) => (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sample Response (JSON)</label>
          <textarea
            value={formData.responseBody}
            onChange={e => setFormData(f => ({ ...f, responseBody: e.target.value }))}
            placeholder={`{
  "success": true,
  "token": "jwt"
}`}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
          />
          {errors.responseBody && <p className="text-red-500 text-xs mt-1">{errors.responseBody}</p>}
        </div>
      ),
      validate: (formData) => {
        const errors = {};
        if (formData.responseBody) {
          try {
            JSON.parse(formData.responseBody);
          } catch {
            errors.responseBody = 'Invalid JSON';
          }
        }
        return errors;
      },
    },
    {
      label: 'Possible Errors',
      render: ({ formData, setFormData }) => (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Possible Errors</label>
          {(formData.errors || []).map((err, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                type="number"
                placeholder="Code"
                value={err.code}
                onChange={e => setFormData(f => {
                  const errorsArr = [...(f.errors || [])];
                  errorsArr[idx].code = e.target.value;
                  return { ...f, errors: errorsArr };
                })}
                className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Message"
                value={err.message}
                onChange={e => setFormData(f => {
                  const errorsArr = [...(f.errors || [])];
                  errorsArr[idx].message = e.target.value;
                  return { ...f, errors: errorsArr };
                })}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Description"
                value={err.description}
                onChange={e => setFormData(f => {
                  const errorsArr = [...(f.errors || [])];
                  errorsArr[idx].description = e.target.value;
                  return { ...f, errors: errorsArr };
                })}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, errors: (f.errors || []).filter((_, i) => i !== idx) }))}
                className="px-2 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >×</button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData(f => ({ ...f, errors: [...(f.errors || []), { code: '', message: '', description: '' }] }))}
            className="mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
          >+ Add Error</button>
        </div>
      ),
    },
  ];

  // Handle new endpoint submission from MultiPageForm
  const handleCreateEndpoint = async (formData) => {
    console.log('Starting endpoint creation with projectId:', projectId);
    console.log('Form data:', formData);
    
    try {
      // Prepare endpoint data
      let requestBodySchema = null;
      let responseSchema = null;
      
      try {
        if (formData.requestBody) {
          requestBodySchema = JSON.parse(formData.requestBody);
        }
      } catch (error) {
        showError('Invalid JSON in request body');
        return;
      }
      
      try {
        if (formData.responseBody) {
          responseSchema = JSON.parse(formData.responseBody);
        }
      } catch (error) {
        showError('Invalid JSON in response body');
        return;
      }

      const endpointData = {
        moduleName: formData.module?.trim() || 'api',
        path: formData.path.startsWith('/') ? formData.path : `/${formData.path}`,
        method: formData.method,
        summary: formData.description || 'API endpoint',
        description: formData.description,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        parameters: formData.queryParams?.map(param => ({
          name: param.key,
          type: 'string',
          required: false,
          description: param.value
        })) || [],
        ...(formData.requestBody && {
          requestBody: {
            type: 'application/json',
            schema: requestBodySchema
          }
        }),
        responses: [{
          code: parseInt(formData.statusCode) || 200,
          description: 'Success response',
          schema: responseSchema
        }]
      };

      console.log('Creating endpoint with data:', endpointData);

      // Create endpoint with automatic module handling
      const result = await moduleService.createEndpoint(projectId, endpointData);
      console.log('Endpoint creation result:', result);
      
      if (result.success) {
        showSuccess('Endpoint created successfully');
        // Refresh project data to get updated modules
        const projectResult = await projectService.getProject(projectId);
        if (projectResult.success) {
          // Fetch updated modules
          const modulesResult = await moduleService.getModules(projectId);
          if (modulesResult.success) {
            const projectWithModules = {
              ...projectResult.project,
              modules: modulesResult.modules
            };
            dispatch(setCurrentProject(projectWithModules));
          }
        }
      } else {
        showError(result.error);
      }
    } catch (error) {
      console.error('Error creating endpoint:', error);
      showError('Failed to create endpoint: ' + error.message);
    }
    
    setShowNewEndpointModal(false);
  };

  useEffect(() => {
    const fetchProjectAndModules = async () => {
      dispatch(setLoading(true));
      try {
        // Fetch project
        const projectResult = await projectService.getProject(projectId);
        if (!projectResult.success) {
          dispatch(setError(projectResult.error));
          showError(projectResult.error);
          navigate('/dashboard');
          return;
        }

        // Fetch modules for this project
        const modulesResult = await moduleService.getModules(projectId);
        if (modulesResult.success) {
          // Combine project data with modules
          const projectWithModules = {
            ...projectResult.project,
            modules: modulesResult.modules
          };
          dispatch(setCurrentProject(projectWithModules));
        } else {
          // If modules fetch fails, still show project but with empty modules
          dispatch(setCurrentProject({
            ...projectResult.project,
            modules: []
          }));
        }
      } catch (error) {
        dispatch(setError('Failed to fetch project data'));
        showError('Failed to fetch project data');
        navigate('/dashboard');
      }
      dispatch(setLoading(false));
    };

    if (projectId) {
      fetchProjectAndModules();
    }
  }, [dispatch, projectId, showError, navigate]);

  return (
    <div className="min-h-screen bg-gradient-app">
      {/* Breadcrumb */}
      <div className="px-6 py-4">
        <Breadcrumb 
          projectId={projectId}
          projectName={currentProject?.name}
        />
      </div>
      
      {/* Project Overview Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-6 mb-8 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{currentProject?.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-600 dark:text-gray-400">{currentProject?.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Project ID: {projectId}</span>
                <button onClick={copyProjectId} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  <FiCopy size={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(currentProject?.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'endpoints', label: 'Modules & Endpoints', icon: <FiCode size={18} /> },
            { id: 'overview', label: 'Overview', icon: <FiFolder size={18} /> },
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
      <div className="space-y-6">
        {activeTab === 'endpoints' && (
          <div>
            {/* Endpoints Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Modules & Endpoints
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewEndpointModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FiPlus size={16} />
                  New Endpoint
                </button>
              </div>
            </div>

            {/* Endpoints List */}
            <div className="space-y-6">
              {currentProject?.modules && currentProject.modules.length > 0 ? (
                currentProject.modules.map((module) => (
                  <Accordion key={module._id} defaultExpanded className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <AccordionSummary
                      expandIcon={<ExpandMore className="text-gray-500 dark:text-gray-400" />}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                            {module.name}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {module.endpoints?.length || 0} endpoint{(module.endpoints?.length || 0) !== 1 ? 's' : ''}
                          </span>
                          {module.createdBy && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                              <FiUsers size={12} />
                              <span className="truncate max-w-24">{module.createdBy.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                           
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/project/${currentProject._id}/module/${module._id}`);
                            }}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <FiEye size={14} />
                            View Details
                          </button>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModuleMenuOpen(e, module);
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <MoreVert />
                          </IconButton>
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails className="p-0">
                      {module.endpoints && module.endpoints.length > 0 ? (
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          {module.endpoints.map((endpoint) => (
                            <div
                              key={endpoint._id}
                              onClick={() => navigate(`/project/${currentProject._id}/module/${module._id}/endpoint/${endpoint._id}`)}
                              className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                              <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                                  {endpoint.method}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                    {endpoint.path}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {endpoint.summary}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(endpoint.updatedAt)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-6 text-center text-gray-500 dark:text-gray-400">
                          No endpoints in this module yet
                        </div>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <FiCode size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No endpoints yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Create your first endpoint to get started
                  </p>
                  <button
                    onClick={() => setShowNewEndpointModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Create Endpoint
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Project Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">About This API</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {currentProject?.longDescription}
                </p>
              </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FiCode size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {currentProject?.totalEndpoints || 
                       (currentProject?.modules?.reduce((total, module) => total + (module.endpoints?.length || 0), 0) || 0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Endpoints</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FiFolder size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {currentProject?.totalModules || currentProject?.modules?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Modules</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <FiEye size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Requests</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <FiActivity size={20} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">0ms</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contributors */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiUsers size={18} />
                  Contributors
                </h3>
                <div className="space-y-3">
                  {currentProject?.contributors?.map((contributor, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {contributor.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{contributor.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{contributor.role}</div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No contributors added yet
                    </div>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Project Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Version</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{currentProject?.version}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Base URL</span>
                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">
                      {currentProject?.baseUrl}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Last Modified</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(currentProject?.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                    <span className="font-medium text-green-600 dark:text-green-400">100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentProject?.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                )) || (
                  <span className="text-gray-500 dark:text-gray-400 text-sm">No tags added</span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <a 
                  href={currentProject?.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FiDownload size={16} />
                  View Documentation
                </a>
                <a 
                  href={currentProject?.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  <FiGitBranch size={16} />
                  View Repository
                </a>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                  <FiStar size={16} />
                  Star Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Endpoint Modal */}
      {showNewEndpointModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create New Endpoint</h2>
              <button
                onClick={() => setShowNewEndpointModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX size={24} />
              </button>
            </div>
            {/* Modal Body: MultiPageForm */}
            <div className="p-6">
              <MultiPageForm
                steps={endpointFormSteps}
                initialValues={newEndpoint}
                onSubmit={handleCreateEndpoint}
                onCancel={() => setShowNewEndpointModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Module Menu */}
      <Menu
        anchorEl={moduleMenuAnchor}
        open={Boolean(moduleMenuAnchor)}
        onClose={handleModuleMenuClose}
        PaperProps={{
          className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg",
          style: { zIndex: 9999 }
        }}
        MenuListProps={{
          className: "py-1"
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={handleViewModuleDetails} 
          className="text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2"
        >
          <FiEye className="mr-3" size={16} />
          View Details
        </MenuItem>
        <MenuItem 
          onClick={handleShareModule} 
          className="text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2"
        >
          <FiShare2 className="mr-3" size={16} />
          Share Module
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProjectDetailsPage; 