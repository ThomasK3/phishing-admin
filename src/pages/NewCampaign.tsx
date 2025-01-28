import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CampaignForm {
  name: string;
  emailTemplateId: string;
  landingPageId: string;
  launchDate: string;
  sendUntil: string;
  targetGroups: string[];
}

const NewCampaign: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CampaignForm>({
    name: '',
    emailTemplateId: '',
    landingPageId: '',
    launchDate: '',
    sendUntil: '',
    targetGroups: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submission
    console.log(formData);
    navigate('/campaigns');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Název kampaně
              </label>
              <input
                type="text"
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Datum spuštění
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                  value={formData.launchDate}
                  onChange={(e) => setFormData({...formData, launchDate: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Datum ukončení
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                  value={formData.sendUntil}
                  onChange={(e) => setFormData({...formData, sendUntil: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/campaigns')}
                className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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