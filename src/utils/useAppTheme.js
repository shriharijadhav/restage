import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPreferences } from '../features/preferencesSlice';
import { updatePreferences } from '../features/userSlice';
import userService from '../services/userService';
import { SUCCESS, ERRORS } from '../constants/strings';
import { useSnackbar } from '../contexts/SnackbarContext';

export default function useAppTheme() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.preferences.theme);
  const user = useSelector((state) => state.user.user);
  const { showSuccess, showError } = useSnackbar();

  // Sync user preferences with local preferences slice
  useEffect(() => {
    if (user?.preferences) {
      dispatch(setPreferences({
        theme: user.preferences.theme || 'dark',
        language: user.preferences.language || 'en'
      }));
    }
  }, [user, dispatch]);

  // Function to change theme with immediate UI update and background API call
  const changeTheme = async (newTheme, showNotification = false) => {
    // Immediately update UI
    dispatch(setPreferences({ theme: newTheme }));
    
    // Make background API call
    if (user) {
      try {
        const result = await userService.updatePreferences({ theme: newTheme });
        if (result.success) {
          // Update user state with new preferences
          dispatch(updatePreferences(result.user.preferences));
          
          // Show success notification if requested
          if (showNotification) {
            showSuccess(SUCCESS.THEME_UPDATED);
          }
        } else {
          console.error('Failed to save theme preference:', result.error);
          
          // Show error notification if requested
          if (showNotification) {
            showError(ERRORS.THEME_UPDATE_FAILED);
          }
        }
      } catch (error) {
        console.error('Error saving theme preference:', error);
        
        // Show error notification if requested
        if (showNotification) {
          showError(ERRORS.THEME_UPDATE_FAILED);
        }
      }
    }
  };

  // Apply theme to document
  useEffect(() => {
    let mql;
    const applyTheme = (t) => {
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mql.matches ? 'dark' : 'light');
      const listener = (e) => applyTheme(e.matches ? 'dark' : 'light');
      mql.addEventListener('change', listener);
      return () => mql.removeEventListener('change', listener);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  return { theme, changeTheme };
} 