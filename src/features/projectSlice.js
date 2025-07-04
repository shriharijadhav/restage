import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // Loading states
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    
    // Project actions
    setProjects(state, action) {
      state.projects = action.payload;
      state.error = null;
    },
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
      state.error = null;
    },
    addProject(state, action) {
      state.projects.unshift(action.payload); // Add to beginning
      state.error = null;
    },
    updateProject(state, action) {
      const index = state.projects.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
      if (state.currentProject && state.currentProject._id === action.payload._id) {
        state.currentProject = action.payload;
      }
      state.error = null;
    },
    deleteProject(state, action) {
      state.projects = state.projects.filter(p => p._id !== action.payload);
      if (state.currentProject && state.currentProject._id === action.payload) {
        state.currentProject = null;
      }
      state.error = null;
    },
    
    // Endpoint actions
    addEndpoint(state, action) {
      const { projectId, endpoint } = action.payload;
      const project = state.projects.find(p => p._id === projectId);
      if (project) {
        project.endpoints.push(endpoint);
      }
      if (state.currentProject && state.currentProject._id === projectId) {
        state.currentProject.endpoints.push(endpoint);
      }
      state.error = null;
    },
    updateEndpoint(state, action) {
      const { projectId, endpointId, endpoint } = action.payload;
      const project = state.projects.find(p => p._id === projectId);
      if (project) {
        const index = project.endpoints.findIndex(e => e._id === endpointId);
        if (index !== -1) {
          project.endpoints[index] = endpoint;
        }
      }
      if (state.currentProject && state.currentProject._id === projectId) {
        const index = state.currentProject.endpoints.findIndex(e => e._id === endpointId);
        if (index !== -1) {
          state.currentProject.endpoints[index] = endpoint;
        }
      }
      state.error = null;
    },
    deleteEndpoint(state, action) {
      const { projectId, endpointId } = action.payload;
      const project = state.projects.find(p => p._id === projectId);
      if (project) {
        project.endpoints = project.endpoints.filter(e => e._id !== endpointId);
      }
      if (state.currentProject && state.currentProject._id === projectId) {
        state.currentProject.endpoints = state.currentProject.endpoints.filter(e => e._id !== endpointId);
      }
      state.error = null;
    },
  },
});

export const { 
  setLoading, 
  setError, 
  setProjects, 
  setCurrentProject, 
  addProject, 
  updateProject, 
  deleteProject, 
  addEndpoint, 
  updateEndpoint, 
  deleteEndpoint 
} = projectSlice.actions;

export default projectSlice.reducer; 