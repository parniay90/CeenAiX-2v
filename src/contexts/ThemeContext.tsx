import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAutoMode: boolean;
  setAutoMode: (auto: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const isDarkTime = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isAutoMode, setIsAutoMode] = useState(() => {
    const saved = localStorage.getItem('themeAutoMode');
    return saved ? JSON.parse(saved) : true;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null && !isAutoMode) {
      return JSON.parse(saved);
    }
    return isDarkTime();
  });

  useEffect(() => {
    if (isAutoMode) {
      const updateTheme = () => {
        setIsDarkMode(isDarkTime());
      };

      updateTheme();

      const interval = setInterval(updateTheme, 60000);

      return () => clearInterval(interval);
    }
  }, [isAutoMode]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('themeAutoMode', JSON.stringify(isAutoMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, isAutoMode]);

  const toggleDarkMode = () => {
    if (isAutoMode) {
      setIsAutoMode(false);
    }
    setIsDarkMode((prev: boolean) => !prev);
  };

  const setAutoMode = (auto: boolean) => {
    setIsAutoMode(auto);
    if (auto) {
      setIsDarkMode(isDarkTime());
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, isAutoMode, setAutoMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
