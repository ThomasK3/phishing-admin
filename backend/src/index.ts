import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import campaignRoutes from './routes/campaign.routes';
import landingPageRoutes from './routes/landing-page.routes';
import emailTemplateRoutes from './routes/email-template.routes';
import groupRoutes from './routes/group.routes';
import sendingProfileRoutes from './routes/sending-profile.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/campaigns', campaignRoutes);
app.use('/api/landing-pages', landingPageRoutes);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/sending-profiles', sendingProfileRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server běží na portu ${port}`);
  });
});