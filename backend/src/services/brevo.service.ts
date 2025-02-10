// backend/src/services/brevo.service.ts

import * as SibApi from '@sendinblue/client';
import dotenv from 'dotenv';

dotenv.config();

const apiInstance = new SibApi.EmailCampaignsApi();
const transactionalApi = new SibApi.TransactionalEmailsApi();

apiInstance.setApiKey(SibApi.EmailCampaignsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');
transactionalApi.setApiKey(SibApi.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

export const brevoService = {
  async getCampaigns() {
    try {
      const data = await apiInstance.getEmailCampaigns();
      return data.body;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  async getDashboardStats() {
    try {
      const limit = 100;
      const data = await transactionalApi.getEmailEventReport(limit);
      const events = data.body.events || [];

      // Use string comparison after converting to string
      const totalDelivered = events.filter(e => String(e.event) === 'delivered').length;
      const totalOpened = events.filter(e => String(e.event) === 'opened').length;
      const totalClicked = events.filter(e => String(e.event) === 'clicked').length;

      return {
        totalDelivered,
        openRate: totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0,
        clickRate: totalDelivered > 0 ? Math.round((totalClicked / totalDelivered) * 100) : 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async getEmailEvents() {
    try {
      const limit = 100;  
      const data = await transactionalApi.getEmailEventReport(limit);
      console.log('Email events:', data.body);
      return data.body;
    } catch (error) {
      console.error('Error fetching email events:', error);
      throw error;
    }
  }
};