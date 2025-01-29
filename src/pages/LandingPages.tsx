import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Plus, Pencil, Copy, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface LandingPage {
  _id: string;
  name: string;
  url: string;
  status: 'active' | 'draft' | 'archived';
  type: 'custom' | 'imported';
  captureData: boolean;
  visits: number;
  submissions: number;
  lastModified: string;
  createdAt: string;
  html: string;
  css: string;
}

const LandingPages: React.FC = () => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching landing pages...');
      const response = await fetch('http://localhost:3001/api/landing-pages');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Fetched pages:', data);
      setPages(data);
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      setError(error instanceof Error ? error.message : 'Neznámá chyba');
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (pageId: string) => {
    if (window.confirm('Opravdu chcete smazat tuto landing page?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/landing-pages/${pageId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Chyba při mazání stránky');
        }

        setPages(pages.filter(p => p._id !== pageId));
      } catch (error) {
        console.error('Error deleting landing page:', error);
        alert('Chyba při mazání stránky');
      }
    }
  };

  const duplicatePage = async (pageId: string) => {
    try {
      const pageToClone = pages.find(p => p._id === pageId);
      if (pageToClone) {
        const response = await fetch('http://localhost:3001/api/landing-pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...pageToClone,
            name: `${pageToClone.name} (kopie)`,
            status: 'draft'
          })
        });
        
        if (!response.ok) {
          throw new Error('Chyba při duplikování stránky');
        }

        const newPage = await response.json();
        setPages([...pages, newPage]);
      }
    } catch (error) {
      console.error('Error duplicating landing page:', error);
      alert('Chyba při duplikování stránky');
    }
  };

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

        {loading ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-red-500 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="divide-y">
              {pages.map(landingPage => (
                <div key={landingPage._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {landingPage.name}
                      </h3>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(landingPage.status)}
                        <span className="text-sm text-gray-500">
                          Návštěvy: {landingPage.visits || 0}
                        </span>
                        <span className="text-sm text-gray-500">
                          Odeslání: {landingPage.submissions || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/landing-pages/${landingPage._id}`}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Upravit"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => duplicatePage(landingPage._id)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Duplikovat"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deletePage(landingPage._id)}
                        className="p-2 text-red-400 hover:text-red-600"
                        title="Smazat"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPages;