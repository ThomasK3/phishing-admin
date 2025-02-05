// src/controllers/campaign.controller.ts
import { Request, Response } from 'express';
import { Campaign } from '../models/campaign.model';

export const campaignController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const campaigns = await Campaign.find();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: 'Error loading campaigns' });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const campaign = await Campaign.findById(req.params.id);
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: 'Error loading campaign' });
    }
  },


  create: async (req: Request, res: Response) => {
    try {
      const campaign = new Campaign(req.body);
      await campaign.save();
      res.status(201).json({ 
        message: 'Kampaň byla úspěšně vytvořena',
        campaign 
      });
    } catch (error) {
      res.status(400).json({ error: 'Chyba při vytváření kampaně' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!campaign) {
        return res.status(404).json({ error: 'Kampaň nenalezena' });
      }
      res.json({ 
        message: 'Kampaň byla úspěšně aktualizována',
        campaign 
      });
    } catch (error) {
      res.status(400).json({ error: 'Chyba při aktualizaci kampaně' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const campaign = await Campaign.findByIdAndDelete(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: 'Kampaň nenalezena' });
      }
      res.json({ message: 'Kampaň byla úspěšně smazána' });
    } catch (error) {
      res.status(500).json({ error: 'Chyba při mazání kampaně' });
    }
  }
};