// src/pages/NewCampaign.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  content: string;
}

interface LandingPage {
  _id: string;
  name: string;
  url: string;
}

interface SendingProfile {
  _id: string;
  profileName: string;
  smtpFrom: string;
}

interface Group {
  _id: string;
  name: string;
  contactCount: number;
}

interface CampaignFormData {
  name: string;
  emailTemplateId: string;
  landingPageId: string;
  sendingProfileId: string;
  targetGroups: string[];
  launchDate: string;
  sendUntil: string;
}

const NewCampaign: React.FC = () => {
  const navigate = useNavigate();

  // Formulářová data
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    emailTemplateId: '',
    landingPageId: '',
    sendingProfileId: '',
    targetGroups: [],
    launchDate: '',
    sendUntil: ''
  });

  // Data pro výběry
  const [availableTemplates, setAvailableTemplates] = useState<EmailTemplate[]>([]);
  const [availablePages, setAvailablePages] = useState<LandingPage[]>([]);
  const [availableProfiles, setAvailableProfiles] = useState<SendingProfile[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  
  // UI stavy
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

// Na začátku useEffect pro načítání dat
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Starting to load data...');

      const [
        templatesRes,
        pagesRes,
        profilesRes,
        groupsRes
      ] = await Promise.all([
        api.getEmailTemplates(),
        api.getLandingPages(),
        api.getSendingProfiles(),
        api.getGroups()
      ]);

      console.log('Loaded data:', {
        templates: templatesRes,
        pages: pagesRes,
        profiles: profilesRes,
        groups: groupsRes
      });

      setAvailableTemplates(templatesRes.data || []);
      setAvailablePages(pagesRes.data || []);
      setAvailableProfiles(profilesRes.data || []);
      setAvailableGroups(groupsRes.data || []);

      console.log('State updated with:', {
        templates: availableTemplates,
        pages: availablePages,
        profiles: availableProfiles,
        groups: availableGroups
      });

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Nepodařilo se načíst potřebná data');
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

  // Handler pro změnu input polí
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler pro multiple select skupin
  const handleGroupsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGroups = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      targetGroups: selectedGroups
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validace dat
      if (!formData.name || !formData.emailTemplateId || !formData.landingPageId || 
          !formData.sendingProfileId || formData.targetGroups.length === 0) {
        setError('Prosím vyplňte všechny povinné údaje');
        return;
      }

      // Sestavení dat pro kampaň - používáme přímo formData
      const campaignData = {
        ...formData,
        status: 'scheduled'
      };
  
      const response = await api.createCampaign(campaignData);
      
      if (response.data?._id) {
        navigate(`/campaigns/${response.data._id}`);
      } else {
        throw new Error('Neplatná odpověď od serveru');
      }
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError('Nepodařilo se vytvořit kampaň');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  // src/pages/NewCampaign.tsx
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Nová kampaň</h1>
          <p className="text-gray-600">Vytvořte novou phishingovou kampaň</p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Základní informace */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium mb-4">Základní informace</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Název kampaně
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="např. Jarní bezpečnostní test 2024"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Nastavení obsahu */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium mb-4">Obsah kampaně</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email Template
                  </label>
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.emailTemplateId}
                    onChange={(e) => setFormData({...formData, emailTemplateId: e.target.value})}
                    required
                  >
                    <option value="">Vyberte šablonu emailu</option>
                    {availableTemplates.map((template: EmailTemplate) => (
                      <option key={template._id} value={template._id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Landing Page
                  </label>
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.landingPageId}
                    onChange={(e) => setFormData({...formData, landingPageId: e.target.value})}
                    required
                  >
                    <option value="">Vyberte cílovou stránku</option>
                    {availablePages.map((page: LandingPage) => (
                      <option key={page._id} value={page._id}>
                        {page.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Nastavení odesílání */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium mb-4">Nastavení odesílání</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Sending Profile
                  </label>
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.sendingProfileId}
                    onChange={(e) => setFormData({...formData, sendingProfileId: e.target.value})}
                    required
                  >
                    <option value="">Vyberte profil odesílatele</option>
                    {availableProfiles.map((profile: SendingProfile) => (
                      <option key={profile._id} value={profile._id}>
                        {profile.profileName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Cílové skupiny
                  </label>
                  <select
                    multiple
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white min-h-[120px]"
                    value={formData.targetGroups}
                    onChange={(e) => setFormData({
                      ...formData, 
                      targetGroups: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                    required
                  >
                    {availableGroups.map((group: Group) => (
                      <option key={group._id} value={group._id}>
                        {group.name} ({group.contactCount} kontaktů)
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Použijte CTRL pro výběr více skupin
                  </p>
                </div>
              </div>
            </div>

            {/* Časování */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium mb-4">Časování kampaně</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Datum spuštění
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.launchDate}
                    onChange={(e) => setFormData({...formData, launchDate: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Datum ukončení
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.sendUntil}
                    onChange={(e) => setFormData({...formData, sendUntil: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tlačítka */}
            <div className="p-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/campaigns')}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Vytvořit kampaň
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewCampaign;