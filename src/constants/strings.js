// Application-wide string constants
// This file centralizes all hardcoded strings for better maintainability and internationalization support

export const APP = {
  NAME: 'Restage',
  DESCRIPTION: 'API documentation and mock endpoints',
  TAGLINE: 'Design, document, and test your APIs',
};

export const AUTH = {
  // Page titles and headers
  WELCOME_BACK: 'Welcome Back',
  JOIN_RESTAGE: 'Join Restage',
  SIGN_IN_SUBTITLE: 'Sign in to your account',
  SIGN_UP_SUBTITLE: 'Create your account to get started',
  
  // Form labels
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  LAST_NAME_OPTIONAL: 'Last Name (optional)',
  ORGANIZATION_NAME: 'Organization Name',
  ORGANIZATION_NAME_OPTIONAL: 'Organization Name (optional)',
  EMAIL: 'Email',
  PASSWORD: 'Password',
  CONFIRM_PASSWORD: 'Confirm Password',
  
  // Placeholders
  FIRST_NAME_PLACEHOLDER: 'First Name',
  LAST_NAME_PLACEHOLDER: 'Last Name (optional)',
  ORGANIZATION_PLACEHOLDER: 'Your Organization',
  EMAIL_PLACEHOLDER: 'you@example.com',
  PASSWORD_PLACEHOLDER: '••••••••',
  
  // Buttons
  LOGIN: 'Login',
  SIGN_UP: 'Sign Up',
  FORGOT_PASSWORD: 'Forgot Password?',
  RESET_PASSWORD: 'Reset Password',
  ENTER_EMAIL: 'Enter your email address',
  SEND_RESET_LINK: 'Send Reset Link',
  VERIFICATION_CODE: 'Verification Code',
  ENTER_OTP: 'Enter the 6-digit code sent to your email',
  VERIFY_OTP: 'Verify Code',
  NEW_PASSWORD: 'New Password',
  CONFIRM_NEW_PASSWORD: 'Confirm New Password',
  RESET_PASSWORD_BUTTON: 'Reset Password',
  BACK_TO_LOGIN: 'Back to Login',
  UPDATE_PASSWORD: 'Update Password',
  CURRENT_PASSWORD: 'Current Password',
  NEW_PASSWORD: 'New Password',
  CONFIRM_NEW_PASSWORD: 'Confirm New Password',
  UPDATE_PASSWORD_BUTTON: 'Update Password',
  CHANGE_PASSWORD: 'Change Password',
  DONT_HAVE_ACCOUNT: "Don't have an account? Sign Up",
  ALREADY_HAVE_ACCOUNT: 'Already have an account? Login',
  
  // Validation messages
  EMAIL_REQUIRED: 'Email is required.',
  EMAIL_INVALID: 'Please enter a valid email address.',
  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters.',
  FIRST_NAME_REQUIRED: 'First name is required.',

  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  EMAIL_SENT_SUCCESS: 'Password reset email sent successfully. Please check your email.',
  OTP_VERIFIED_SUCCESS: 'Code verified successfully. Please enter your new password.',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully. You can now login with your new password.',
  PASSWORD_UPDATE_SUCCESS: 'Password updated successfully',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
  NO_ACCOUNT_FOUND: 'No account found with this email address. Please sign up first.',
  INVALID_OTP: 'Invalid or expired verification code.',
  OTP_SENT: 'Verification code sent to your email.',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
  
  // Accessibility
  HIDE_PASSWORD: 'Hide password',
  SHOW_PASSWORD: 'Show password',
  HIDE_CONFIRM_PASSWORD: 'Hide confirm password',
  SHOW_CONFIRM_PASSWORD: 'Show confirm password',
};

