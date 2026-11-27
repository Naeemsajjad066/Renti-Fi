import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    updateDocumentClass(savedTheme);
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateDocumentClass = useCallback((theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    updateDocumentClass(newTheme);
  }, [theme, updateDocumentClass]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isInitialized,
    }),
    [theme, toggleTheme, isInitialized]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
