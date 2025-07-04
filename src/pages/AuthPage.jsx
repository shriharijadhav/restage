import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { triggerAuthChanged } from '../components/Navbar';
import authService from '../utils/authService';
import { AUTH, VALIDATION, PLACEHOLDERS, ARIA_LABELS } from '../constants/strings';

const AuthPage = () => {
  // State for form fields and UI
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Email regex for basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = VALIDATION.EMAIL_INVALID;
    } else if (!emailRegex.test(email)) {
      newErrors.email = VALIDATION.EMAIL_INVALID;
    }
    if (!password) {
      newErrors.password = VALIDATION.PASSWORD_MIN_LENGTH;
    } else if (password.length < 6) {
      newErrors.password = VALIDATION.PASSWORD_MIN_LENGTH;
    }
    if (!isLogin) {
      if (!firstName) {
        newErrors.firstName = VALIDATION.FIRST_NAME_REQUIRED;
      }
      // Last name and organization are optional
      if (!confirmPassword) {
        newErrors.confirmPassword = VALIDATION.CONFIRM_PASSWORD_REQUIRED;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = VALIDATION.PASSWORDS_DONT_MATCH;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError('');
    if (!validateForm()) return;
    setIsLoading(true);
    
    try {
      let result;
      if (isLogin) {
        result = await authService.login(email, password);
      } else {
        const name = firstName + (lastName ? ' ' + lastName : '');
        result = await authService.signup(name, email, password, organization);
      }
      
      if (result.success) {
        // Trigger auth state change and redirect
        triggerAuthChanged();
        navigate('/dashboard');
      } else {
        setApiError(result.error);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setApiError(AUTH.UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between Login and Signup forms
  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setOrganization('');
    setErrors({});
    setApiError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          {isLogin ? AUTH.WELCOME_BACK : AUTH.JOIN_RESTAGE}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          {isLogin ? AUTH.SIGN_IN_SUBTITLE : AUTH.SIGN_UP_SUBTITLE}
        </p>
        {apiError && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm text-center">
            {apiError}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          {/* Signup fields: First Name, Last Name, Organization */}
          {!isLogin && (
            <>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-gray-200 font-semibold mb-1">
                  {AUTH.FIRST_NAME}
                </label>
                <input
                  id="firstName"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400 ${errors.firstName ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder={PLACEHOLDERS.FIRST_NAME}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
                {errors.firstName && <div className="text-red-400 text-xs mt-1">{errors.firstName}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-gray-200 font-semibold mb-1">
                  {AUTH.LAST_NAME_OPTIONAL}
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  placeholder={PLACEHOLDERS.LAST_NAME}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="organization" className="block text-gray-200 font-semibold mb-1">
                  {AUTH.ORGANIZATION_NAME_OPTIONAL}
                </label>
                <input
                  id="organization"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400 ${errors.organization ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder={PLACEHOLDERS.ORGANIZATION}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  disabled={isLoading}
                />
                {errors.organization && <div className="text-red-400 text-xs mt-1">{errors.organization}</div>}
              </div>
            </>
          )}
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-200 font-semibold mb-1">
              {AUTH.EMAIL}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
              placeholder={PLACEHOLDERS.EMAIL}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {errors.email && <div className="text-red-400 text-xs mt-1">{errors.email}</div>}
          </div>
          {/* Password Field */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-200 font-semibold mb-1">
              {AUTH.PASSWORD}
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
              placeholder={PLACEHOLDERS.PASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform text-gray-400 hover:text-gray-200 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
              aria-label={showPassword ? ARIA_LABELS.HIDE_PASSWORD : ARIA_LABELS.SHOW_PASSWORD}
            >
              {showPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
            </button>
            {errors.password && <div className="text-red-400 text-xs mt-1">{errors.password}</div>}
          </div>
          {/* Confirm Password Field (Signup only) */}
          {!isLogin && (
            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="block text-gray-200 font-semibold mb-1">
                {AUTH.CONFIRM_PASSWORD}
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`}
                placeholder={PLACEHOLDERS.PASSWORD}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? ARIA_LABELS.HIDE_CONFIRM_PASSWORD : ARIA_LABELS.SHOW_CONFIRM_PASSWORD}
              >
                {showConfirmPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
              </button>
              {errors.confirmPassword && <div className="text-red-400 text-xs mt-1">{errors.confirmPassword}</div>}
            </div>
          )}
          {/* Forgot Password Link (Login only) */}
          {isLogin && (
            <div className="mb-4 text-right">
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 hover:underline text-sm font-medium"
                tabIndex={-1}
                disabled={isLoading}
                onClick={() => navigate('/forgot-password')}
              >
                {AUTH.FORGOT_PASSWORD}
              </button>
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {isLogin ? AUTH.LOGIN : AUTH.SIGN_UP}
          </button>
        </form>
        {/* Toggle Login/Signup Link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
            onClick={handleToggle}
            disabled={isLoading}
          >
            {isLogin ? AUTH.DONT_HAVE_ACCOUNT : AUTH.ALREADY_HAVE_ACCOUNT}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 