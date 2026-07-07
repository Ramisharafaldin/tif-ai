import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary, ToastProvider } from './components/ui';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import ForecastingPage from './pages/ForecastingPage';
import TransfersPage from './pages/TransfersPage';
import SettingsPage from './pages/SettingsPage';
import AiChatPage from './pages/AiChatPage';
import SafetyStockPage from './pages/SafetyStockPage';
import AbcXyzFsnPage from './pages/AbcXyzFsnPage';
import UploadPage from './pages/UploadPage';
import './pages/Pages.css';
import './App.css';

function App() {
  return (
    <Router>
      <ToastProvider>
      <Layout>
        <ErrorBoundary>
        <nav className="app-nav">
          <ul>
            <li><NavLink to="/" end className="nav-link">Dashboard</NavLink></li>
            <li><NavLink to="/inventory" end className="nav-link">Inventory</NavLink></li>
            <li><NavLink to="/forecasting" end className="nav-link">Forecasting</NavLink></li>
            <li><NavLink to="/transfers" end className="nav-link">Transfers</NavLink></li>
            <li><NavLink to="/analytics/safety-stock" end className="nav-link">Safety Stock</NavLink></li>
            <li><NavLink to="/analytics/abc-xyz-fsn" end className="nav-link">ABC/XYZ/FSN</NavLink></li>
            <li><NavLink to="/upload" end className="nav-link">Upload</NavLink></li>
            <li><NavLink to="/ai-chat" end className="nav-link">AI Chat</NavLink></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/forecasting" element={<ForecastingPage />} />
          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/analytics/safety-stock" element={<SafetyStockPage />} />
          <Route path="/analytics/abc-xyz-fsn" element={<AbcXyzFsnPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/ai-chat" element={<AiChatPage />} />
        </Routes>
        </ErrorBoundary>
      </Layout>
      </ToastProvider>
    </Router>
  );
}

export default App;