export const DASHBOARD = {
  // Page titles and headers
  API_PROJECTS: 'API Projects',
  MANAGE_SUBTITLE: 'Manage your API documentation and mock endpoints',
  NEW_PROJECT: 'New Project',
  
  // Search and filters
  SEARCH_PLACEHOLDER: 'Search projects...',
  NO_PROJECTS_FOUND: 'No projects found',
  NO_PROJECTS_YET: 'No projects yet',
  ADJUST_SEARCH: 'Try adjusting your search terms',
  CREATE_FIRST_PROJECT: 'Create your first API project to get started',
  
  // Project cards
  NO_DESCRIPTION: 'No description provided',
  VIEW_MODE_GRID: 'Grid view',
  VIEW_MODE_LIST: 'List view',
  
  // Actions
  EDIT: 'Edit',
  DELETE: 'Delete',
  
  // Modals
  EDIT_PROJECT: 'Edit Project',
  EDIT_PROJECT_SUBTITLE: 'Update project details',
  DELETE_PROJECT: 'Delete Project',
  DELETE_CONFIRMATION: 'Are you sure you want to delete',
  DELETE_WARNING: 'This action cannot be undone.',
  
  // Form labels and placeholders
  PROJECT_NAME: 'Project Name',
  PROJECT_NAME_PLACEHOLDER: 'e.g. my-mock-api',
  DESCRIPTION: 'Description',
  DESCRIPTION_PLACEHOLDER: 'Optional project description',
  
  // Buttons
  CANCEL: 'Cancel',
  SAVE_CHANGES: 'Save Changes',
  SAVING: 'Saving...',
  DELETE_PROJECT_BUTTON: 'Delete Project',
  DELETING: 'Deleting...',
  
  // Validation
  PROJECT_NAME_REQUIRED: 'Project name is required.',
  PROJECT_NAME_INVALID: 'Only lowercase letters, numbers, and hyphens allowed.',
  PROJECT_NAME_HYPHEN_START: 'Cannot start or end with a hyphen.',
  PROJECT_NAME_CONSECUTIVE_HYPHENS: 'No consecutive hyphens.',
  
  // Date formatting
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  DAYS_AGO: 'days ago',
};

export const PROJECTS = {
  // Page titles
  PROJECTS: 'Projects',
  PROJECT_DETAILS: 'Project Details',
  PROJECT_DESIGN: 'Project Design',
  
  // Tabs
  ENDPOINTS: 'API Endpoints',
  OVERVIEW: 'Overview',
  
  // Form steps
  BASIC_INFO: 'Basic Info',
  API_INFO: 'API Info',
  CONTRIBUTORS: 'Contributors',
  
  // Form labels
  PROJECT_NAME: 'Project Name',
  DESCRIPTION: 'Description',
  VERSION: 'Version',
  BASE_URL: 'Base URL',
  DOCUMENTATION: 'Documentation',
  REPOSITORY: 'Repository',
  TAGS: 'Tags (comma separated)',
  LONG_DESCRIPTION: 'Long Description',
  CONTRIBUTOR_NAME: 'Name',
  CONTRIBUTOR_ROLE: 'Role',
  
  // Placeholders
  VERSION_PLACEHOLDER: 'v1.0.0',
  BASE_URL_PLACEHOLDER: 'https://api.example.com',
  DOCUMENTATION_PLACEHOLDER: 'https://docs.example.com',
  REPOSITORY_PLACEHOLDER: 'https://github.com/user/repo',
  TAGS_PLACEHOLDER: 'e.g. auth, user, api',
  CONTRIBUTOR_NAME_PLACEHOLDER: 'Name',
  CONTRIBUTOR_ROLE_PLACEHOLDER: 'Role',
  CONTRIBUTOR_EMAIL_PLACEHOLDER: 'Email (optional)',
  
  // Buttons
  CREATE_PROJECT: 'Create Project',
  NEXT: 'Next',
  BACK: 'Back',
  REMOVE: 'Remove',
  CANCEL: 'Cancel',
  
  // Validation
  PROJECT_NAME_REQUIRED: 'Project name is required',
  DESCRIPTION_REQUIRED: 'Description is required',
};

