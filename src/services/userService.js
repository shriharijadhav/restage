import apiService from '../utils/apiService';

class UserService {
  /**
   * Update user profile (organization and role only)
   * @param {Object} profileData - Object containing organization and/or role
   * @returns {Promise<Object>} Response with updated user data
   */
  async updateProfile(profileData) {
    try {
      const response = await apiService.put('/api/auth/profile', profileData);
      return {
        success: true,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  }

  /**
   * Update user password
   * @param {Object} passwordData - Object containing currentPassword and newPassword
   * @returns {Promise<Object>} Response with updated user data
   */
  async updatePassword(passwordData) {
    try {
      const response = await apiService.put('/api/auth/password', passwordData);
      return {
        success: true,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating password:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update password'
      };
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} Response with user data
   */
  async getProfile() {
    try {
      const response = await apiService.get('/api/auth/me');
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  }

  /**
   * Update user preferences (theme, language, etc.)
   * @param {Object} preferences - Object containing preferences to update
   * @returns {Promise<Object>} Response with updated user data
   */
  async updatePreferences(preferences) {
    try {
      const response = await apiService.put('/api/auth/preferences', { preferences });
      return {
        success: true,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update preferences'
      };
    }
  }
}

export default new UserService(); 