// backend/src/services/brevo.service.ts

import * as SibApi from '@sendinblue/client';
import dotenv from 'dotenv';
import { EmailTemplate } from '../models/email-template';

dotenv.config();

const apiInstance = new SibApi.EmailCampaignsApi();
const contactsApi = new SibApi.ContactsApi();  // Instance pro práci s kontakty
const transactionalApi = new SibApi.TransactionalEmailsApi();

// Nastavení API klíčů
apiInstance.setApiKey(SibApi.EmailCampaignsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');
contactsApi.setApiKey(SibApi.ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');
transactionalApi.setApiKey(SibApi.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

interface CampaignResponse {
  success: boolean;
  campaignId?: string | number;
  message: string;
  details?: any;
}

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
  },

// backend/src/services/brevo.service.ts

// backend/src/services/brevo.service.ts

async createCampaign(campaignData: {
  name: string;
  subject?: string;
  content?: string;
  isHTML?: boolean;
  launchDate?: string;
}): Promise<CampaignResponse> {
  try {
    // 1. Create contact list
    console.log('Creating contact list...');
    const createList = new SibApi.CreateList();
    createList.name = `List-${campaignData.name}-${Date.now()}`;
    createList.folderId = 1;

    const newList = await contactsApi.createList(createList);
    console.log('Created list with response:', newList.body);

    // 2. Create campaign
    console.log('Creating email campaign...');
    const emailCampaign = new SibApi.CreateEmailCampaign();
    
    emailCampaign.name = campaignData.name;
    emailCampaign.subject = campaignData.subject || campaignData.name;
    
    emailCampaign.sender = {
      name: "Phishing Campaign", 
      email: "pslibedu@pslib-edu.cz"
    };
    
    emailCampaign.htmlContent = campaignData.content ? 
      (campaignData.isHTML ? campaignData.content : `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body>
            <pre>${campaignData.content}</pre>
          </body>
        </html>
      `) : '<p>No content provided</p>';
    
    emailCampaign.recipients = {
      listIds: [newList.body.id]
    };

    if (campaignData.launchDate) {
      emailCampaign.scheduledAt = new Date(campaignData.launchDate).toISOString();
    }

    console.log('Final campaign data:', JSON.stringify(emailCampaign, null, 2));
    
    const response = await apiInstance.createEmailCampaign(emailCampaign);
    console.log('Campaign created successfully:', response.body);
    
    return {
      success: true,
      campaignId: response.body.id,
      message: 'Campaign created successfully',
      details: {
        name: campaignData.name,
        listId: newList.body.id,
        scheduledAt: emailCampaign.scheduledAt
      }
    };

  } catch (err: any) {
    console.error('Error creating campaign:', err);
    
    const errorMessage = err.response?.body?.message || 'Failed to create campaign';
    const errorDetails = err.response?.body || err;
    
    // Vrátíme strukturovanou chybovou odpověď
    throw {
      success: false,
      message: errorMessage,
      details: errorDetails
    };
  }
}

};