export const ENDPOINTS = {
  // Page titles
  ENDPOINT_DETAILS: 'Endpoint Details',
  
  // Tabs
  SPECIFICATION: 'Specification',
  PLAYGROUND: 'Playground',
  
  // Form steps
  BASIC_INFO: 'Basic Info',
  HEADERS: 'Headers',
  QUERY_PARAMETERS: 'Query Parameters',
  REQUEST_BODY: 'Request Body',
  SAMPLE_RESPONSE: 'Sample Response',
  POSSIBLE_ERRORS: 'Possible Errors',
  
  // Form labels
  PATH: 'Path',
  METHOD: 'Method',
  DESCRIPTION: 'Description',
  MODULE: 'Module',
  STATUS_CODE: 'Status Code',
  VERSION: 'Version',
  HEADER_KEY: 'Key',
  HEADER_VALUE: 'Value',
  QUERY_KEY: 'Key',
  QUERY_VALUE: 'Value',
  REQUEST_BODY_JSON: 'Request Body (JSON)',
  RESPONSE_BODY_JSON: 'Sample Response (JSON)',
  ERROR_CODE: 'Code',
  ERROR_MESSAGE: 'Message',
  ERROR_DESCRIPTION: 'Description',
  
  // Placeholders
  PATH_PLACEHOLDER: '/api/endpoint',
  DESCRIPTION_PLACEHOLDER: 'Describe what this endpoint does...',
  VERSION_PLACEHOLDER: 'v1.0',
  KEY_PLACEHOLDER: 'Key',
  VALUE_PLACEHOLDER: 'Value',
  REQUEST_BODY_PLACEHOLDER: `{
  "username": "string",
  "password": "string"
}`,
  RESPONSE_BODY_PLACEHOLDER: `{
  "success": true,
  "token": "jwt"
}`,
  CODE_PLACEHOLDER: 'Code',
  MESSAGE_PLACEHOLDER: 'Message',
  DESCRIPTION_PLACEHOLDER: 'Description',
  
  // Buttons
  ADD_HEADER: 'Add Header',
  REMOVE_HEADER: 'Remove',
  ADD_QUERY_PARAM: 'Add Query Parameter',
  REMOVE_QUERY_PARAM: 'Remove',
  ADD_ERROR: 'Add Error Response',
  REMOVE_ERROR: 'Remove',
  
  // Validation
  PATH_REQUIRED: 'Path is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  INVALID_JSON: 'Invalid JSON',
  
  // Status codes
  STATUS_200: '200 - OK',
  STATUS_201: '201 - Created',
  STATUS_204: '204 - No Content',
  STATUS_400: '400 - Bad Request',
  STATUS_401: '401 - Unauthorized',
  STATUS_403: '403 - Forbidden',
  STATUS_404: '404 - Not Found',
  STATUS_500: '500 - Internal Server Error',
  
  // HTTP methods
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  
  // Default modules
  AUTH_MODULE: 'auth',
  USERS_MODULE: 'users',
  PRODUCTS_MODULE: 'products',
  
  // Playground
  LANGUAGE: 'Language:',
  SEND_REQUEST: 'Send Request',
  CLICK_TO_SEE_RESPONSE: 'Click "Send Request" to see the response',
  COPY_URL: 'Copy URL',
  COPIED: 'Copied!',
  
  // Meta info
  CREATED_BY: 'Created by',
  CURRENT_USER: 'Current User',
  LAST_MODIFIED: 'Last modified',
  VERSION_INFO: 'Version',
  STATUS: 'Status',
};

export const SETTINGS = {
  // Page titles
  SETTINGS: 'Settings',
  SETTINGS_SUBTITLE: 'Manage your account preferences and security settings',
  
  // Tabs
  PROFILE: 'Profile',
  PREFERENCES: 'Preferences',
  SECURITY: 'Security',
  NOTIFICATIONS: 'Notifications',
  
  // Profile section
  PROFILE_INFORMATION: 'Profile Information',
  PROFILE_SUBTITLE: 'Update your personal information and account details.',
  FULL_NAME: 'Full Name',
  EMAIL_ADDRESS: 'Email Address',
  ORGANIZATION: 'Organization',
  ROLE: 'Role',
  
  // Preferences section
  PREFERENCES_TITLE: 'Preferences',
  PREFERENCES_SUBTITLE: 'Customize your experience and interface settings.',
  THEME: 'Theme',
  LANGUAGE: 'Language',
  
  // Theme options
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
  
  // Language options
  ENGLISH: 'English',
  SPANISH: 'Spanish',
  FRENCH: 'French',
  GERMAN: 'German',
  
  // Notifications section
  EMAIL_NOTIFICATIONS: 'Email Notifications',
  PUSH_NOTIFICATIONS: 'Push Notifications',
  WEEKLY_DIGEST: 'Weekly Digest',
  EMAIL_NOTIFICATIONS_DESC: 'Receive notifications via email',
  PUSH_NOTIFICATIONS_DESC: 'Receive push notifications in your browser',
  WEEKLY_DIGEST_DESC: 'Get a weekly summary of your activity',
  
  // Buttons
  SAVE_CHANGES: 'Save Changes',
  EDIT_PROFILE: 'Edit Profile',
  
  // Default values
  DEFAULT_NAME: 'John Doe',
  DEFAULT_EMAIL: 'john.doe@example.com',
  DEFAULT_ORGANIZATION: 'Tech Corp',
  DEFAULT_ROLE: 'API Developer',
};

export const NAVIGATION = {
  // Navigation links
  DASHBOARD: 'Dashboard',
  SETTINGS: 'Settings',
  LOGOUT: 'Logout',
  
  // Accessibility
  OPEN_MENU: 'Open menu',
  TOGGLE_THEME: 'Toggle theme',
  CLOSE: 'Close',
};

