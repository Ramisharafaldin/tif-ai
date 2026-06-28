import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Direction = 'ltr' | 'rtl';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  direction: Direction;
  toggleDirection: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = window.localStorage.getItem('theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });
  const [direction, setDirection] = useState<Direction>(() => {
    const saved = window.localStorage.getItem('direction');
    return (saved === 'rtl' || saved === 'ltr') ? saved : 'ltr';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', direction);
    window.localStorage.setItem('theme', theme);
    window.localStorage.setItem('direction', direction);
  }, [theme, direction]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleDirection = () => {
    setDirection(prev => (prev === 'ltr' ? 'rtl' : 'ltr'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, direction, toggleDirection }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
