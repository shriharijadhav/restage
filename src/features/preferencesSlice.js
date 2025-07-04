import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const stored = localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
};

const getInitialLanguage = () => {
  const stored = localStorage.getItem('language');
  return stored || 'en';
};

const initialState = {
  theme: getInitialTheme(),
  language: getInitialLanguage(),
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setLanguage(state, action) {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
  },
});

export const { setTheme, setLanguage } = preferencesSlice.actions;
export default preferencesSlice.reducer; 