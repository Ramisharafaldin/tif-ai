import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Layout } from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import ForecastingPage from './pages/ForecastingPage';
import TransfersPage from './pages/TransfersPage';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <nav className="app-nav">
          <ul>
            <li><NavLink to="/" end className="nav-link">Dashboard</NavLink></li>
            <li><NavLink to="/inventory" end className="nav-link">Inventory</NavLink></li>
            <li><NavLink to="/forecasting" end className="nav-link">Forecasting</NavLink></li>
            <li><NavLink to="/transfers" end className="nav-link">Transfers</NavLink></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/forecasting" element={<ForecastingPage />} />
          <Route path="/transfers" element={<TransfersPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

