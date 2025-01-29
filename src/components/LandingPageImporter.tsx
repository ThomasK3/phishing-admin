import React, { useState, useRef } from 'react';
import { Upload, Globe, X, AlertCircle } from 'lucide-react';

interface ImportedContent {
  html: string;
  css: string;
  assets: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (content: ImportedContent) => void;
}

const LandingPageImporter: React.FC<Props> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [importMethod, setImportMethod] = useState<'file' | 'url' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const processHTML = (html: string): ImportedContent => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extrahovat CSS ze style tagů
    const styleElements = doc.getElementsByTagName('style');
    let css = '';
    for (const style of styleElements) {
      css += style.textContent + '\n';
      style.remove();
    }

    // Najít externí CSS soubory
    const linkElements = doc.getElementsByTagName('link');
    const assets: ImportedContent['assets'] = [];
    
    for (const link of linkElements) {
      if (link.rel === 'stylesheet' && link.href) {
        assets.push({
          name: link.href.split('/').pop() || 'style.css',
          type: 'css',
          url: link.href
        });
      }
    }

    // Najít obrázky
    const imgElements = doc.getElementsByTagName('img');
    for (const img of imgElements) {
      if (img.src) {
        assets.push({
          name: img.src.split('/').pop() || 'image',
          type: 'image',
          url: img.src
        });
        // Nahradit URL za placeholder
        img.src = '/api/placeholder/400/300';
      }
    }

    return {
      html: doc.documentElement.innerHTML,
      css,
      assets
    };
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const htmlFile = Array.from(files).find(file => file.name.endsWith('.html'));
      const cssFile = Array.from(files).find(file => file.name.endsWith('.css'));

      if (!htmlFile) {
        throw new Error('Nebyl nalezen HTML soubor');
      }

      const htmlContent = await htmlFile.text();
      let cssContent = '';

      if (cssFile) {
        cssContent = await cssFile.text();
      }

      const processed = processHTML(htmlContent);
      onImport({
        ...processed,
        css: cssContent + processed.css
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nastala chyba při importu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlImport = async () => {
    const url = urlInputRef.current?.value;
    if (!url) {
      setError('Zadejte platnou URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      const html = await response.text();
      
      const processed = processHTML(html);
      onImport(processed);
      onClose();
    } catch (err) {
      setError('Nepodařilo se načíst stránku z URL');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Import landing page</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setImportMethod('file')}
              className={`flex-1 p-4 rounded border ${
                importMethod === 'file' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <Upload className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Import ze souborů</div>
              <div className="text-xs text-gray-500">HTML + CSS soubory</div>
            </button>
            <button
              onClick={() => setImportMethod('url')}
              className={`flex-1 p-4 rounded border ${
                importMethod === 'url' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <Globe className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Import z URL</div>
              <div className="text-xs text-gray-500">Stažení existující stránky</div>
            </button>
          </div>
        </div>

        {importMethod === 'file' && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".html,.css"
              multiple
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-2 text-xs text-gray-500">
              Můžete nahrát HTML soubor samostatně nebo společně s CSS souborem
            </p>
          </div>
        )}

        {importMethod === 'url' && (
          <div>
            <div className="flex gap-2">
              <input
                type="url"
                ref={urlInputRef}
                placeholder="https://example.com"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUrlImport}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Importuji...' : 'Importovat'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Zadejte URL stránky, kterou chcete importovat
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPageImporter;