// backend/src/controllers/group.controller.ts

import { Request, Response } from 'express';
import { Group } from '../models/group.model';

export const groupController = {
  async getAll(req: Request, res: Response) {
    try {
      const groups = await Group.find();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při načítání skupin' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const group = await Group.findById(req.params.id);
      if (!group) {
        return res.status(404).json({ error: 'Skupina nenalezena' });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při načítání skupiny' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const group = new Group(req.body);
      await group.save();
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ error: 'Chyba při vytváření skupiny' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const group = await Group.findByIdAndUpdate(
        req.params.id, 
        { ...req.body, lastModified: new Date() },
        { new: true }
      );
      if (!group) {
        return res.status(404).json({ error: 'Skupina nenalezena' });
      }
      res.json(group);
    } catch (error) {
      res.status(400).json({ error: 'Chyba při aktualizaci skupiny' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const group = await Group.findByIdAndDelete(req.params.id);
      if (!group) {
        return res.status(404).json({ error: 'Skupina nenalezena' });
      }
      res.json({ message: 'Skupina byla úspěšně smazána' });
    } catch (error) {
      res.status(500).json({ error: 'Chyba při mazání skupiny' });
    }
  }
};