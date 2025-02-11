// backend/src/controllers/campaign.controller.ts
import { Request, Response } from 'express';
import { Campaign } from '../models/campaign.model';
import { brevoService } from '../services/brevo.service';

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
    try {
      // Vytvoření kampaně v MongoDB
      const campaign = new Campaign(req.body);
      await campaign.save();

      // Pokus o vytvoření kampaně v Brevo
      try {
        const brevoCampaign = await brevoService.createCampaign({
          ...req.body,
          id: campaign._id.toString()
        });
        
        // Uložení Brevo ID jako string
        const brevoIdString = brevoCampaign.id.toString();
        await Campaign.findByIdAndUpdate(campaign._id, { brevoId: brevoIdString });
      } catch (brevoError) {
        console.error('Error creating Brevo campaign:', brevoError);
        // Pokračujeme i při selhání Brevo integrace
      }

      const populatedCampaign = await Campaign.findById(campaign._id)
        .populate('emailTemplateId')
        .populate('landingPageId')
        .populate('targetGroups');

      res.status(201).json(populatedCampaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(400).json({ error: 'Error creating campaign' });
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