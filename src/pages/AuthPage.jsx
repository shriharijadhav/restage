import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { triggerAuthChanged } from '../components/Navbar';
import authService from '../utils/authService';

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
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (!isLogin) {
      if (!firstName) {
        newErrors.firstName = 'First name is required.';
      }
      // Last name is optional
      if (!organization) {
        newErrors.organization = 'Organization name is required.';
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password.';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
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
        result = await authService.signup(name, email, password);
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
      setApiError('An unexpected error occurred. Please try again.');
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
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-200 py-12 px-4">
      <div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {isLogin ? 'Welcome Back' : 'Join APIForge'}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
        </p>
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm text-center">
            {apiError}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          {/* Signup fields: First Name, Last Name, Organization */}
          {!isLogin && (
            <>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
                {errors.firstName && <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-1">
                  Last Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 border-gray-300"
                  placeholder="Last Name (optional)"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="organization" className="block text-gray-700 font-semibold mb-1">
                  Organization Name
                </label>
                <input
                  id="organization"
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 ${errors.organization ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Your Organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  disabled={isLoading}
                />
                {errors.organization && <div className="text-red-500 text-xs mt-1">{errors.organization}</div>}
              </div>
            </>
          )}
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
          </div>
          {/* Password Field */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform  text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
            </button>
            {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
          </div>
          {/* Confirm Password Field (Signup only) */}
          {!isLogin && (
            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 right-3 top-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
              </button>
              {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
            </div>
          )}
          {/* Forgot Password Link (Login only) */}
          {isLogin && (
            <div className="mb-4 text-right">
              <button
                type="button"
                className="text-blue-700 hover:underline text-sm font-medium"
                tabIndex={-1}
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        {/* Toggle Login/Signup Link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-blue-700 hover:underline font-medium"
            onClick={handleToggle}
            disabled={isLoading}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 