import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AuthPage from './pages/AuthPage';
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
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-200 py-12 px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Welcome to APIForge
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          APIForge helps you design, mock, and manage your API projects with ease. 
          Please log in or register to get started.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/login"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  useAppTheme();
  return (
    // Overall app container: flex-col, min-h-screen, theme-aware
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
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
          </Route>

          {/* Protected routes with sidebar layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/project/:id" element={<ProjectDetailsPage />} />
              <Route path="/project/:projectName/:module/:endpointId" element={<EndpointDetailsPage />} />
              <Route path="/project/:projectName/module/:moduleName" element={<ModuleDetailsPage />} />
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
