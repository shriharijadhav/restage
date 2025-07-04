# Session Management Guide

## Overview

Your client application uses a **cookie-based session management system** with Redux for state management. This approach provides security and user experience benefits.

## Architecture Components

### 1. **Cookie-Based Authentication**
- **Storage**: HTTP-only cookies (server-side)
- **Security**: No client-side token storage
- **Automatic**: Cookies sent with every request via `withCredentials: true`

### 2. **Redux State Management**
- **User Data**: Stored in Redux store
- **Authentication Status**: Managed via `isAuthenticated` flag
- **Persistence**: Lost on page refresh (requires re-authentication check)

### 3. **API Service Layer**
- **Centralized**: All API calls go through `apiService.js`
- **Interceptors**: Automatic error handling and session management
- **Credentials**: Automatic cookie inclusion

## Session Flow

### 🔐 **Login Process**
```javascript
// 1. User submits login form
const result = await authService.login(email, password);

// 2. Backend validates credentials and sets HTTP-only cookie
// 3. Frontend calls checkAuth() to get user data
// 4. User data stored in Redux
// 5. User redirected to dashboard
```

### 🔍 **Session Validation**
```javascript
// 1. App loads → ProtectedRoute checks authentication
// 2. Calls /api/auth/me with cookies
// 3. Server validates JWT from cookie
// 4. Returns user data if valid
// 5. Updates Redux state
```

### 🚪 **Logout Process**
```javascript
// 1. User clicks logout
await authService.logout();

// 2. Backend clears cookie
// 3. Frontend clears Redux state
// 4. User redirected to login
```

## Key Components

### **1. AuthService (`src/utils/authService.js`)**
```javascript
class AuthService {
  // Check if user is authenticated
  async checkAuth() { /* ... */ }
  
  // Login user
  async login(email, password) { /* ... */ }
  
  // Logout user
  async logout() { /* ... */ }
}
```

**Features:**
- ✅ Prevents duplicate auth checks
- ✅ Automatic user data fetching after login
- ✅ Centralized authentication logic

### **2. UserSlice (`src/features/userSlice.js`)**
```javascript
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => { /* ... */ },
    logout: (state) => { /* ... */ },
  },
});
```

**Features:**
- ✅ Stores user data and auth status
- ✅ No localStorage dependencies
- ✅ Clean state management

### **3. ProtectedRoute (`src/components/ProtectedRoute.jsx`)**
```javascript
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  
  useEffect(() => {
    // Check authentication on mount
    authService.checkAuth();
  }, []);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <Outlet />;
};
```

**Features:**
- ✅ Automatic auth check on route access
- ✅ Loading state during auth check
- ✅ Redirect to login if unauthorized

### **4. ApiService (`src/utils/apiService.js`)**
```javascript
const axiosInstance = axios.create({
  withCredentials: true, // Include cookies automatically
  // ... other config
});

// Response interceptor handles 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

**Features:**
- ✅ Automatic cookie inclusion
- ✅ 401 error handling
- ✅ Request cancellation support

## Session States

### **1. Unauthenticated**
```javascript
{
  user: null,
  isAuthenticated: false
}
```
- User not logged in
- Redirected to login page
- No access to protected routes

### **2. Loading**
```javascript
// During auth check
isLoading: true
```
- Checking authentication status
- Shows loading spinner
- Prevents premature redirects

### **3. Authenticated**
```javascript
{
  user: { id: "123", name: "John Doe", email: "john@example.com" },
  isAuthenticated: true
}
```
- User logged in
- Access to protected routes
- User data available throughout app

## Security Features

### **1. HTTP-Only Cookies**
- ✅ Cannot be accessed via JavaScript
- ✅ Protected from XSS attacks
- ✅ Automatically sent with requests

### **2. Automatic Session Validation**
- ✅ Every protected route checks authentication
- ✅ Automatic logout on 401 errors
- ✅ No stale session data

### **3. Request Interceptors**
- ✅ Automatic error handling
- ✅ Session cleanup on auth failures
- ✅ Consistent error responses

## Usage Examples

### **Checking Authentication Status**
```javascript
import { useSelector } from 'react-redux';

const MyComponent = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
};
```

### **Making Authenticated API Calls**
```javascript
import { api } from '../utils/apiService';

// Cookies automatically included
const response = await api.get('/api/projects');
```

### **Manual Logout**
```javascript
import authService from '../utils/authService';

const handleLogout = async () => {
  await authService.logout();
  // User automatically redirected to login
};
```

## Best Practices

### **1. Always Use Service Classes**
```javascript
// ✅ Good
const result = await authService.login(email, password);

// ❌ Bad
const response = await fetch('/api/auth/login', { /* ... */ });
```

### **2. Handle Loading States**
```javascript
// ✅ Good
if (isLoading) return <LoadingSpinner />;

// ❌ Bad
if (!user) return <LoginPrompt />; // Might show during auth check
```

### **3. Use Redux Selectors**
```javascript
// ✅ Good
const { user, isAuthenticated } = useSelector((state) => state.user);

// ❌ Bad
const user = JSON.parse(localStorage.getItem('user'));
```

## Troubleshooting

### **Common Issues**

1. **Session Lost on Refresh**
   - ✅ Normal behavior - requires re-authentication check
   - ✅ ProtectedRoute handles this automatically

2. **Multiple Auth Checks**
   - ✅ AuthService prevents duplicate calls
   - ✅ Uses promise caching mechanism

3. **401 Errors Not Handled**
   - ✅ ApiService interceptors handle automatically
   - ✅ Automatic logout and redirect

4. **Cookies Not Sent**
   - ✅ Ensure `withCredentials: true` is set
   - ✅ Check CORS configuration on server

## Session Lifecycle

```
1. App Load → Check Auth → Loading State
2. Auth Check → Success/Failure
3. Success → Set User Data → Access Granted
4. Failure → Clear State → Redirect to Login
5. User Actions → API Calls with Cookies
6. Logout → Clear Cookie → Clear State → Redirect
```

This session management system provides a secure, user-friendly experience with automatic session validation and proper error handling. 