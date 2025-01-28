import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (parsedEmail: any) => void;
}

const EmailImportDialog: React.FC<ImportDialogProps> = ({ isOpen, onClose, onImport }) => {
  const [rawEmail, setRawEmail] = useState('');

  const parseEmail = (rawContent: string) => {
    try {
      // Základní parsování hlaviček
      const lines = rawContent.split('\n');
      const headers: Record<string, string> = {};
      let i = 0;
      let content = '';

      // Parsování hlaviček
      while (i < lines.length && lines[i].trim() !== '') {
        const line = lines[i];
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          headers[key.toLowerCase()] = value;
        }
        i++;
      }

      // Přeskočení prázdného řádku mezi hlavičkami a obsahem
      i++;

      // Zbytek je obsah
      content = lines.slice(i).join('\n');

      // Detekce HTML obsahu
      const isHTML = content.trim().startsWith('<') || 
                    headers['content-type']?.includes('text/html');

      return {
        subject: headers['subject'] || '',
        from: headers['from'] || '',
        replyTo: headers['reply-to'] || '',
        content: content.trim(),
        isHTML,
        priority: headers['x-priority'] === '1' ? 'high' : 'normal',
        // Parsování displayName a emailu z From hlavičky
        displayName: headers['from']?.match(/"([^"]+)"/)?.[1] || '',
        envelopeSender: headers['from']?.match(/<([^>]+)>/)?.[1] || headers['from'] || ''
      };
    } catch (error) {
      console.error('Chyba při parsování emailu:', error);
      alert('Nepodařilo se zpracovat email. Zkontrolujte prosím formát.');
      return null;
    }
  };

  const handleImport = () => {
    const parsedEmail = parseEmail(rawEmail);
    if (parsedEmail) {
      onImport(parsedEmail);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Importovat existující email</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Vložte surový kód emailu (včetně hlaviček)
          </label>
          <textarea
            className="w-full h-96 p-2 border rounded font-mono text-sm focus:ring-2 focus:ring-blue-500"
            value={rawEmail}
            onChange={(e) => setRawEmail(e.target.value)}
            placeholder={`From: "Jméno Odesílatele" <email@domena.cz>\nSubject: Předmět emailu\nContent-Type: text/html\n\nObsah emailu...`}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Zrušit
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Importovat
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailImportDialog;