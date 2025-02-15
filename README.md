# **Phishing Admin Tool**

# **Architektura projektu**

Projekt je rozdělen na dvě hlavní části:
1. **Frontend** (React aplikace)
2. **Backend** (Node.js/Express + MongoDB)

## **Frontend Struktura**

### **Klíčové stránky:**
1. **Dashboard** (`/src/pages/Dashboard.tsx`)
   - Hlavní přehledová stránka
   - Zobrazuje statistiky kampaní
   - Rychlý přístup k hlavním funkcím
   - Integrace s Brevo API pro emailové statistiky

2. **Kampaně** (`/src/pages/Campaigns.tsx`, `CampaignDetail.tsx`, `NewCampaign.tsx`)
   - Seznam všech kampaní
   - Detailní pohled na kampaň
   - Vytváření nových kampaní
   - Sledování statistik jednotlivých kampaní

3. **Email Templates** (`/src/pages/EmailTemplates.tsx`)
   - Editor emailových šablon
   - WYSIWYG editor (React-Quill)
   - Podpora HTML/Text formátu
   - Správa hlaviček a metadat

4. **Landing Pages** (`/src/pages/LandingPages.tsx`, `LandingPageEditor.tsx`)
   - Seznam landing pages
   - Editor s live náhledem
   - Import existujících stránek
   - Tracking návštěv a konverzí

5. **Groups** (`/src/pages/Groups.tsx`)
   - Správa cílových skupin
   - Import/export kontaktů (CSV)
   - Filtrování a vyhledávání

6. **Sending Profiles** (`/src/pages/SendingProfiles.tsx`)
   - Konfigurace SMTP serverů
   - Testování připojení
   - Správa email hlaviček

## **Backend Struktura**

### **Modely (MongoDB schémata):**
1. Campaign
2. EmailTemplate
3. LandingPage
4. Group
5. SendingProfile

### **Controllery:**
- Implementovaná CRUD logika pro všechny modely
- Specializované endpointy pro:
  - Testování SMTP připojení
  - Tracking emailů
  - Statistiky kampaní

### **Services:**
- Brevo integrace pro emailové statistiky
- SMTP služby pro odesílání emailů

## **Klíčové Funkcionality**

### **1. Email Kampaně**
- Vytváření a správa kampaní
- Plánování rozesílky
- Tracking otevření a kliknutí
- A/B testování

### **2. Email Editor**
- WYSIWYG editor
- HTML/Text verze
- Tracking pixely
- Personalizace obsahu

### **3. Landing Pages**
- Vlastní editor
- Import existujících stránek
- Live preview
- Tracking návštěv

### **4. Správa Kontaktů**
- Import/Export CSV
- Segmentace do skupin
- Validace emailů
- Historie interakcí

### **5. SMTP Konfigurace**
- Více SMTP profilů
- Testování připojení
- Správa hlaviček
- SPF/DKIM podpora

### **6. Analytics**
- Detailní statistiky kampaní
- Real-time tracking
- Export dat
- Vizualizace výsledků

## **Technologie**

### **Frontend:**
- React 18
- TailwindCSS
- Lucide ikony
- React Router
- React-Quill pro WYSIWYG

### **Backend:**
- Node.js/Express
- MongoDB/Mongoose
- TypeScript
- Nodemailer
- Brevo API integrace

## **Bezpečnostní Prvky**
- CORS konfigurace
- Rate limiting
- Input validace
- Šifrování citlivých dat
- Logování aktivit

## **Současný Stav**
Projekt je ve fázi funkčního prototypu s implementovanými základními funkcemi. Hlavní funkcionalita pro správu kampaní, emailů a landing pages je hotová. Integrace s SMTP servery a tracking systém jsou připraveny k testování.

**Potřebuje ještě:**
1. Dokončení komplexního testování
2. Vylepšení UX/UI
3. Rozšíření analytických funkcí
4. Dokumentaci
5. Penetrační testy

Projekt je použitelný pro základní phishingové kampaně s možností sledování výsledků a správou kontaktů.
