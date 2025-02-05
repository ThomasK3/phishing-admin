import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface CampaignForm {
  name: string;
  emailTemplateId: string;
  landingPageId: string;
  sendingProfileId: string;
  targetGroups: string[];
  launchDate: string;
  sendUntil: string;
  status: 'scheduled' | 'not_started' | 'in_progress' | 'completed';
}

const NewCampaign: React.FC = () => {
  const navigate = useNavigate();
  
  // States pro formulář
  const [formData, setFormData] = useState<CampaignForm>({
    name: '',
    emailTemplateId: '',
    landingPageId: '',
    sendingProfileId: '',
    targetGroups: [],
    launchDate: '',
    sendUntil: '',
    status: 'scheduled'
  });

  // States pro načtené možnosti
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [sendingProfiles, setSendingProfiles] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          templatesResponse,
          pagesResponse,
          profilesResponse,
          groupsResponse
        ] = await Promise.all([
          api.getEmailTemplates(),
          api.getLandingPages(),
          api.getSendingProfiles(),
          api.getGroups()
        ]);

        setEmailTemplates(templatesResponse);
        setLandingPages(pagesResponse);
        setSendingProfiles(profilesResponse);
        setGroups(groupsResponse);
        setLoading(false);
      } catch (err) {
        setError('Chyba při načítání dat');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Vytvoření kampaně
      const response = await fetch('http://localhost:3001/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Nepodařilo se vytvořit kampaň');
      }

      const data = await response.json();
      alert(data.message); // Zobrazí hlášku o úspěchu
      navigate('/campaigns');
    } catch (error) {
      console.error('Chyba při ukládání kampaně:', error);
      alert('Nepodařilo se uložit kampaň');
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
                    {emailTemplates.map(template => (
                      <option key={template._id} value={template._id}>
                        {template.internalName}
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
                    {landingPages.map(page => (
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
                    {sendingProfiles.map(profile => (
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
                    {groups.map(group => (
                      <option key={group._id} value={group._id}>
                        {group.name} ({group.contacts?.length || 0} kontaktů)
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