export const COMMON = {
  // Loading states
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  SUBMITTING: 'Submitting...',
  
  // Actions
  CANCEL: 'Cancel',
  SAVE: 'Save',
  DELETE: 'Delete',
  EDIT: 'Edit',
  REMOVE: 'Remove',
  ADD: 'Add',
  NEXT: 'Next',
  BACK: 'Back',
  SUBMIT: 'Submit',
  
  // Status messages
  SUCCESS: 'Success',
  ERROR: 'Error',
  WARNING: 'Warning',
  INFO: 'Info',
  
  // Date formatting
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  DAYS_AGO: 'days ago',
  
  // HTTP status texts
  OK: 'OK',
  CREATED: 'Created',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  UNKNOWN: 'Unknown',
  
  // Form validation
  REQUIRED: 'Required',
  INVALID_FORMAT: 'Invalid format',
  MIN_LENGTH: 'Minimum length',
  MAX_LENGTH: 'Maximum length',
  
  // Placeholders
  SEARCH_PLACEHOLDER: 'Search...',
  NO_DATA: 'No data available',
  NO_RESULTS: 'No results found',
};

export const ERRORS = {
  // API errors
  NETWORK_ERROR: 'Network error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error occurred',
  VALIDATION_ERROR: 'Validation error',
  
  // Form errors
  FIELD_REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_JSON: 'Invalid JSON format',
  
  // General errors
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  TRY_AGAIN: 'Please try again',
  CONTACT_SUPPORT: 'Please contact support if the problem persists',
  
  // Theme and preferences errors
  THEME_UPDATE_FAILED: 'Failed to save theme preference',
  PREFERENCES_UPDATE_FAILED: 'Failed to save preferences',
};

export const SUCCESS = {
  // Success messages
  SAVED_SUCCESSFULLY: 'Saved successfully',
  DELETED_SUCCESSFULLY: 'Deleted successfully',
  CREATED_SUCCESSFULLY: 'Created successfully',
  UPDATED_SUCCESSFULLY: 'Updated successfully',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard',
  LOGGED_IN_SUCCESSFULLY: 'Logged in successfully',
  LOGGED_OUT_SUCCESSFULLY: 'Logged out successfully',
  REGISTERED_SUCCESSFULLY: 'Registered successfully',
  NO_CHANGES_TO_SAVE: 'No changes to save',
  
  // Theme and preferences
  THEME_UPDATED: 'Theme updated successfully',
  PREFERENCES_SAVED: 'Preferences saved successfully',
};

export const VALIDATION = {
  // Common validation messages
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_JSON: 'Invalid JSON format',
  PROJECT_NAME_INVALID: 'Only lowercase letters, numbers, and hyphens allowed',
  PROJECT_NAME_HYPHEN_START: 'Cannot start or end with a hyphen',
  PROJECT_NAME_CONSECUTIVE_HYPHENS: 'No consecutive hyphens',
  
  // Field-specific validation
  FIRST_NAME_REQUIRED: 'First name is required',

  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
  PROJECT_NAME_REQUIRED: 'Project name is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  PATH_REQUIRED: 'Path is required',
};

export const PLACEHOLDERS = {
  // Form placeholders
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name (optional)',
  ORGANIZATION: 'Your Organization',
  EMAIL: 'you@example.com',
  PASSWORD: '••••••••',
  PROJECT_NAME: 'e.g. my-mock-api',
  DESCRIPTION: 'Optional project description',
  PATH: '/api/endpoint',
  VERSION: 'v1.0',
  KEY: 'Key',
  VALUE: 'Value',
  SEARCH: 'Search...',
  
  // JSON placeholders
  REQUEST_BODY: `{
  "username": "string",
  "password": "string"
}`,
  RESPONSE_BODY: `{
  "success": true,
  "token": "jwt"
}`,
  
  // Other placeholders
  TAGS: 'e.g. auth, user, api',
  CONTRIBUTOR_NAME: 'Name',
  CONTRIBUTOR_ROLE: 'Role',
};

export const ARIA_LABELS = {
  // Accessibility labels
  TOGGLE_THEME: 'Toggle theme',
  OPEN_MENU: 'Open menu',
  CLOSE: 'Close',
  HIDE_PASSWORD: 'Hide password',
  SHOW_PASSWORD: 'Show password',
  HIDE_CONFIRM_PASSWORD: 'Hide confirm password',
  SHOW_CONFIRM_PASSWORD: 'Show confirm password',
  COPY_URL: 'Copy URL',
  REMOVE_ITEM: 'Remove item',
  ADD_ITEM: 'Add item',
};

export const ROLES = {
  // ARIA roles
  MENU: 'menu',
  MENUITEM: 'menuitem',
  DIALOG: 'dialog',
  BUTTON: 'button',
};

export default {
  APP,
  AUTH,
  DASHBOARD,
  PROJECTS,
  ENDPOINTS,
  SETTINGS,
  NAVIGATION,
  COMMON,
  ERRORS,
  SUCCESS,
  VALIDATION,
  PLACEHOLDERS,
  ARIA_LABELS,
  ROLES,
}; 