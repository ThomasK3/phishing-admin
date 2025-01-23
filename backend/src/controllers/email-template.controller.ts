import { Request, Response } from 'express';
import { EmailTemplate } from '../models/email-template';

export const emailTemplateController = {
  async getAll(req: Request, res: Response) {
    try {
      const templates = await EmailTemplate.find();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při načítání šablon' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const template = new EmailTemplate(req.body);
      await template.save();
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: 'Chyba při vytváření šablony' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const template = await EmailTemplate.findById(req.params.id);
      if (!template) {
        return res.status(404).json({ error: 'Šablona nenalezena' });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při načítání šablony' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const template = await EmailTemplate.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!template) {
        return res.status(404).json({ error: 'Šablona nenalezena' });
      }
      res.json(template);
    } catch (error) {
      res.status(400).json({ error: 'Chyba při aktualizaci šablony' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const template = await EmailTemplate.findByIdAndDelete(req.params.id);
      if (!template) {
        return res.status(404).json({ error: 'Šablona nenalezena' });
      }
      res.json({ message: 'Šablona byla úspěšně smazána' });
    } catch (error) {
      res.status(500).json({ error: 'Chyba při mazání šablony' });
    }
  }
};