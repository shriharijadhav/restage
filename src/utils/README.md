# API Service Documentation

## Overview

This project uses a centralized API service architecture with the following components:

- **`apiService.js`** - Core axios instance with interceptors and configuration
- **`authService.js`** - Authentication-specific API calls
- **`projectService.js`** - Project-related API calls (example service)
- **`config/api.js`** - Centralized configuration

## Key Features

### 1. Cookie-Based Authentication
- Uses HTTP-only cookies for security
- No token management in localStorage
- Automatic credential inclusion with `withCredentials: true`

### 2. Request/Response Interceptors
- Automatic error handling
- Request cancellation support
- Logging for specific endpoints
- Automatic logout on 401 errors

### 3. Centralized Configuration
- Base URL configuration
- Timeout settings
- Non-cancellable endpoints
- Logging configuration

## Usage Examples

### Basic API Calls

```javascript
import { api } from '../utils/apiService';

// GET request
const response = await api.get('/api/projects');

// POST request
const response = await api.post('/api/projects', { name: 'New Project' });

// PUT request
const response = await api.put('/api/projects/123', { name: 'Updated Project' });

// DELETE request
const response = await api.delete('/api/projects/123');
```

### Using Service Classes

```javascript
import projectService from '../services/projectService';

// Get all projects
const result = await projectService.getProjects();
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// Create a project
const result = await projectService.createProject({
  name: 'My Project',
  description: 'Project description'
});
```

### Authentication

```javascript
import authService from '../utils/authService';

// Login
const result = await authService.login('user@example.com', 'password');
if (result.success) {
  // Redirect to dashboard
} else {
  console.error(result.error);
}

// Check authentication status
const authStatus = await authService.checkAuth();
```

## Configuration

### Environment Variables

Create a `.env` file in the client root:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_NODE_ENV=development
```

### API Configuration

Modify `src/config/api.js` to customize:

- Base URL
- Timeout settings
- Non-cancellable endpoints
- Logging endpoints

## Error Handling

The API service automatically handles:

- **401 Unauthorized**: Automatically logs out user and redirects to login
- **403 Forbidden**: Logs warning (can be customized)
- **500 Server Error**: Logs error message
- **Network Errors**: Logs with specific error codes

## Request Cancellation

```javascript
import { cancelAllRequests } from '../utils/apiService';

// Cancel all pending requests (except non-cancellable ones)
cancelAllRequests();
```

## Creating New Services

Follow the pattern in `projectService.js`:

```javascript
import { api } from '../utils/apiService';

class MyService {
  async getData() {
    try {
      const response = await api.get('/api/my-endpoint');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error message' };
    }
  }
}

export const myService = new MyService();
export default myService;
```

## Best Practices

1. **Always use service classes** for related API calls
2. **Handle errors consistently** with try-catch blocks
3. **Return standardized responses** with `success` and `data/error` properties
4. **Use the centralized configuration** for environment-specific settings
5. **Add new endpoints to logging arrays** in `config/api.js` when needed 