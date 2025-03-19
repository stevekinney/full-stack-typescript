import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const getInitialTheme = (): boolean => {
  const savedTheme = localStorage.getItem('dark-mode');
  if (savedTheme !== null) return savedTheme === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme());

  // Update document classes when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save preference to localStorage
    localStorage.setItem('dark-mode', String(isDarkMode));
  }, [isDarkMode]);

  // Toggle between light and dark mode
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {isDarkMode && (
        <div className="sr-only" aria-live="polite">
          Dark mode enabled
        </div>
      )}

      {!isDarkMode && (
        <div className="sr-only" aria-live="polite">
          Light mode enabled
        </div>
      )}
      {children}
    </ThemeContext.Provider>
  );
};
