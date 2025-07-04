import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addProject, deleteProject, editProject } from '../features/projectSlice';
import { FiPlus, FiFolder, FiCalendar, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import KebabMenu from '../components/common/KebabMenu';
import ProjectMultiPageForm from '../components/common/ProjectMultiPageForm';

// Helper for GitHub-style project name validation
function validateProjectName(name) {
  if (!name) return 'Project name is required.';
  if (name.length > 100) return 'Max 100 characters.';
  if (!/^[a-z0-9-]+$/.test(name)) return 'Only lowercase letters, numbers, and hyphens allowed.';
  if (/^-|-$/.test(name)) return 'Cannot start or end with a hyphen.';
  if (/--/.test(name)) return 'No consecutive hyphens.';
  return '';
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [editModal, setEditModal] = useState({ open: false, project: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, project: null });
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editNameError, setEditNameError] = useState('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  // Handle modal open/close
  const openModal = () => {
    setShowModal(true);
    setProjectName('');
    setDescription('');
    setNameError('');
  };
  const closeModal = () => {
    setShowModal(false);
    setProjectName('');
    setDescription('');
    setNameError('');
  };

  // Handle form submit
  const handleCreateProject = (e) => {
    e.preventDefault();
    const error = validateProjectName(projectName);
    if (error) {
      setNameError(error);
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newProject = {
        id: `proj-${Date.now()}`,
        name: projectName,
        description,
        createdAt: new Date().toISOString(),
        endpointCount: 0,
        lastModified: new Date().toISOString(),
        // Add other fields as needed
      };
      dispatch(addProject(newProject));
      setIsSubmitting(false);
      closeModal();
    }, 800);
  };

  // Format date
  const formatDate = (iso) => new Date(iso).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const formatRelativeDate = (iso) => {
    const now = new Date();
    const date = new Date(iso);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return formatDate(iso);
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit modal handlers
  const openEditModal = (project) => {
    setEditModal({ open: true, project });
    setEditName(project.name);
    setEditDescription(project.description || '');
    setEditNameError('');
  };
  const closeEditModal = () => {
    setEditModal({ open: false, project: null });
    setEditName('');
    setEditDescription('');
    setEditNameError('');
  };
  const handleEditProject = (e) => {
    e.preventDefault();
    const error = validateProjectName(editName);
    if (error) {
      setEditNameError(error);
      return;
    }
    setIsEditSubmitting(true);
    setTimeout(() => {
      dispatch(editProject({
        id: editModal.project.id,
        name: editName,
        description: editDescription,
        lastModified: new Date().toISOString(),
      }));
      setIsEditSubmitting(false);
      closeEditModal();
    }, 800);
  };

  // Delete handlers
  const openDeleteConfirm = (project) => setDeleteConfirm({ open: true, project });
  const closeDeleteConfirm = () => setDeleteConfirm({ open: false, project: null });
  const handleDeleteProject = () => {
    setIsDeleteSubmitting(true);
    setTimeout(() => {
      dispatch(deleteProject(deleteConfirm.project.id));
      setIsDeleteSubmitting(false);
      closeDeleteConfirm();
    }, 800);
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">API Projects</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your API documentation and mock endpoints
            </p>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2 self-start sm:self-auto"
            onClick={openModal}
          >
            <FiPlus size={20} />
            New Project
          </button>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <FiList size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        {filteredProjects.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                        <FiFolder size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.name}
                        </h3>
                      </div>
                    </div>
                    <KebabMenu
                      options={[
                        { label: 'Edit', onClick: () => openEditModal(project) },
                        { label: 'Delete', onClick: () => openDeleteConfirm(project) },
                      ]}
                    />
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        {formatRelativeDate(project.lastModified)}
                      </span>
                      <span>{project.endpointCount} endpoints</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    index !== filteredProjects.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                  }`}
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <FiFolder size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 truncate">
                          {project.description || 'No description provided'}
                        </p>
                      </div>
                    </div>
                    <KebabMenu
                      options={[
                        { label: 'Edit', onClick: () => openEditModal(project) },
                        { label: 'Delete', onClick: () => openDeleteConfirm(project) },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FiFolder size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Create your first API project to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={openModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
              onClick={closeModal}
              aria-label="Close"
              disabled={isSubmitting}
            >
              &times;
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create New Project</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Set up a new API documentation project</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ProjectMultiPageForm
                isSubmitting={isSubmitting}
                onCancel={closeModal}
                onSubmit={project => {
                  setIsSubmitting(true);
                  setTimeout(() => {
                    dispatch(addProject(project));
                    setIsSubmitting(false);
                    closeModal();
                  }, 800);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
              onClick={closeEditModal}
              aria-label="Close"
              disabled={isEditSubmitting}
            >
              &times;
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Project</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Update project details</p>
            </div>
            <form onSubmit={handleEditProject} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    editNameError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="e.g. my-mock-api"
                  value={editName}
                  onChange={e => { setEditName(e.target.value); setEditNameError(''); }}
                  disabled={isEditSubmitting}
                  maxLength={100}
                  autoFocus
                />
                {editNameError && <div className="text-red-500 text-sm mt-1">{editNameError}</div>}
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Optional project description"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  disabled={isEditSubmitting}
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={isEditSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  disabled={isEditSubmitting}
                >
                  {isEditSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
              onClick={closeDeleteConfirm}
              aria-label="Close"
              disabled={isDeleteSubmitting}
            >
              &times;
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Delete Project</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Are you sure you want to delete <span className="font-semibold">{deleteConfirm.project?.name}</span>? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isDeleteSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                disabled={isDeleteSubmitting}
              >
                {isDeleteSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 