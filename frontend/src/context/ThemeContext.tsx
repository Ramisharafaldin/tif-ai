import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type Theme = 'light' | 'dark';
type Direction = 'ltr' | 'rtl';
type Lang = 'en' | 'ar';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  direction: Direction;
  toggleDirection: () => void;
  lang: Lang;
  toggleLanguage: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = window.localStorage.getItem('theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });
  const [direction, setDirection] = useState<Direction>(() => {
    const saved = window.localStorage.getItem('direction');
    return (saved === 'rtl' || saved === 'ltr') ? saved : 'ltr';
  });
  const [lang, setLang] = useState<Lang>(() => {
    const saved = window.localStorage.getItem('i18nextLng');
    if (saved === 'ar' || saved === 'en') return saved;
    return 'en';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', direction);
    window.localStorage.setItem('theme', theme);
    window.localStorage.setItem('direction', direction);
  }, [theme, direction]);

  useEffect(() => {
    i18n.changeLanguage(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
  }, [lang, i18n]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleDirection = useCallback(() => {
    setDirection(prev => (prev === 'ltr' ? 'rtl' : 'ltr'));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, direction, toggleDirection, lang, toggleLanguage }}>
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
