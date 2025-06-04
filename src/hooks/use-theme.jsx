import { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Always use light theme as default
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Remove dark class to ensure light mode
    document.documentElement.classList.remove('dark');
    
    setIsInitialized(true);
  }, []);

  const toggleTheme = () => {
    // Since we want to stay in light mode, we'll just keep it as 'light'
    setTheme('light');
    localStorage.setItem('theme', 'light');
    
    // Ensure dark mode is off
    document.documentElement.classList.remove('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
