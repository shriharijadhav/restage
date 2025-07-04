import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function useAppTheme() {
  const theme = useSelector((state) => state.preferences.theme);

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
} 