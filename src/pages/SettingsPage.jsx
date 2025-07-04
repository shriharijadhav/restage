import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, setLanguage } from '../features/preferencesSlice';
import { FiUser, FiShield, FiBell, FiSettings, FiGlobe, FiSave, FiX } from 'react-icons/fi';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.preferences.theme);
  const language = useSelector((state) => state.preferences.language);
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      company: 'Tech Corp',
      role: 'API Developer'
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings size={18} /> },
    { id: 'security', label: 'Security', icon: <FiShield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell size={18} /> }
  ];

  const handleSave = (section) => {
    // Simulate saving settings
    console.log(`Saving ${section} settings:`, settings[section]);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account preferences and security settings
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
                  onClick={() => setActiveTab(tab.id)}
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
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Profile Information</h2>
                  <p className="text-gray-600 dark:text-gray-400">Update your personal information and account details.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, name: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, email: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={settings.profile.company}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, company: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={settings.profile.role}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, role: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('profile')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FiSave size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Preferences</h2>
                  <p className="text-gray-600 dark:text-gray-400">Customize your experience and interface settings.</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['light', 'dark', 'system'].map((t) => (
                        <button
                          key={t}
                          onClick={() => dispatch(setTheme(t))}
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
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => dispatch(setLanguage(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('preferences')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FiSave size={16} />
                    Save Changes
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
    </div>
  );
};

export default SettingsPage; 