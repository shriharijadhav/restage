import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { FiArrowLeft } from 'react-icons/fi';
import apiService from '../utils/apiService';
import { useSnackbar } from '../contexts/SnackbarContext';
import { AUTH, VALIDATION, PLACEHOLDERS, ARIA_LABELS } from '../constants/strings';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useSnackbar();
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showError(VALIDATION.EMAIL_INVALID);
      return;
    }

    if (!emailRegex.test(email)) {
      showError(VALIDATION.EMAIL_INVALID);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.post('/api/auth/forgot-password', { email });
      showSuccess(response.data.message);
      setStep(2);
    } catch (err) {
      console.error('Forgot password error:', err);
      showError(err.response?.data?.message || AUTH.UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      showError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.post('/api/auth/verify-otp', { email, otp });
      showSuccess(response.data.message);
      setStep(3);
    } catch (err) {
      console.error('OTP verification error:', err);
      showError(err.response?.data?.message || AUTH.INVALID_OTP);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      showError(VALIDATION.PASSWORD_MIN_LENGTH);
      return;
    }

    if (newPassword !== confirmPassword) {
      showError(VALIDATION.PASSWORDS_DONT_MATCH);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      showSuccess(response.data.message);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err) {
      console.error('Password reset error:', err);
      showError(err.response?.data?.message || AUTH.UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to previous step
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-app py-12 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors"
          >
            <FiArrowLeft size={16} className="mr-2" />
            {step === 1 ? 'Back to Login' : 'Back'}
          </button>
          
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {AUTH.RESET_PASSWORD}
          </h2>
          
          <p className="text-center text-gray-600 dark:text-gray-300">
            {step === 1 && 'Enter your email to receive a verification code'}
            {step === 2 && 'Enter the 6-digit code sent to your email'}
            {step === 3 && 'Create a new password for your account'}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} noValidate>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-200 font-semibold mb-2">
                {AUTH.EMAIL}
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
                placeholder={PLACEHOLDERS.EMAIL}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
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
              {AUTH.SEND_RESET_LINK}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleOTPSubmit} noValidate>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-gray-200 font-semibold mb-2">
                {AUTH.VERIFICATION_CODE}
              </label>
              <input
                id="otp"
                type="text"
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400 text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
              />
              <p className="text-sm text-gray-400 mt-2 text-center">
                {AUTH.ENTER_OTP}
              </p>
            </div>
            
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
              {AUTH.VERIFY_OTP}
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordReset} noValidate>
            <div className="mb-4 relative">
              <label htmlFor="newPassword" className="block text-gray-200 font-semibold mb-2">
                {AUTH.NEW_PASSWORD}
              </label>
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
                placeholder={PLACEHOLDERS.PASSWORD}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
            </div>

            <div className="mb-6 relative">
              <label htmlFor="confirmPassword" className="block text-gray-200 font-semibold mb-2">
                {AUTH.CONFIRM_NEW_PASSWORD}
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-700 text-white placeholder-gray-400"
                placeholder={PLACEHOLDERS.PASSWORD}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 transform text-gray-400 hover:text-gray-200 focus:outline-none"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? ARIA_LABELS.HIDE_CONFIRM_PASSWORD : ARIA_LABELS.SHOW_CONFIRM_PASSWORD}
              >
                {showConfirmPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
              </button>
            </div>
            
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
              {AUTH.RESET_PASSWORD_BUTTON}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 