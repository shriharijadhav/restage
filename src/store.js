import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from './features/preferencesSlice';
import userReducer from './features/userSlice';
import projectReducer from './features/projectSlice';
import settingsReducer from './features/settingsSlice';

const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    user: userReducer,
    project: projectReducer,
    settings: settingsReducer,
  },
});

export default store; 