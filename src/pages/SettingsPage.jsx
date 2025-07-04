import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../features/preferencesSlice';
import { updateProfile } from '../features/userSlice';
import { FiUser, FiShield, FiBell, FiSettings, FiGlobe, FiSave, FiX, FiLock } from 'react-icons/fi';
import userService from '../services/userService';
import useAppTheme from '../utils/useAppTheme';
import { useSnackbar } from '../contexts/SnackbarContext';
import PasswordUpdateModal from '../components/PasswordUpdateModal';
import { SETTINGS, COMMON, SUCCESS, AUTH } from '../constants/strings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const dispatch = useDispatch();
  const { theme, changeTheme } = useAppTheme();
  const language = useSelector((state) => state.preferences.language);
  const user = useSelector((state) => state.user.user);
  const { showSuccess, showError, showInfo } = useSnackbar();
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      organization: '',
      role: ''
    },
    preferences: {
      notifications: {
        email: true,
        push: false,
        weekly: true
      }
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  const tabs = [
    { id: 'profile', label: SETTINGS.PROFILE, icon: <FiUser size={18} /> },
    { id: 'preferences', label: SETTINGS.PREFERENCES, icon: <FiSettings size={18} /> },
    { id: 'security', label: SETTINGS.SECURITY, icon: <FiShield size={18} /> },
    { id: 'notifications', label: SETTINGS.NOTIFICATIONS, icon: <FiBell size={18} /> }
  ];

  const handleTabChange = (tabId) => {
    // Cancel edit mode if switching away from profile tab
    if (activeTab === 'profile' && tabId !== 'profile' && isProfileEditing) {
      handleCancelEdit();
    }
    setActiveTab(tabId);
  };

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          name: user.name || '',
          email: user.email || '',
          organization: user.organization || '',
          role: user.role || ''
        }
      }));
    }
  }, [user]);



  const handleSave = async (section) => {
    if (section === 'profile') {
      // Check if values have actually changed
      const hasChanges = 
        settings.profile.organization !== (user?.organization || '') ||
        settings.profile.role !== (user?.role || '');
      
      if (!hasChanges) {
        showInfo(SUCCESS.NO_CHANGES_TO_SAVE);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const result = await userService.updateProfile({
          organization: settings.profile.organization,
          role: settings.profile.role
        });
        
        if (result.success) {
          dispatch(updateProfile(result.user));
          showSuccess(result.message);
          setIsProfileEditing(false); // Exit edit mode after successful save
        } else {
          showError(result.error);
        }
      } catch (error) {
        showError('Failed to update profile');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle other sections (preferences, security, notifications)
      console.log(`Saving ${section} settings:`, settings[section]);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setSettings(prev => ({
      ...prev,
      profile: {
        name: user?.name || '',
        email: user?.email || '',
        organization: user?.organization || '',
        role: user?.role || ''
      }
    }));
    setIsProfileEditing(false);
  };



  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{SETTINGS.SETTINGS}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {SETTINGS.SETTINGS_SUBTITLE}
        </p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Navigation */}
        <div className="lg:col-span-1">
          <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{SETTINGS.PROFILE_INFORMATION}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{SETTINGS.PROFILE_SUBTITLE}</p>
                  </div>
                  {!isProfileEditing && (
                    <button
                      onClick={() => setIsProfileEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <FiSettings size={16} />
                      {SETTINGS.EDIT_PROFILE}
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {SETTINGS.FULL_NAME}
                    </label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {SETTINGS.EMAIL_ADDRESS}
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {SETTINGS.ORGANIZATION}
                    </label>
                    <input
                      type="text"
                      value={settings.profile.organization}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, organization: e.target.value }
                      })}
                      readOnly={!isProfileEditing}
                      className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isProfileEditing 
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                          : 'bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                      placeholder={isProfileEditing ? "Enter your organization name" : ""}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {SETTINGS.ROLE}
                    </label>
                    <input
                      type="text"
                      value={settings.profile.role}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, role: e.target.value }
                      })}
                      readOnly={!isProfileEditing}
                      className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isProfileEditing 
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                          : 'bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                      placeholder={isProfileEditing ? "Enter your role" : ""}
                    />
                  </div>
                </div>
                
                {isProfileEditing && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <FiX size={16} />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('profile')}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {COMMON.SAVING}
                        </>
                      ) : (
                        <>
                          <FiSave size={16} />
                          {SETTINGS.SAVE_CHANGES}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{SETTINGS.PREFERENCES_TITLE}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{SETTINGS.PREFERENCES_SUBTITLE}</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {SETTINGS.THEME}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[SETTINGS.LIGHT, SETTINGS.DARK, SETTINGS.SYSTEM].map((t) => (
                        <button
                          key={t}
                          onClick={() => changeTheme(t, true)}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            theme === t
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                              {t}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {SETTINGS.LANGUAGE}
                    </label>
                    <select
                      value={language}
                      onChange={(e) => dispatch(setLanguage(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="en">{SETTINGS.ENGLISH}</option>
                      <option value="es">{SETTINGS.SPANISH}</option>
                      <option value="fr">{SETTINGS.FRENCH}</option>
                      <option value="de">{SETTINGS.GERMAN}</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('preferences')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FiSave size={16} />
                    {SETTINGS.SAVE_CHANGES}
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Security</h2>
                  <p className="text-gray-600 dark:text-gray-400">Manage your account security and authentication settings.</p>
                </div>
                
                <div className="space-y-6">
                  {/* Password Update Section */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <FiLock size={20} />
                          Password
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Update your account password to keep it secure
                        </p>
                      </div>
                      <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <FiLock size={16} />
                        {AUTH.CHANGE_PASSWORD}
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated: {user?.passwordUpdatedAt ? 
                        new Date(user.passwordUpdatedAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Never'}
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        security: { ...settings.security, twoFactor: !settings.security.twoFactor }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.security.twoFactor ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Session Timeout */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('security')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FiSave size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Notifications</h2>
                  <p className="text-gray-600 dark:text-gray-400">Configure how you receive notifications and updates.</p>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(settings.preferences.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {key === 'email' ? 'Email Notifications' : key === 'push' ? 'Push Notifications' : 'Weekly Digest'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {key === 'email' ? 'Receive notifications via email' : 
                           key === 'push' ? 'Receive push notifications in your browser' : 
                           'Get a weekly summary of your activity'}
                        </p>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          preferences: {
                            ...settings.preferences,
                            notifications: {
                              ...settings.preferences.notifications,
                              [key]: !value
                            }
                          }
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('notifications')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FiSave size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Update Modal */}
      <PasswordUpdateModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default SettingsPage; 