import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import MobileSidebar from './MobileSidebar';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../features/preferencesSlice';
import authService from '../utils/authService';

// Helper to trigger auth state change event
function triggerAuthChanged() {
  window.dispatchEvent(new Event('authChanged'));
}

// Helper to get theme from localStorage or default
function getInitialTheme() {
  const stored = localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

// Apply theme to document body
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Fixed Navbar at the top of the app
const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const theme = useSelector((state) => state.preferences.theme);
  const [effectiveTheme, setEffectiveTheme] = useState(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Update state on login/logout via custom event
  useEffect(() => {
    const handleAuthChange = () => {
      // Auth state is now managed by Redux, so we don't need to do anything here
      // The authService.checkAuth() will update Redux state
    };
    
    window.addEventListener('authChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const update = () => setEffectiveTheme(mql.matches ? 'dark' : 'light');
      update();
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);

  // Logout handler
  const handleLogout = async () => {
    await authService.logout();
    triggerAuthChanged();
    navigate('/login');
  };

  // Theme toggle handler
  const toggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 flex items-center px-4 md:px-8 shadow-sm">
      {/* Mobile Hamburger - Only show if authenticated */}
      {isAuthenticated && (
        <button
          className="md:hidden flex items-center justify-center mr-2 text-gray-700 dark:text-gray-200 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu size={26} />
        </button>
      )}
      
      {/* Logo/Brand */}
      <Link 
        to={isAuthenticated ? "/dashboard" : "/"} 
        className="text-xl font-bold text-blue-600 dark:text-blue-400 mr-6"
      >
        Restage
      </Link>
      
      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center gap-6 flex-1">
        {isAuthenticated ? (
          // Authenticated user menu
          <>
            <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
            <Link to="/settings" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Settings</Link>
            <span className="ml-auto flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
              <button
                onClick={toggleTheme}
                className="text-xl text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                aria-label="Toggle theme"
              >
                {effectiveTheme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
              </button>
              {user && <><span className="hidden md:inline"><span className="font-semibold">{user.name}</span></span></>}
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </span>
          </>
        ) : (
          // Non-authenticated user menu
          <>
            <span className="ml-auto flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
              <button
                onClick={toggleTheme}
                className="text-xl text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                aria-label="Toggle theme"
              >
                {effectiveTheme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
              </button>
              <Link
                to="/login"
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Register
              </Link>
            </span>
          </>
        )}
      </nav>
      
      {/* Mobile Sidebar - Only render if authenticated */}
      {isAuthenticated && (
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user?.name} />
      )}
    </header>
  );
};

export default Navbar;
export { triggerAuthChanged }; 