// src/controllers/sending-profile.controller.ts
import { Request, Response } from 'express';
import { SendingProfile } from '../models/sending-profile.model';
import nodemailer from 'nodemailer';
import { emailApi } from '../config/brevo';


export const sendingProfileController = {
  async getAll(req: Request, res: Response) {
    try {
      const profiles = await SendingProfile.find();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při načítání profilů' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const profile = new SendingProfile(req.body);
      await profile.save();
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ error: 'Chyba při vytváření profilu' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const profile = await SendingProfile.findById(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profil nenalezen' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Chyba při načítání profilu' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const profile = await SendingProfile.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!profile) {
        return res.status(404).json({ error: 'Profil nenalezen' });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: 'Chyba při aktualizaci profilu' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const profile = await SendingProfile.findByIdAndDelete(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profil nenalezen' });
      }
      res.json({ message: 'Profil byl úspěšně smazán' });
    } catch (error) {
      res.status(500).json({ error: 'Chyba při mazání profilu' });
    }
  },

  async testConnection(req: Request, res: Response) {
    try {
      const profile = await SendingProfile.findById(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profil nenalezen' });
      }
  
      console.log('Testing SMTP connection with config:', {
        host: profile.host,
        port: profile.port,
        auth: {
          user: profile.username,
          // heslo vynecháme z logu
        }
      });
  
      const transporter = nodemailer.createTransport({
        host: profile.host,
        port: profile.port,
        secure: false,
        auth: {
          user: profile.username,
          pass: profile.password
        },
        debug: true, // přidáno pro debugging
        logger: true  // přidáno pro debugging
      });
  
      await transporter.verify();
      res.json({ success: true, message: 'SMTP připojení je funkční' });
    } catch (error) {
      console.error('SMTP Error:', error);
      res.status(400).json({ 
        success: false, 
        error: 'Chyba SMTP připojení',
        details: error instanceof Error ? error.message : 'Neznámá chyba'
      });
    }
  },
  
  async testEmail(req: Request, res: Response) {
    try {
      const { testEmailTo } = req.body;
      const profile = await SendingProfile.findById(req.params.id);
      
      if (!profile) {
        return res.status(404).json({ error: 'Profil nenalezen' });
      }
  
      const sendSmtpEmail = {
        sender: { 
          name: profile.profileName, // jméno odesílatele
          email: profile.smtpFrom   // email odesílatele
        },
        to: [{ email: testEmailTo }],
        subject: 'Test konfigurace',
        htmlContent: '<b>Toto je testovací email pro ověření funkčnosti.</b>',
        headers: Object.fromEntries(profile.headers.map(h => [h.key, h.value]))
      };
  
      const result = await emailApi.sendTransacEmail(sendSmtpEmail);
      
      res.json({ 
        success: true, 
        message: 'Email byl odeslán přes Brevo API',
        info: result
      });
      
    } catch (error) {
      console.error('Brevo API error:', error);
      res.status(400).json({
        success: false,
        error: 'Chyba při odesílání emailu',
        details: error instanceof Error ? error.message : 'Neznámá chyba'
      });
    }
  }
};