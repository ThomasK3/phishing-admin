import { Request, Response } from 'express';
import { Campaign } from '../models/campaign.model';

export const campaignController = {
  // Získat všechny kampaně
  async getAll(req: Request, res: Response) {
    try {
      const campaigns = await Campaign.find()
        .populate('emailTemplateId')
        .populate('landingPageId')
        .populate('targetGroups');
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při načítání kampaní' });
    }
  },

  // Vytvořit novou kampaň
  async create(req: Request, res: Response) {
    try {
      const campaign = new Campaign(req.body);
      await campaign.save();
      res.status(201).json(campaign);
    } catch (error) {
      res.status(400).json({ error: 'Chyba při vytváření kampaně' });
    }
  }
};