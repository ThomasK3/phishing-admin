// src/pages/LandingPages.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Globe, Eye, Copy, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface LandingPage {
  id: number;
  name: string;
  url: string;
  status: 'active' | 'draft' | 'archived';
  type: 'custom' | 'imported';
  captureData: boolean;
  visits: number;
  submissions: number;
  lastModified: string;
  createdAt: string;
}

const LandingPages: React.FC = () => {
  // Mock data - později nahradit API voláním
  const [pages, setPages] = useState<LandingPage[]>([
    {
      id: 1,
      name: "Office 365 Login",
      url: "/phish/office365",
      status: "active",
      type: "imported",
      captureData: true,
      visits: 45,
      submissions: 12,
      lastModified: "2024-01-22T10:00:00",
      createdAt: "2024-01-20T14:30:00"
    }
  ]);

  const getStatusBadge = (status: LandingPage['status']) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, text: 'Aktivní' },
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" />, text: 'Rozpracováno' },
      archived: { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-4 h-4" />, text: 'Archivováno' }
    };

    const badge = badges[status];
    return (
      <span className={`flex items-center px-3 py-1 rounded-full ${badge.color}`}>
        {badge.icon}
        <span className="ml-2">{badge.text}</span>
      </span>
    );
  };

  const deletePage = (id: number) => {
    if (window.confirm('Opravdu chcete smazat tuto landing page?')) {
      setPages(pages.filter(page => page.id !== id));
    }
  };

  const duplicatePage = (id: number) => {
    const pageToClone = pages.find(page => page.id === id);
    if (pageToClone) {
      const newPage = {
        ...pageToClone,
        id: Date.now(),
        name: `${pageToClone.name} (kopie)`,
        status: 'draft' as const
      };
      setPages([...pages, newPage]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Globe className="mr-2" />
            <h1 className="text-2xl font-bold">Landing Pages</h1>
          </div>
          <Link
            to="/landing-pages/new"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nová landing page
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {pages.length === 0 ? (
            <div className="p-8 text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Žádné landing pages</h3>
              <p className="text-gray-500 mb-4">Zatím nebyly vytvořeny žádné landing pages.</p>
              <Link
                to="/landing-pages/new"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Vytvořit první landing page
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Název / URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Typ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statistiky
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Poslední úprava
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akce
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <Link
                            to={`/landing-pages/${page.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {page.name}
                          </Link>
                          <span className="text-sm text-gray-500">{page.url}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(page.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">
                          {page.type === 'custom' ? 'Vlastní' : 'Importovaná'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm">
                          <span>{page.visits} návštěv</span>
                          <span>{page.submissions} odeslání</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(page.lastModified).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => window.open(page.url, '_blank')}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => duplicatePage(page.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deletePage(page.id)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPages;