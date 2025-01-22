// src/pages/Campaigns.tsx
import React from 'react';
import { Plus, Calendar, PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Campaign {
  id: number;
  name: string;
  status: 'scheduled' | 'not_started' | 'in_progress' | 'completed';
  emailTemplate: string;
  landingPage: string;
  launchDate: string;
  sendUntil: string;
  targetGroups: string[];
  stats: {
    total: number;
    sent: number;
    opened: number;
    clicked: number;
    submitted: number;
  };
}

const CampaignList: React.FC = () => {
  // Mockovaná data pro ukázku
  const campaigns: Campaign[] = [
    {
      id: 1,
      name: "Jarní bezpečnostní test 2024",
      status: "scheduled",
      emailTemplate: "Reset hesla",
      landingPage: "Office 365 Login",
      launchDate: "2024-03-15",
      sendUntil: "2024-03-20",
      targetGroups: ["IT Oddělení", "Marketing"],
      stats: {
        total: 150,
        sent: 0,
        opened: 0,
        clicked: 0,
        submitted: 0
      }
    },
    // Další kampaně...
  ];

  const getStatusBadge = (status: Campaign['status']) => {
    const badges = {
      scheduled: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" />, text: 'Naplánováno' },
      not_started: { color: 'bg-gray-100 text-gray-800', icon: <Calendar className="w-4 h-4" />, text: 'Nespuštěno' },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: <PlayCircle className="w-4 h-4" />, text: 'Probíhá' },
      completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, text: 'Dokončeno' }
    };

    const badge = badges[status];
    return (
      <span className={`flex items-center px-3 py-1 rounded-full ${badge.color}`}>
        {badge.icon}
        <span className="ml-2">{badge.text}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kampaně</h1>
          <Link
            to="/campaigns/new"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nová kampaň
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="border-b border-gray-200">
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                      >
                        {campaign.name}
                      </Link>
                      <span className="ml-4">{getStatusBadge(campaign.status)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span className="font-medium">Email:</span> {campaign.emailTemplate}</p>
                        <p><span className="font-medium">Landing Page:</span> {campaign.landingPage}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Spuštění:</span> {new Date(campaign.launchDate).toLocaleDateString()}</p>
                        <p><span className="font-medium">Cílové skupiny:</span> {campaign.targetGroups.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="grid grid-cols-5 gap-4 text-center">
                      <StatBox label="Celkem" value={campaign.stats.total} />
                      <StatBox label="Odesláno" value={campaign.stats.sent} />
                      <StatBox label="Otevřeno" value={campaign.stats.opened} />
                      <StatBox label="Kliknuto" value={campaign.stats.clicked} />
                      <StatBox label="Vyplněno" value={campaign.stats.submitted} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-gray-50 p-2 rounded">
    <div className="text-lg font-semibold">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

export default CampaignList;