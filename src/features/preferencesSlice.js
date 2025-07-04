import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'dark', // Default to dark theme
  language: 'en',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setPreferences(state, action) {
      if (action.payload.theme !== undefined) {
        state.theme = action.payload.theme;
      }
      if (action.payload.language !== undefined) {
        state.language = action.payload.language;
      }
    },
  },
});

export const { setTheme, setLanguage, setPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer; 