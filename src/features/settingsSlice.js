import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Tech Corp',
    role: 'API Developer',
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
  },
  notifications: {
    email: true,
    push: false,
    weekly: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateProfile(state, action) {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateSecurity(state, action) {
      state.security = { ...state.security, ...action.payload };
    },
    updateNotifications(state, action) {
      state.notifications = { ...state.notifications, ...action.payload };
    },
  },
});

export const { updateProfile, updateSecurity, updateNotifications } = settingsSlice.actions;
export default settingsSlice.reducer; 