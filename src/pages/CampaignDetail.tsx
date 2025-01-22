// src/pages/CampaignDetail.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Mail, MousePointer2, Shield } from 'lucide-react';

interface CampaignStats {
  sent: number;
  opened: number;
  clicked: number;
  submitted: number;
  timeline: Array<{
    date: string;
    events: {
      sent: number;
      opened: number;
      clicked: number;
      submitted: number;
    };
  }>;
}

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'timeline'>('overview');

  // Mock data
  const stats: CampaignStats = {
    sent: 150,
    opened: 75,
    clicked: 45,
    submitted: 20,
    timeline: [
      {
        date: "2024-01-22",
        events: { sent: 50, opened: 25, clicked: 15, submitted: 7 }
      },
      // Další dny...
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Detail kampaně</h1>
          <p className="text-gray-600">ID: {id}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`}
              >
                Přehled
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 ${activeTab === 'results' ? 'border-b-2 border-blue-500' : ''}`}
              >
                Výsledky
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-2 ${activeTab === 'timeline' ? 'border-b-2 border-blue-500' : ''}`}
              >
                Timeline
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <StatCard
                    icon={<Mail className="w-6 h-6" />}
                    label="Odesláno"
                    value={stats.sent}
                    color="blue"
                  />
                  <StatCard
                    icon={<Users className="w-6 h-6" />}
                    label="Otevřeno"
                    value={stats.opened}
                    color="green"
                  />
                  <StatCard
                    icon={<MousePointer2 className="w-6 h-6" />}
                    label="Kliknuto"
                    value={stats.clicked}
                    color="yellow"
                  />
                  <StatCard
                    icon={<Shield className="w-6 h-6" />}
                    label="Vyplněno"
                    value={stats.submitted}
                    color="red"
                  />
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div>
                {/* Zde bude detail výsledků */}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                {/* Zde bude časová osa */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'red';
}> = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4`}>
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-sm">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;