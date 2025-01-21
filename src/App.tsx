// src/App.tsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';  // Změna zde
import Dashboard from './pages/Dashboard.tsx';
import EmailTemplates from './pages/EmailTemplates.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
      </Routes>
    </Router>
  );
};

export default App;