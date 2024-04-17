import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Calendar from './components/calendario/Calendar';  
import RegisterPage from './components/RegisterPage';
import Perfil from './components/Perfil';

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  </Router>
);

export default AppRouter;
