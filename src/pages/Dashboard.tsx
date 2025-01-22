// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Users, BarChart3, Send, LogOut, Settings, Globe } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Horní navigace */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Phishing Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin</span>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <LogOut className="w-5 h-5" />
              </button>
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
            value="3"
            icon={<Send className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Celkem emailů"
            value="1,234"
            icon={<Mail className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Počet skupin"
            value="12"
            icon={<Users className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="Úspěšnost"
            value="67%"
            icon={<BarChart3 className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Rychlé akce */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAction
            title="Kampaně"
            icon={<Send className="w-6 h-6" />}
            color="blue"
            to="/campaigns"
          />
          <QuickAction
            title="Vytvořit šablonu"
            icon={<Mail className="w-6 h-6" />}
            color="green"
            to="/email-templates"
          />
          <QuickAction
            title="Přidat skupinu"
            icon={<Users className="w-6 h-6" />}
            color="yellow"
            to="/groups"
          />
          <QuickAction
            title="Sending Profiles"
            icon={<Settings className="w-6 h-6" />}
            color="purple"
            to="/sending-profiles"
          />
                      <QuickAction
              title="Landing Pages"
              icon={<Globe className="w-6 h-6" />}
              color="indigo"
              to="/landing-pages"
            />
        </div>

        {/* Poslední aktivity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Poslední aktivity</h2>
          <div className="space-y-4">
            <ActivityItem
              title="Nová kampaň spuštěna"
              description="Kampaň 'Jarní testování' byla spuštěna"
              time="Před 2 hodinami"
            />
            <ActivityItem
              title="Šablona upravena"
              description="Šablona 'Reset hesla' byla aktualizována"
              time="Před 5 hodinami"
            />
            <ActivityItem
              title="Nová skupina vytvořena"
              description="Skupina 'IT oddělení' byla vytvořena"
              time="Před 1 dnem"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// Pomocné komponenty
const StatCard = ({ title, value, icon, color }) => {
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

const QuickAction = ({ title, icon, color, to }) => {
  const colorClasses = {
    blue: 'hover:bg-blue-50 hover:text-blue-600',
    green: 'hover:bg-green-50 hover:text-green-600',
    yellow: 'hover:bg-yellow-50 hover:text-yellow-600',
    purple: 'hover:bg-purple-50 hover:text-purple-600'
  };

  return (
    <Link 
      to={to} 
      className={`${colorClasses[color]} p-6 bg-white rounded-lg shadow text-gray-600 transition-all hover:shadow-md`}
    >
      <div className="flex flex-col items-center space-y-2">
        {icon}
        <span className="font-medium">{title}</span>
      </div>
    </Link>
  );
};

const ActivityItem = ({ title, description, time }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-sm text-gray-400">{time}</span>
    </div>
  );
};

export default Dashboard;