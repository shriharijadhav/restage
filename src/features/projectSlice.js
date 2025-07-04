import { createSlice } from '@reduxjs/toolkit';

// Example initial state with mock data (replace with API data in the future)
const initialState = {
  projects: [
    {
      id: 'proj-1',
      name: 'user-api',
      description: 'A comprehensive user management API...',
      createdAt: '2024-05-01T10:00:00Z',
      lastModified: '2024-05-20T15:30:00Z',
      version: 'v1.2.0',
      contributors: [
        { name: 'John Doe', role: 'Lead Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
        { name: 'Jane Smith', role: 'Backend Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
        { name: 'Mike Johnson', role: 'API Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
      ],
      stats: {
        totalEndpoints: 8,
        totalModules: 3,
        totalRequests: 15420,
        averageResponseTime: 145,
        uptime: 99.9,
      },
      tags: ['Authentication', 'User Management', 'REST API', 'JWT', 'E-commerce'],
      baseUrl: 'https://api.example.com',
      documentation: 'https://docs.example.com/user-api',
      repository: 'https://github.com/example/user-api',
      modules: [
        {
          name: 'auth',
          description: 'User authentication endpoints',
          lastUpdated: '2024-05-20T15:30:00Z',
          endpoints: [
            {
              id: 'auth-1',
              method: 'POST',
              path: '/api/auth/login',
              title: 'User Login',
              description: 'Authenticate user with credentials',
              lastModified: '2024-01-15T10:30:00Z',
            },
            // ...more endpoints
          ],
        },
        // ...more modules
      ],
    },
    // ...more projects
  ],
  currentProject: null,
  modules: [],
  endpoints: [],
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects(state, action) {
      state.projects = action.payload;
    },
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
      state.modules = action.payload?.modules || [];
    },
    setModules(state, action) {
      state.modules = action.payload;
    },
    setEndpoints(state, action) {
      state.endpoints = action.payload;
    },
    addEndpoint(state, action) {
      // Add endpoint to the correct module in modules
      const { moduleName, endpoint } = action.payload;
      const module = state.modules.find(m => m.name === moduleName);
      if (module) {
        module.endpoints.push(endpoint);
      }
    },
    updateModule(state, action) {
      const { moduleName, data } = action.payload;
      const idx = state.modules.findIndex(m => m.name === moduleName);
      if (idx !== -1) {
        state.modules[idx] = { ...state.modules[idx], ...data };
      }
    },
    addProject(state, action) {
      state.projects.push(action.payload);
    },
    deleteProject(state, action) {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    editProject(state, action) {
      const { id, name, description, lastModified } = action.payload;
      const idx = state.projects.findIndex(p => p.id === id);
      if (idx !== -1) {
        state.projects[idx] = {
          ...state.projects[idx],
          name,
          description,
          lastModified: lastModified || new Date().toISOString(),
        };
      }
    },
    addEndpointToProjectModule(state, action) {
      // { projectId, moduleName, endpoint }
      const { projectId, moduleName, endpoint } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        let module = project.modules.find(m => m.name === moduleName);
        if (!module) {
          // Create new module with id
          module = {
            id: generateId('mod'),
            name: moduleName,
            description: '',
            lastUpdated: new Date().toISOString(),
            endpoints: [],
          };
          project.modules.push(module);
        }
        // Ensure endpoint has id
        if (!endpoint.id) endpoint.id = generateId(moduleName);
        module.endpoints.push(endpoint);
        module.lastUpdated = new Date().toISOString();
      }
      // If currentProject is the same, update modules in state too
      if (state.currentProject && state.currentProject.id === projectId) {
        let module = state.modules.find(m => m.name === moduleName);
        if (!module) {
          module = {
            id: generateId('mod'),
            name: moduleName,
            description: '',
            lastUpdated: new Date().toISOString(),
            endpoints: [],
          };
          state.modules.push(module);
        }
        if (!endpoint.id) endpoint.id = generateId(moduleName);
        module.endpoints.push(endpoint);
        module.lastUpdated = new Date().toISOString();
      }
    },
    setCurrentProjectById(state, action) {
      const project = state.projects.find(p => p.id === action.payload);
      if (project) {
        state.currentProject = project;
        state.modules = project.modules || [];
      }
    },
  },
});

export const { setProjects, setCurrentProject, setModules, setEndpoints, addEndpoint, updateModule, addProject, deleteProject, editProject, addEndpointToProjectModule, setCurrentProjectById } = projectSlice.actions;
export default projectSlice.reducer;

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
} 