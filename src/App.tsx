// src/App.tsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import EmailTemplates from './pages/EmailTemplates.tsx';
import SendingProfiles from './pages/SendingProfiles.tsx';
import Groups from './pages/Groups.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
        <Route path="/sending-profiles" element={<SendingProfiles />} />
        <Route path="/groups/*" element={<Groups />} />
      </Routes>
    </Router>
  );
};

export default App;