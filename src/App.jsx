import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AuthPage from './pages/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import EndpointDetailsPage from './pages/EndpointDetailsPage';
import ModuleDetailsPage from './pages/ModuleDetailsPage';
import Navbar from './components/Navbar'; // Global fixed Navbar
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import useAppTheme from './utils/useAppTheme';
import authService from './utils/authService';
import { SnackbarProvider } from './contexts/SnackbarContext';

// UnprotectedRoute: Redirects to /dashboard if already logged in
function UnprotectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.checkAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

// RootRoute: Redirects to /dashboard if authenticated, otherwise shows welcome page
function RootRoute() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.checkAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, show welcome page
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-app py-12 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Welcome to Restage
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg">
          Restage helps you mock, document, and test your APIs with ease. 
          Please log in or register to get started.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/auth"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <SnackbarProvider>
      <AppContent />
    </SnackbarProvider>
  );
}

function AppContent() {
  useAppTheme();
  return (
    /* Overall app container: flex-col, min-h-screen, theme-aware */
    <div className="flex flex-col min-h-screen bg-gradient-app text-gray-900 dark:text-gray-100 transition-colors">
      {/* Fixed Navbar at the top (h-16) */}
      <Navbar />
      {/* Content area below Navbar, may contain sidebar + main content or just full-width content */}
      {/* pt-16 ensures content starts below the fixed Navbar */}
      <div className="flex flex-grow pt-16">
        <Routes>
          {/* Root route - redirects to dashboard if authenticated, shows welcome if not */}
          <Route path="/" element={<RootRoute />} />
          
          {/* Auth routes (no sidebar) */}
          <Route element={<UnprotectedRoute />}>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected routes with sidebar layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
              <Route path="/project/:projectId/module/:moduleId/endpoint/:endpointId" element={<EndpointDetailsPage />} />
              <Route path="/project/:projectId/module/:moduleId" element={<ModuleDetailsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* Add more protected routes here that need the sidebar */}
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
