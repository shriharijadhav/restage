import { api } from '../utils/apiService';

/**
 * Project Service - Handles all project-related API calls
 */
class ProjectService {
  /**
   * Get all projects for the current user
   */
  async getProjects() {
    try {
      const response = await api.get('/api/projects');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch projects' };
    }
  }

  /**
   * Get a specific project by ID
   */
  async getProject(projectId) {
    try {
      const response = await api.get(`/api/projects/${projectId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch project:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch project' };
    }
  }

  /**
   * Create a new project
   */
  async createProject(projectData) {
    try {
      const response = await api.post('/api/projects', projectData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to create project:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to create project' };
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(projectId, projectData) {
    try {
      const response = await api.put(`/api/projects/${projectId}`, projectData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update project:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to update project' };
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId) {
    try {
      const response = await api.delete(`/api/projects/${projectId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to delete project:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to delete project' };
    }
  }

  /**
   * Get modules for a specific project
   */
  async getProjectModules(projectId) {
    try {
      const response = await api.get(`/api/projects/${projectId}/modules`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch project modules:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch project modules' };
    }
  }

  /**
   * Create a new module in a project
   */
  async createModule(projectId, moduleData) {
    try {
      const response = await api.post(`/api/projects/${projectId}/modules`, moduleData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to create module:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to create module' };
    }
  }

  /**
   * Get endpoints for a specific module
   */
  async getModuleEndpoints(projectId, moduleId) {
    try {
      const response = await api.get(`/api/projects/${projectId}/modules/${moduleId}/endpoints`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch module endpoints:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch module endpoints' };
    }
  }

  /**
   * Create a new endpoint in a module
   */
  async createEndpoint(projectId, moduleId, endpointData) {
    try {
      const response = await api.post(`/api/projects/${projectId}/modules/${moduleId}/endpoints`, endpointData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to create endpoint:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to create endpoint' };
    }
  }
}

export const projectService = new ProjectService();
export default projectService; 