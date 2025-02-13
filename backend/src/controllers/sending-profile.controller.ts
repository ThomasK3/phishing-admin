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
          name: "PSLib-EDU",
          email: "pslibedu@pslib-edu.cz"  // Sjednotit s envelope from
        },
        to: [{ email: testEmailTo }],
        subject: "TESTOVACÍ EMAIL",
        textContent: `Dobrý den,
      
      byl Vám vytvořen přístup do nového vzdělávacího portálu PSLIB-EDU. Tento portál je součástí modernizace výukových nástrojů naší školy a obsahuje:
      
      - Kompletní studijní materiály pro vaše předměty
      - Zpracovaná témata a prezentace z výuky
      - Příprava na praktická cvičení
      - Studijní podklady k maturitě
      - Digitální knihovna studijních materiálů
      - Přehledné uspořádání podle předmětů a ročníků
      
      Pro aktivaci vašeho účtu a přístup k materiálům navštivte:
      [odkaz]
      
      Doporučujeme aktivovat přístup co nejdříve, abyste měli všechny materiály k dispozici před začátkem nového pololetí.
      
      V případě dotazů nebo problémů s přístupem nás můžete kontaktovat na této emailové adrese.
      
      PSLib-EDU
      Systém pro podporu výuky`,
        htmlContent: `<!DOCTYPE html>
      <html lang="cs">
      <head>
          <meta charset="UTF-8">
          <title>PSLIB-EDU - Aktivace přístupu</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
          <div style="max-width: 600px; margin: 0 auto;">
              <h1>JEDNA SE POUZE O TESTOVACÍ EMAIL ROZESÍLAJÍCÍHO SERVERU</h1>
              <p>Dobrý den,</p>
      
              <p>byl Vám vytvořen přístup do nového vzdělávacího portálu <strong>PSLIB-EDU</strong>. Tento portál je součástí modernizace výukových nástrojů naší školy a obsahuje:</p>
      
              <ul style="padding-left: 20px;">
                  <li><strong>Kompletní studijní materiály</strong> pro vaše předměty</li>
                  <li>Zpracovaná témata a prezentace z výuky</li>
                  <li>Příprava na praktická cvičení</li>
                  <li><strong>Studijní podklady k maturitě</strong></li>
                  <li>Digitální knihovna studijních materiálů</li>
                  <li>Přehledné uspořádání podle předmětů a ročníků</li>
              </ul>
      
              <p>Pro aktivaci vašeho účtu a přístup k materiálům klikněte 
                  <a href="https://pslib-edu.cz" style="color: #0066cc; font-weight: bold; text-decoration: underline;">ZDE</a>
              </p>
      
              <p>Doporučujeme aktivovat přístup co nejdříve, abyste měli všechny materiály k dispozici před začátkem nového pololetí.</p>
      
              <p>V případě dotazů nebo problémů s přístupem nás můžete kontaktovat na této emailové adrese.</p>
      
              <p style="margin-top: 30px;">
                  PSLIB-EDU<br>
                  Systém pro podporu výuky
              </p>
          </div>
          <img width="1" height="1" alt="" src="..." style="display:none;" />
      </body>
      </html>`,
        headers: {
          "List-Unsubscribe": "<mailto:unsubscribe@pslib-edu.cz>",
          "X-Mailer": "PSLib-EDU System 1.0",
          "Precedence": "bulk",
          "Message-ID": `<${Date.now()}.${Math.random().toString(36).substring(2)}@pslib-edu.cz>`
        }
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