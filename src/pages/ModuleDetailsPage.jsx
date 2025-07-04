import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiShare2, FiChevronRight, FiCode, FiUsers, FiClock, FiArrowLeft } from 'react-icons/fi';
import Breadcrumb from '../components/endpoint/Breadcrumb';
import { useSelector } from 'react-redux';

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
  const { projectName, moduleName } = useParams();
  const navigate = useNavigate();
  // Get current project and modules from Redux
  const currentProject = useSelector(state => state.project.projects.find(p => p.name === projectName || p.id === projectName));
  const modules = currentProject?.modules || [];
  // Find the correct module
  const module = modules.find(m => m.name === moduleName || m.id === moduleName);

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
      alert('Module link copied!');
    }
  };

  if (!currentProject || !module) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 md:px-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb projectName={projectName} module={moduleName} endpointTitle={null} />
      {/* Module Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{module.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{module.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><FiCode /> {module.endpoints.length} endpoint{module.endpoints.length !== 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1"><FiClock /> Last updated: {formatDate(module.lastUpdated)}</span>
            <span className="flex items-center gap-1"><FiUsers /> Contributors: {module.contributors ? module.contributors.length : 0}</span>
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
          {module.endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => navigate(`/project/${projectName}/${moduleName}/${ep.id}`)}
              className="w-full flex items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded text-sm font-medium ${getMethodColor(ep.method)}`}>{ep.method}</span>
                <div>
                  <div className="font-mono text-sm text-gray-900 dark:text-gray-100">{ep.path}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ep.title || ep.description} - {ep.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(ep.lastModified)}</span>
                <FiChevronRight className="text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailsPage; 