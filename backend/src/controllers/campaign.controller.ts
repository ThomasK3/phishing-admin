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
      res.status(201).json(campaign);
    } catch (error) {
      res.status(400).json({ error: 'Error creating campaign' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ error: 'Error updating campaign' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await Campaign.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting campaign' });
    }
  }
};