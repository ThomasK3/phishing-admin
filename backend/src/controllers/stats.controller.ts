// backend/src/controllers/stats.controller.ts

import { Request, Response } from 'express';
import { brevoService } from '../services/brevo.service';

export const statsController = {
    async getDashboardStats(req: Request, res: Response) {
      try {
        console.log('Backend: Fetching dashboard stats');
        const stats = await brevoService.getDashboardStats();
        console.log('Backend: Retrieved stats:', stats);
        res.json(stats);
      } catch (error) {
        console.error('Backend Error:', error);
        res.status(500).json({ error: 'Error fetching stats' });
      }
    },
    async getEmailEvents(req: Request, res: Response) {
        try {
          console.log('Backend: Fetching email events');
          const events = await brevoService.getEmailEvents();
          console.log('Backend: Retrieved events:', events);
          res.json(events);
        } catch (error) {
          console.error('Backend Error:', error);
          res.status(500).json({ error: 'Error fetching email events' });
        }
      }
  };