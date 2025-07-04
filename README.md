# Restage - API Design & Mocking Platform

A modern React application for mocking, documenting, and testing APIs with ease. Built with React, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

### **Authentication & Security**
- 🔐 **Cookie-based authentication** with HTTP-only cookies
- 🛡️ **Secure session management** with automatic token validation
- 🔄 **Automatic logout** on authentication failures
- 🚪 **Protected routes** with loading states

### **API Management**
- 📁 **Project organization** with modules and endpoints
- 🔧 **API design tools** for creating and editing endpoints
- 🎭 **Mock server** for testing API responses
- 📊 **Response visualization** with syntax highlighting

### **User Experience**
- 🌙 **Dark/Light theme** with system preference detection
- 📱 **Responsive design** with mobile sidebar navigation
- ⚡ **Fast loading** with optimized routing
- 🎨 **Modern UI** with Tailwind CSS

### **Development Features**
- 🔧 **Centralized API service** with request/response interceptors
- 📦 **Redux state management** with RTK
- 🎯 **Type-safe development** with proper error handling
- 📝 **Comprehensive logging** for debugging

## 🏗️ Architecture

### **Frontend Stack**
- **React 19** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Vite** - Build tool

### **Key Components**
```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components
│   ├── endpoint/       # Endpoint-specific components
│   └── common/         # Common UI components
├── features/           # Redux slices
├── pages/             # Route components
├── services/          # API service classes
├── utils/             # Utility functions
├── config/            # Configuration files
└── docs/              # Documentation
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- Backend server running (see server README)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apimocker/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the client root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

### **Authentication**

#### **Login**
1. Navigate to `/login`
2. Enter your email and password
3. Click "Login" to access the dashboard

#### **Registration**
1. Navigate to `/register`
2. Fill in your details (name, email, password)
3. Click "Sign Up" to create your account

### **Dashboard**

#### **Creating Projects**
1. Click "Create Project" on the dashboard
2. Enter project name and description
3. Click "Create" to add the project

#### **Managing Endpoints**
1. Select a project from the dashboard
2. Navigate to the desired module
3. Click "Add Endpoint" to create new endpoints
4. Configure HTTP method, path, and responses

#### **Testing APIs**
1. Use the built-in playground to test endpoints
2. View real-time response data
3. Debug with comprehensive logging

## 🔧 Development

### **Project Structure**

#### **Components**
- **Layout Components**: Main layout, sidebar, navigation
- **Feature Components**: Project cards, endpoint forms, response viewers
- **Common Components**: Buttons, modals, forms

#### **State Management**
- **User Slice**: Authentication state and user data
- **Project Slice**: Projects, modules, and endpoints
- **Preferences Slice**: Theme and user preferences

#### **Services**
- **AuthService**: Authentication operations
- **ProjectService**: Project management
- **ApiService**: Centralized HTTP client

### **API Integration**

#### **Making API Calls**
```javascript
import { api } from '../utils/apiService';

// GET request
const response = await api.get('/api/projects');

// POST request
const response = await api.post('/api/projects', projectData);
```

#### **Using Service Classes**
```javascript
import projectService from '../services/projectService';

const result = await projectService.getProjects();
if (result.success) {
  console.log(result.data);
}
```

### **Styling**
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable styled components
- **Theme Support**: Dark/light mode with system detection

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing (when implemented)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🔒 Security Features

### **Authentication**
- HTTP-only cookies for token storage
- Automatic session validation
- Secure logout with cookie clearing
- Protected route guards

### **API Security**
- CORS configuration for cross-origin requests
- Request/response interceptors for error handling
- Automatic 401 error handling
- Input validation and sanitization

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation with expanded features
- **Tablet**: Collapsible sidebar with touch-friendly interface
- **Mobile**: Hamburger menu with mobile-optimized layout

## 🎨 Theming

### **Theme Modes**
- **Light Mode**: Clean, professional appearance
- **Dark Mode**: Easy on the eyes for extended use
- **System**: Automatically matches OS preference

### **Customization**
- Theme preferences stored in Redux
- Smooth transitions between themes
- Consistent color scheme across components

## 🐛 Troubleshooting

### **Common Issues**

#### **Authentication Problems**
- Ensure backend server is running
- Check CORS configuration
- Verify cookie settings in browser

#### **API Connection Issues**
- Confirm `VITE_API_BASE_URL` is correct
- Check network connectivity
- Review browser console for errors

#### **Build Issues**
- Clear node_modules and reinstall
- Check for dependency conflicts
- Verify Node.js version compatibility

## 📚 Documentation

- **Session Management**: See `src/docs/SESSION_MANAGEMENT.md`
- **API Service**: See `src/utils/README.md`
- **Component Library**: Inline documentation in component files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation in `src/docs/`
- Review the troubleshooting section
- Open an issue on GitHub

---

**Restage** - Mock, Document & Test your APIs with confidence.
