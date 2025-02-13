// backend/src/services/brevo.service.ts

import * as SibApi from '@sendinblue/client';
import dotenv from 'dotenv';
import { EmailTemplate } from '../models/email-template';
import { SendingProfile } from '../models/sending-profile.model';
import { Group } from '../models/group.model';

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

async createCampaign(campaignData: {
  name: string;
  emailTemplateId: string;
  sendingProfileId: string;
  targetGroups: string[];
  launchDate: string;
  sendUntil: string;
  contacts: string[];
  htmlContent?: string;
}): Promise<CampaignResponse> {
  try {
    // 1. Create contact list
    console.log('Creating contact list...');
    const createList = new SibApi.CreateList();
    createList.name = `List-${campaignData.name}-${Date.now()}`;
    createList.folderId = 1;

    const newList = await contactsApi.createList(createList);
    console.log('Created list with response:', newList.body);

    // 2. Add contacts to the list
    if (campaignData.contacts && campaignData.contacts.length > 0) {
      try {
        // Nejdřív získáme existující kontakty
        const existingContacts = await contactsApi.getContacts();
        
        for (const email of campaignData.contacts) {
          try {
            // Pro každý email buď aktualizujeme listIds nebo vytvoříme nový kontakt
            const contactInfo = {
              email: email,
              listIds: [newList.body.id]
            };
    
            try {
              // Pokusíme se updatovat existující kontakt
              await contactsApi.updateContact(email, {
                listIds: [newList.body.id]
              });
            } catch (updateError) {
              // Pokud kontakt neexistuje, vytvoříme nový
              await contactsApi.createContact(contactInfo);
            }
          } catch (error) {
            console.error(`Error processing contact ${email}:`, error);
          }
        }
        console.log(`Processed ${campaignData.contacts.length} contacts`);
      } catch (contactError) {
        console.error('Error managing contacts:', contactError);
        throw new Error('Failed to manage contacts');
      }
    } else {
      throw new Error('No contacts provided');
    }

    // 3. Create email campaign
    console.log('Creating email campaign...');
    const emailCampaign = new SibApi.CreateEmailCampaign();
    
    emailCampaign.name = campaignData.name;
    
    // Načtení šablony emailu
    const emailTemplate = await EmailTemplate.findById(campaignData.emailTemplateId);
    if (!emailTemplate) {
      throw new Error('Email template not found');
    }
    
    emailCampaign.subject = emailTemplate.subject;
    
    // Načtení sending profile
    const sendingProfile = await SendingProfile.findById(campaignData.sendingProfileId);
    if (!sendingProfile) {
      throw new Error('Sending profile not found');
    }

    emailCampaign.sender = {
      name: sendingProfile.profileName, 
      email: sendingProfile.smtpFrom
    };
    
    // Nastavení HTML obsahu
    emailCampaign.htmlContent = emailTemplate.content || '<p>No content provided</p>';
    
    // Nastavení příjemců
    emailCampaign.recipients = {
      listIds: [newList.body.id]
    };

    // Nastavení data spuštění
    if (campaignData.launchDate) {
      emailCampaign.scheduledAt = new Date(campaignData.launchDate).toISOString();
    }

    console.log('Final campaign data:', JSON.stringify(emailCampaign, null, 2));
    
    // Vytvoření kampaně
    const response = await apiInstance.createEmailCampaign(emailCampaign);
    console.log('Campaign created successfully:', response.body);
    
    return {
      success: true,
      campaignId: response.body.id,
      message: 'Campaign created successfully',
      details: {
        name: campaignData.name,
        listId: newList.body.id,
        scheduledAt: emailCampaign.scheduledAt,
        contactCount: campaignData.contacts.length
      }
    };

  } catch (err: any) {
    console.error('Detailed Brevo error:', {
      statusCode: err.response?.statusCode,
      body: err.response?.body,
      message: err.message
    });
    
    return {
      success: false,
      message: err.response?.body?.message || 'Failed to create campaign',
      details: err.response?.body || err
    };
  }
}

};