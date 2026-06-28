import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './../theme/theme.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode, toggleDarkMode, rtl, toggleRTL } = useTheme();

  return (
    <div className="app" data-theme={darkMode ? "dark" : "light"} dir={rtl ? "rtl" : "ltr"}>
      <header className="app-header">
        <h1>TIF-AI Dashboard</h1>
        <div className="controls">
          <button onClick={toggleDarkMode}>
            Switch to {darkMode ? "Light" : "Dark"} Mode
          </button>
          <button onClick={toggleRTL}>
            Switch to {rtl ? "LTR" : "RTL"}
          </button>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};
