// backend/src/controllers/campaign.controller.ts
import { Request, Response } from 'express';
import { Campaign } from '../models/campaign.model';
import { EmailTemplate } from '../models/email-template';
import { SendingProfile } from '../models/sending-profile.model';
import { Group } from '../models/group.model';
import { brevoService } from '../services/brevo.service';
import mongoose from 'mongoose';

export const campaignController = {
  // Získat všechny kampaně
  getAll: async (req: Request, res: Response) => {
    try {
      const campaigns = await Campaign.find()
        .populate('emailTemplateId')
        .populate('landingPageId')
        .populate('targetGroups');
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: 'Error loading campaigns' });
    }
  },

  // Získat kampaň podle ID
  getById: async (req: Request, res: Response) => {
    try {
      const campaign = await Campaign.findById(req.params.id)
        .populate('emailTemplateId')
        .populate('landingPageId')
        .populate('targetGroups');

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: 'Error loading campaign' });
    }
  },

  // Vytvořit novou kampaň
  create: async (req: Request, res: Response) => {
    let campaignId: string | null = null;
    try {
      // Načtení šablony emailu
      const emailTemplate = await EmailTemplate.findById(req.body.emailTemplateId);
      if (!emailTemplate) {
        return res.status(400).json({ error: 'Email template not found' });
      }

      // Načtení sending profile
      const sendingProfile = await SendingProfile.findById(req.body.sendingProfileId);
      if (!sendingProfile) {
        return res.status(400).json({ error: 'Sending profile not found' });
      }

      // Kontrola cílových skupin
      const targetGroups = await Group.find({
        _id: { $in: req.body.targetGroups }
      }).populate('contacts');
      
      // Agregace všech kontaktů ze skupin
      const allContacts = targetGroups.flatMap(group => group.contacts || []);
      
      console.log('Detailed contact info:', allContacts.map(contact => ({
        email: contact.email,
        id: contact.id,
        active: contact.active
      })));
      
      // Filtrování aktivních kontaktů
      const activeContacts = allContacts.filter(contact => contact.active);
      
      if (activeContacts.length === 0) {
        return res.status(400).json({ 
          error: 'Nebyly nalezeny žádné aktivní kontakty ve vybraných skupinách',
          details: {
            selectedGroups: req.body.targetGroups,
            foundGroups: targetGroups.length,
            totalContacts: allContacts.length
          }
        });
      }
      
      // Příprava dat pro Brevo - použijte emailové adresy aktivních kontaktů
      const contactEmails = activeContacts.map(contact => contact.email);

      console.log('Target Groups:', targetGroups);
      console.log('Contacts in Groups:', allContacts.map(contact => contact.email));

      // Příprava dat pro kampaň
      const campaignData = {
        name: req.body.name,
        emailTemplateId: req.body.emailTemplateId,
        sendingProfileId: req.body.sendingProfileId,
        targetGroups: req.body.targetGroups.map((id: string) => new mongoose.Types.ObjectId(id)),
        launchDate: req.body.launchDate ? new Date(req.body.launchDate) : new Date(),
        sendUntil: req.body.sendUntil ? new Date(req.body.sendUntil) : new Date(),
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Vytvoření kampaně v MongoDB
      const campaign = new Campaign(campaignData);
      await campaign.save();
      campaignId = campaign._id.toString();

      // Pokus o vytvoření kampaně v Brevo
      const brevoCampaign = await brevoService.createCampaign({
        name: campaign.name,
        emailTemplateId: campaign.emailTemplateId?.toString() || '',
        sendingProfileId: req.body.sendingProfileId,
        targetGroups: campaign.targetGroups.map(id => id.toString()),
        launchDate: campaign.launchDate?.toISOString() || new Date().toISOString(),
        sendUntil: campaign.sendUntil?.toISOString() || new Date().toISOString(),
        htmlContent: emailTemplate.content,
        contacts: contactEmails  // Přidáme emailové adresy, které jsme už získali výše
      });

      // Kontrola odpovědi z Brevo
      if (brevoCampaign.success && brevoCampaign.campaignId) {
        // Aktualizace Brevo ID v MongoDB
        const updatedCampaign = await Campaign.findByIdAndUpdate(
          campaignId, 
          { 
            brevoId: brevoCampaign.campaignId.toString(), 
            status: 'scheduled' 
          },
          { new: true }
        ).populate('emailTemplateId')
         .populate('landingPageId')
         .populate('targetGroups');

        res.status(201).json(updatedCampaign);
      } else {
        // Smazání kampaně, pokud selhalo vytvoření v Brevo
        await Campaign.findByIdAndDelete(campaignId);
        
        res.status(400).json({ 
          error: 'Nepodařilo se vytvořit kampaň v Brevo',
          details: brevoCampaign.details
        });
      }

    } catch (error: any) {
      // Smazání kampaně v případě chyby
      if (campaignId) {
        try {
          await Campaign.findByIdAndDelete(campaignId);
        } catch (deleteError) {
          console.error('Chyba při mazání kampaně:', deleteError);
        }
      }

      // Podrobné logování chyby
      console.error('Detailní chyba vytváření kampaně:', error);

      res.status(400).json({ 
        error: 'Nepodařilo se vytvořit kampaň', 
        message: error.message,
        details: error.details || {}
      });
    }
  },
  

  // Aktualizovat kampaň
  update: async (req: Request, res: Response) => {
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate('emailTemplateId')
       .populate('landingPageId')
       .populate('targetGroups');

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      res.json(campaign);
    } catch (error) {
      res.status(400).json({ error: 'Error updating campaign' });
    }
  },

  // Smazat kampaň
  delete: async (req: Request, res: Response) => {
    try {
      const campaign = await Campaign.findByIdAndDelete(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting campaign' });
    }
  }
};