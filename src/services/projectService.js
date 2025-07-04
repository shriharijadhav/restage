import apiService from '../utils/apiService';

/**
 * Project Service - Handles all project-related API calls
 */
class ProjectService {
  /**
   * Get all projects for the current user
   * @returns {Promise<Object>} Response with projects array
   */
  async getProjects() {
    try {
      const response = await apiService.get('/api/projects');
      return {
        success: true,
        projects: response.data.projects
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch projects'
      };
    }
  }

  /**
   * Get a single project by ID
   * @param {string} projectId - The project ID
   * @returns {Promise<Object>} Response with project data
   */
  async getProject(projectId) {
    try {
      const response = await apiService.get(`/api/projects/${projectId}`);
      return {
        success: true,
        project: response.data.project
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch project'
      };
    }
  }

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} Response with created project
   */
  async createProject(projectData) {
    try {
      const response = await apiService.post('/api/projects', projectData);
      return {
        success: true,
        project: response.data.project,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create project'
      };
    }
  }

  /**
   * Update an existing project
   * @param {string} projectId - The project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise<Object>} Response with updated project
   */
  async updateProject(projectId, projectData) {
    try {
      const response = await apiService.put(`/api/projects/${projectId}`, projectData);
      return {
        success: true,
        project: response.data.project,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating project:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update project'
      };
    }
  }

  /**
   * Delete a project
   * @param {string} projectId - The project ID
   * @returns {Promise<Object>} Response with success message
   */
  async deleteProject(projectId) {
    try {
      const response = await apiService.delete(`/api/projects/${projectId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error deleting project:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete project'
      };
    }
  }

  /**
   * Add an endpoint to a project
   * @param {string} projectId - The project ID
   * @param {Object} endpointData - Endpoint data
   * @returns {Promise<Object>} Response with created endpoint
   */
  async addEndpoint(projectId, endpointData) {
    try {
      const response = await apiService.post(`/api/projects/${projectId}/endpoints`, endpointData);
      return {
        success: true,
        endpoint: response.data.endpoint,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error adding endpoint:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add endpoint'
      };
    }
  }

  /**
   * Update an endpoint in a project
   * @param {string} projectId - The project ID
   * @param {string} endpointId - The endpoint ID
   * @param {Object} endpointData - Updated endpoint data
   * @returns {Promise<Object>} Response with updated endpoint
   */
  async updateEndpoint(projectId, endpointId, endpointData) {
    try {
      const response = await apiService.put(`/api/projects/${projectId}/endpoints/${endpointId}`, endpointData);
      return {
        success: true,
        endpoint: response.data.endpoint,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating endpoint:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update endpoint'
      };
    }
  }

  /**
   * Delete an endpoint from a project
   * @param {string} projectId - The project ID
   * @param {string} endpointId - The endpoint ID
   * @returns {Promise<Object>} Response with success message
   */
  async deleteEndpoint(projectId, endpointId) {
    try {
      const response = await apiService.delete(`/api/projects/${projectId}/endpoints/${endpointId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error deleting endpoint:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete endpoint'
      };
    }
  }
}

export default new ProjectService(); 