// src/App.tsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import EmailTemplates from './pages/EmailTemplates.tsx';
import SendingProfiles from './pages/SendingProfiles.tsx';
import Groups from './pages/Groups.tsx';
import Campaigns from './pages/Campaigns.tsx';
import NewCampaign from './pages/NewCampaign.tsx';
import CampaignDetail from './pages/CampaignDetail.tsx';
import LandingPages from './pages/LandingPages.tsx';
import LandingPageEditor from './pages/LandingPageEditor.tsx';

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