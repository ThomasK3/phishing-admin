// src/components/LandingPagePreview.tsx
import React, { useState } from 'react';
import { Smartphone, Monitor, X, Maximize2, Minimize2 } from 'lucide-react';

interface LandingPagePreviewProps {
  html: string;
  css: string;
  isOpen: boolean;
  onClose: () => void;
}

const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({
  html,
  css,
  isOpen,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Injekce CSS pro zachycení formulářů
  const injectFormCapture = (htmlContent: string): string => {
    const formScript = `
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          const forms = document.querySelectorAll('form');
          forms.forEach(form => {
            form.addEventListener('submit', function(e) {
              e.preventDefault();
              const formData = new FormData(form);
              const data = Object.fromEntries(formData.entries());
              console.log('Captured form data:', data);
              // Zde by šel AJAX požadavek na backend
              alert('Form submitted (preview mode)');
            });
          });
        });
      </script>
    `;

    return htmlContent + formScript;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`bg-white rounded-lg flex flex-col ${
        isFullscreen ? 'w-full h-full' : 'w-11/12 h-5/6'
      }`}>
        {/* Hlavička */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded ${
                viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
              }`}
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded ${
                viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
              }`}
            >
              <Smartphone className="w-5 h-5" />
            </button>
            <div className="text-sm text-gray-500">
              {viewMode === 'desktop' ? 'Desktop zobrazení' : 'Mobilní zobrazení'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Iframe container */}
        <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
          <div className={`h-full mx-auto bg-white shadow-lg transition-all duration-300 overflow-hidden ${
            viewMode === 'mobile' ? 'max-w-sm' : 'max-w-none'
          }`}>
            <iframe
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>${css}</style>
                  </head>
                  <body>${injectFormCapture(html)}</body>
                </html>
              `}
              className="w-full h-full border-0"
              title="Landing Page Preview"
              sandbox="allow-forms allow-scripts"
            />
          </div>
        </div>

        {/* Footer s informacemi */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between text-sm text-gray-500">
            <div>Režim náhledu - data z formulářů nebudou uložena</div>
            <div>
              {viewMode === 'mobile' ? 'Mobilní rozlišení (375x667)' : 'Desktop rozlišení'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPagePreview;