// src/controllers/landing-page.controller.ts
import { Request, Response } from 'express';
import { LandingPage } from '../models/landing-page.model';

export const landingPageController = {
  async getAll(req: Request, res: Response) {
    try {
      const pages = await LandingPage.find();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při načítání stránek' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const page = new LandingPage(req.body);
      await page.save();
      res.status(201).json(page);
    } catch (error) {
      res.status(400).json({ error: 'Chyba při vytváření stránky' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const page = await LandingPage.findById(req.params.id);
      if (!page) {
        return res.status(404).json({ error: 'Stránka nenalezena' });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při načítání stránky' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const page = await LandingPage.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!page) {
        return res.status(404).json({ error: 'Stránka nenalezena' });
      }
      res.json(page);
    } catch (error) {
      res.status(400).json({ error: 'Chyba při aktualizaci stránky' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const page = await LandingPage.findByIdAndDelete(req.params.id);
      if (!page) {
        return res.status(404).json({ error: 'Stránka nenalezena' });
      }
      res.json({ message: 'Stránka byla úspěšně smazána' });
    } catch (error) {
      res.status(500).json({ error: 'Chyba při mazání stránky' });
    }
  },

  async incrementVisits(req: Request, res: Response) {
    try {
      const page = await LandingPage.findByIdAndUpdate(
        req.params.id,
        { $inc: { visits: 1 } },
        { new: true }
      );
      if (!page) {
        return res.status(404).json({ error: 'Stránka nenalezena' });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při aktualizaci návštěv' });
    }
  },

  async incrementSubmissions(req: Request, res: Response) {
    try {
      const page = await LandingPage.findByIdAndUpdate(
        req.params.id,
        { $inc: { submissions: 1 } },
        { new: true }
      );
      if (!page) {
        return res.status(404).json({ error: 'Stránka nenalezena' });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při aktualizaci odeslání' });
    }
  }
};