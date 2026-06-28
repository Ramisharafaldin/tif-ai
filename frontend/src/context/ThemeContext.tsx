import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  rtl: boolean;
  toggleRTL: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [rtl, setRtl] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleRTL = () => setRtl(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, rtl, toggleRTL }}>
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
