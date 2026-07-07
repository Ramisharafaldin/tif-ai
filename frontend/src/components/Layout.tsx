import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { NavLink } from 'react-router-dom';
import './../theme/theme.css';
import './layout/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme, toggleLanguage } = useTheme();

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('layout.title')}</h1>
        <div className="controls">
          <button onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'} {theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
          </button>
          <button onClick={toggleLanguage}>
            {t('common.language')}
          </button>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <NavLink to="/settings" className="settings-fab" title={t('nav.settings')}>
        ⚙️
      </NavLink>
    </div>
  );
};