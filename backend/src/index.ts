// backend/src/index.ts

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import campaignRoutes from './routes/campaign.routes';
import landingPageRoutes from './routes/landing-page.routes';
import emailTemplateRoutes from './routes/email-template.routes';
import groupRoutes from './routes/group.routes';
import sendingProfileRoutes from './routes/sending-profile.routes';
import statsRoutes from './routes/stats.routes';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/landing-pages', landingPageRoutes);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/sending-profiles', sendingProfileRoutes);
app.use('/api/stats', statsRoutes);

// MongoDB připojení
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server běží na portu ${port}`);
  });
});