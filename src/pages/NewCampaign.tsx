// src/pages/NewCampaign.tsx
import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewCampaignForm {
  name: string;
  emailTemplateId: string;
  landingPageId: string;
  phishingUrl: string;
  launchDate: string;
  sendUntil: string;
  sendingProfileId: string;
  groupIds: string[];
  priority: 'high' | 'medium' | 'low';
  sendingFrequency: 'all' | 'distributed' | 'custom';
  customFrequency?: {
    perDay: number;
    timeWindow: [string, string]; // ["09:00", "17:00"]
  };
  enableReminders: boolean;
  reminderAfterDays: number;
  blacklistedDomains: string[];
  tags: string[];
  abTesting: {
    enabled: boolean;
    variants: {
      name: string;
      emailTemplateId: string;
      distribution: number;
    }[];
  };
}

const NewCampaign: React.FC = () => {
  const [formData, setFormData] = useState<NewCampaignForm>({
    name: '',
    emailTemplateId: '',
    landingPageId: '',
    phishingUrl: '',
    launchDate: '',
    sendUntil: '',
    sendingProfileId: '',
    groupIds: [],
    priority: 'medium',
    sendingFrequency: 'all',
    enableReminders: false,
    reminderAfterDays: 3,
    blacklistedDomains: [],
    tags: [],
    abTesting: {
      enabled: false,
      variants: []
    }
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementace odeslání
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Link to="/campaigns" className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Nová kampaň</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg">
          <div className="p-6 space-y-6">
            {/* Základní informace */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Název kampaně
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              {/* Email a Landing Page */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Šablona emailu
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.emailTemplateId}
                    onChange={(e) => setFormData({...formData, emailTemplateId: e.target.value})}
                    required
                  >
                    <option value="">Vyberte šablonu</option>
                    {/* TODO: Načíst šablony z API */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Landing page
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.landingPageId}
                    onChange={(e) => setFormData({...formData, landingPageId: e.target.value})}
                    required
                  >
                    <option value="">Vyberte landing page</option>
                    {/* TODO: Načíst landing pages z API */}
                  </select>
                </div>
              </div>

              {/* Časování */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Datum spuštění
                  </label>
                  <input
                    type="datetime-local"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.launchDate}
                    onChange={(e) => setFormData({...formData, launchDate: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rozesílat do
                  </label>
                  <input
                    type="datetime-local"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.sendUntil}
                    onChange={(e) => setFormData({...formData, sendUntil: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Rozšířené nastavení */}
              <div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? '- Skrýt rozšířené nastavení' : '+ Zobrazit rozšířené nastavení'}
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-6">
                    {/* A/B testování */}
                    <div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={formData.abTesting.enabled}
                          onChange={(e) => setFormData({
                            ...formData,
                            abTesting: {
                              ...formData.abTesting,
                              enabled: e.target.checked
                            }
                          })}
                        />
                        <label className="ml-2 block text-sm font-medium text-gray-700">
                          Povolit A/B testování
                        </label>
                      </div>
                    </div>

                    {/* Frekvence rozesílání */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Frekvence rozesílání
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.sendingFrequency}
                        onChange={(e) => setFormData({...formData, sendingFrequency: e.target.value as any})}
                      >
                        <option value="all">Všechny najednou</option>
                        <option value="distributed">Rovnoměrně rozložit</option>
                        <option value="custom">Vlastní nastavení</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-gray-50 rounded-b-lg flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Vytvořit kampaň
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCampaign;