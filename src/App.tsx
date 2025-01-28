// src/App.tsx
// src/App.tsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EmailTemplates from './pages/EmailTemplates';
import SendingProfiles from './pages/SendingProfiles';
import Groups from './pages/Groups';
import Campaigns from './pages/Campaigns';
import NewCampaign from './pages/NewCampaign';
import CampaignDetail from './pages/CampaignDetail';
import LandingPages from './pages/LandingPages';
import LandingPageEditor from './pages/LandingPageEditor';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
        <Route path="/sending-profiles" element={<SendingProfiles />} />
        <Route path="/groups/*" element={<Groups />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/new" element={<NewCampaign />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/landing-pages" element={<LandingPages />} />
        <Route path="/landing-pages/new" element={<LandingPageEditor />} />
        <Route path="/landing-pages/:id" element={<LandingPageEditor />} />
      </Routes>
    </Router>
  );
};

export default App;