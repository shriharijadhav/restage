import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiHome, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import authService from '../utils/authService';
import { triggerAuthChanged } from './Navbar';

const MobileSidebar = ({ open, onClose, user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    triggerAuthChanged();
    navigate('/login');
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all ${open ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Menu</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
            <FiX size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <FiHome /> Dashboard
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <FiSettings /> Settings
          </Link>
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100">
              <FiUser /> {user}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 mt-4"
          >
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>
    </div>
  );
};

export default MobileSidebar; 