import React, { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { FiX } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import userService from '../services/userService';
import { useSnackbar } from '../contexts/SnackbarContext';
import { setUser } from '../features/userSlice';
import { AUTH, VALIDATION, PLACEHOLDERS, ARIA_LABELS } from '../constants/strings';

const PasswordUpdateModal = ({ isOpen, onClose }) => {
  const { showSuccess, showError } = useSnackbar();
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!currentPassword) {
      showError('Current password is required');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      showError(VALIDATION.PASSWORD_MIN_LENGTH);
      return;
    }

    if (newPassword !== confirmPassword) {
      showError(VALIDATION.PASSWORDS_DONT_MATCH);
      return;
    }

    if (currentPassword === newPassword) {
      showError('New password must be different from current password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await userService.updatePassword({
        currentPassword,
        newPassword
      });
      
      if (result.success) {
        // Update Redux state with new user data
        dispatch(setUser(result.user));
        showSuccess(result.message);
        handleClose();
      } else {
        showError(result.error);
      }
    } catch (err) {
      console.error('Password update error:', err);
      showError('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  // Handle escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 border border-gray-200 dark:border-gray-700"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {AUTH.UPDATE_PASSWORD}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Password */}
          <div className="relative">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {AUTH.CURRENT_PASSWORD}
            </label>
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder={PLACEHOLDERS.PASSWORD}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              disabled={isLoading}
              aria-label={showCurrentPassword ? ARIA_LABELS.HIDE_PASSWORD : ARIA_LABELS.SHOW_PASSWORD}
            >
              {showCurrentPassword ? <IoIosEyeOff size={20} /> : <IoIosEye size={20} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {AUTH.NEW_PASSWORD}
            </label>
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder={PLACEHOLDERS.PASSWORD}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              onClick={() => setShowNewPassword((prev) => !prev)}
              disabled={isLoading}
              aria-label={showNewPassword ? ARIA_LABELS.HIDE_PASSWORD : ARIA_LABELS.SHOW_PASSWORD}
            >
              {showNewPassword ? <IoIosEyeOff size={20} /> : <IoIosEye size={20} />}
            </button>
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {AUTH.CONFIRM_NEW_PASSWORD}
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder={PLACEHOLDERS.PASSWORD}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              disabled={isLoading}
              aria-label={showConfirmPassword ? ARIA_LABELS.HIDE_CONFIRM_PASSWORD : ARIA_LABELS.SHOW_CONFIRM_PASSWORD}
            >
              {showConfirmPassword ? <IoIosEyeOff size={20} /> : <IoIosEye size={20} />}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <p className="font-medium mb-1">Password requirements:</p>
            <ul className="space-y-1">
              <li>• Minimum 6 characters</li>
              <li>• Must be different from current password</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                AUTH.UPDATE_PASSWORD_BUTTON
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordUpdateModal; 