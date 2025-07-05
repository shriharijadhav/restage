import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiShare2, FiChevronRight, FiCode, FiUsers, FiClock, FiArrowLeft } from 'react-icons/fi';
import Breadcrumb from '../components/endpoint/Breadcrumb';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentProject, setLoading, setError } from '../features/projectSlice';
import projectService from '../services/projectService';
import moduleService from '../services/moduleService';
import { useSnackbar } from '../contexts/SnackbarContext';

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

const formatDate = (iso) => new Date(iso).toLocaleDateString(undefined, {
  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
});

const ModuleDetailsPage = () => {
  const { projectId, moduleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useSnackbar();
  
  // Get current project and modules from Redux
  const currentProject = useSelector(state => state.project.currentProject);
  const loading = useSelector(state => state.project.loading);
  
  // Find the correct module
  const module = currentProject?.modules?.find(m => m._id === moduleId);

  // Fetch project data if not already loaded
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!currentProject || currentProject._id !== projectId) {
        dispatch(setLoading(true));
        try {
          const projectResult = await projectService.getProject(projectId);
          if (projectResult.success) {
            // Fetch modules for this project
            const modulesResult = await moduleService.getModules(projectId);
            if (modulesResult.success) {
              const projectWithModules = {
                ...projectResult.project,
                modules: modulesResult.modules
              };
              dispatch(setCurrentProject(projectWithModules));
            } else {
              dispatch(setCurrentProject(projectResult.project));
            }
          } else {
            dispatch(setError(projectResult.error));
            showError(projectResult.error);
            navigate('/dashboard');
          }
        } catch (error) {
          dispatch(setError('Failed to fetch project data'));
          showError('Failed to fetch project data');
          navigate('/dashboard');
        }
        dispatch(setLoading(false));
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, currentProject, dispatch, navigate, showError]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${module?.name} Module`,
        text: `Check out the ${module?.name} module in ${currentProject?.name}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      showSuccess('Module link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-app flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentProject || !module) {
    return (
      <div className="min-h-screen bg-gradient-app flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">The requested module does not exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-app py-8 px-4 md:px-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        projectName={currentProject.name} 
        projectId={projectId}
        module={module.name} 
        moduleId={moduleId}
        endpointTitle={null} 
      />
      {/* Module Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{module.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{module.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><FiCode /> {module.endpoints?.length || 0} endpoint{(module.endpoints?.length || 0) !== 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1"><FiClock /> Last updated: {formatDate(module.updatedAt || module.createdAt)}</span>
            {module.createdBy && (
              <span className="flex items-center gap-1">
                <FiUsers /> Created by: {module.createdBy.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiShare2 size={16} /> Share Module
          </button>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Endpoints</h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {module.endpoints && module.endpoints.length > 0 ? (
            module.endpoints.map((endpoint) => (
              <button
                key={endpoint._id}
                onClick={() => navigate(`/project/${projectId}/module/${moduleId}/endpoint/${endpoint._id}`)}
                className="w-full flex items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getMethodColor(endpoint.method)}`}>{endpoint.method}</span>
                  <div>
                    <div className="font-mono text-sm text-gray-900 dark:text-gray-100">{endpoint.path}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{endpoint.summary}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(endpoint.updatedAt || endpoint.createdAt)}</span>
                  <FiChevronRight className="text-gray-400" />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No endpoints in this module yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailsPage; 