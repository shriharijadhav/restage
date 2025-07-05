import apiService from '../utils/apiService';

const moduleService = {
  // Get all modules for a project
  getModules: async (projectId) => {
    console.log('moduleService.getModules called with projectId:', projectId);
    try {
      const response = await apiService.get(`/api/modules/${projectId}`);
      console.log('getModules response:', response);
      return { success: true, modules: response.data.modules };
    } catch (error) {
      console.error('getModules error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch modules' };
    }
  },

  // Get a single module
  getModule: async (projectId, moduleId) => {
    console.log('moduleService.getModule called with projectId:', projectId, 'moduleId:', moduleId);
    try {
      const response = await apiService.get(`/api/modules/${projectId}/${moduleId}`);
      return { success: true, module: response.data.module };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch module' };
    }
  },

  // Create a new module
  createModule: async (projectId, moduleData) => {
    console.log('moduleService.createModule called with projectId:', projectId, 'moduleData:', moduleData);
    try {
      const response = await apiService.post(`/api/modules/${projectId}`, moduleData);
      console.log('createModule response:', response);
      return { success: true, module: response.data.module };
    } catch (error) {
      console.error('createModule error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to create module' };
    }
  },

  // Update a module
  updateModule: async (projectId, moduleId, moduleData) => {
    try {
      const response = await apiService.put(`/api/modules/${projectId}/${moduleId}`, moduleData);
      return { success: true, module: response.data.module };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update module' };
    }
  },

  // Delete a module
  deleteModule: async (projectId, moduleId) => {
    try {
      await apiService.delete(`/api/modules/${projectId}/${moduleId}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete module' };
    }
  },

  // Create endpoint with automatic module handling
  createEndpoint: async (projectId, endpointData) => {
    console.log('frontend==>moduleService.createEndpoint called with projectId:', projectId, 'endpointData:', endpointData);
    try {
      const response = await apiService.post(`/api/modules/${projectId}/endpoints`, endpointData);
      console.log('createEndpoint response:', response);
      return { success: true, endpoint: response.data.endpoint, module: response.data.module };
    } catch (error) {
      console.error('createEndpoint error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to create endpoint' };
    }
  },

  // Update endpoint in module
  updateEndpoint: async (projectId, moduleId, endpointId, endpointData) => {
    try {
      const response = await apiService.put(`/api/modules/${projectId}/${moduleId}/endpoints/${endpointId}`, endpointData);
      return { success: true, endpoint: response.data.endpoint };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update endpoint' };
    }
  },

  // Delete endpoint from module
  deleteEndpoint: async (projectId, moduleId, endpointId) => {
    try {
      await apiService.delete(`/api/modules/${projectId}/${moduleId}/endpoints/${endpointId}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete endpoint' };
    }
  }
};

export default moduleService; 