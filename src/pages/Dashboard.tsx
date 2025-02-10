// src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Users, BarChart3, Send, MousePointer2, Eye, Settings } from 'lucide-react';
import { api } from '../services/api';

// Interface pro metriky z Brevo API
interface DashboardStats {
  totalDelivered: number;
  openRate: number;
  clickRate: number;
}

// Interface pro Campaign z MongoDB
interface Campaign {
  _id: string;
  name: string;
  status: string;
  emailTemplateId: string;
  landingPageId: string;
  targetGroups: string[];
  launchDate: string;
  sendUntil: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDelivered: 0,
    openRate: 0,
    clickRate: 0
  });

  const [activeCampaignsCount, setActiveCampaignsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching fresh stats...');
        
        // Získat data z našeho backend API
        const [campaigns, brevoStats] = await Promise.all([
          api.getCampaigns(),
          api.getDashboardStats()
        ]);
  
        console.log('Received campaigns:', campaigns);
        console.log('Received brevo stats:', brevoStats);
  
        setActiveCampaignsCount(
          campaigns.filter((campaign: Campaign) => campaign.status === 'scheduled').length
        );
        
        setStats(brevoStats);
      } catch (error) {
        console.error('Chyba při načítání statistik:', error);
      }
    };
  
    // Zavolat ihned při mount
    fetchStats();
    
    // Aktualizovat každých 10 sekund pro testování
    const interval = setInterval(() => {
      console.log('Interval triggered - fetching new stats');
      fetchStats();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Horní navigace */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Phishing Admin</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Hlavní obsah */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Statistiky */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Aktivní kampaně"
            value={activeCampaignsCount}
            icon={<Send className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Doručeno emailů"
            value={stats.totalDelivered}
            icon={<Mail className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Open Rate"
            value={`${stats.openRate}%`}
            icon={<Eye className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="Click Rate"
            value={`${stats.clickRate}%`}
            icon={<MousePointer2 className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Rychlé akce */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/campaigns"
            className="p-6 bg-white rounded-lg shadow text-gray-600 transition-all hover:shadow-md hover:bg-blue-50 hover:text-blue-600"
          >
            <div className="flex flex-col items-center space-y-2">
              <Send className="w-6 h-6" />
              <span className="font-medium">Kampaně</span>
            </div>
          </Link>
          <Link
            to="/email-templates"
            className="p-6 bg-white rounded-lg shadow text-gray-600 transition-all hover:shadow-md hover:bg-green-50 hover:text-green-600"
          >
            <div className="flex flex-col items-center space-y-2">
              <Mail className="w-6 h-6" />
              <span className="font-medium">Šablony emailů</span>
            </div>
          </Link>
          <Link
            to="/groups"
            className="p-6 bg-white rounded-lg shadow text-gray-600 transition-all hover:shadow-md hover:bg-yellow-50 hover:text-yellow-600"
          >
            <div className="flex flex-col items-center space-y-2">
              <Users className="w-6 h-6" />
              <span className="font-medium">Skupiny</span>
            </div>
          </Link>
          <Link
            to="/landing-pages"
            className="p-6 bg-white rounded-lg shadow text-gray-600 transition-all hover:shadow-md hover:bg-purple-50 hover:text-purple-600"
          >
            <div className="flex flex-col items-center space-y-2">
              <BarChart3 className="w-6 h-6" />
              <span className="font-medium">Landing Pages</span>
            </div>
          </Link>
          <Link
            to="/sending-profiles"
            className="p-6 bg-white rounded-lg shadow text-gray-600 transition-all hover:shadow-md hover:bg-indigo-50 hover:text-indigo-600"
          >
            <div className="flex flex-col items-center space-y-2">
              <Settings className="w-6 h-6" />
              <span className="font-medium">Sending Profiles</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;