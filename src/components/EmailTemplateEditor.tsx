// src/components/EmailTemplateEditor.tsx
import React, { useState, useEffect } from 'react';
import { Mail, Save, Trash2, Eye, Upload, FileText, Code, Globe, AlertCircle } from 'lucide-react';
import EmailImportDialog from './EmailImportDialog';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { api } from '../services/api';
import { EmailTemplate } from '../types/email-template';

const EmailTemplateEditor: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate>({
    id: 0,
    internalName: '',
    envelopeSender: '',
    displayName: '',
    replyTo: '',
    subject: '',
    content: '',
    isHTML: true,
    hasTrackingPixel: false,
    attachments: [],
    priority: 'normal',
    language: 'cs',
    scheduledTime: '',
    includeFakeForward: false,
    fakeForwardFrom: ''
  });

  // Načtení šablon při prvním renderu
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const loadedTemplates = await api.getEmailTemplates();
        setTemplates(loadedTemplates);
      } catch (error) {
        console.error('Chyba při načítání šablon:', error);
      }
    };

    loadTemplates();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCurrentTemplate({
        ...currentTemplate,
        attachments: [...currentTemplate.attachments, ...newFiles]
      });
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = currentTemplate.attachments.filter((_, i) => i !== index);
    setCurrentTemplate({
      ...currentTemplate,
      attachments: newAttachments
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validace povinných polí
    if (!currentTemplate.internalName || !currentTemplate.subject) {
      alert('Prosím vyplňte název šablony a předmět emailu');
      return;
    }
  
    try {
      // Přidání výchozí hodnoty, pokud není nastavena
      const templateToSave = {
        ...currentTemplate,
        envelopeSender: currentTemplate.envelopeSender || 'noreply@vasedomena.cz',
        isHTML: currentTemplate.isHTML,
        content: currentTemplate.content,
        lastModified: new Date().toISOString()
      };
  
      if (currentTemplate.id === 0) {
        // Vytvoření nové šablony
        const newTemplate = await api.createEmailTemplate(templateToSave);
        setTemplates([...templates, newTemplate]);
      } else {
        // Aktualizace existující šablony
        const updatedTemplate = await api.updateEmailTemplate(
          currentTemplate.id.toString(),
          templateToSave
        );
        setTemplates(templates.map(t => 
          t.id === currentTemplate.id ? updatedTemplate : t
        ));
      }
  
      alert('Šablona byla úspěšně uložena');
    } catch (error) {
      console.error('Chyba při ukládání šablony:', error);
      alert('Nepodařilo se uložit šablonu');
    }
  };

  const deleteTemplate = async (id: number) => {
    try {
      await api.deleteEmailTemplate(id.toString());
      setTemplates(templates.filter(template => template.id !== id));
    } catch (error) {
      console.error('Chyba při mazání šablony:', error);
      alert('Nepodařilo se smazat šablonu');
    }
  };

  const handleEmailImport = (parsedEmail: any) => {
    setCurrentTemplate({
      ...currentTemplate,
      subject: parsedEmail.subject,
      displayName: parsedEmail.displayName,
      content: parsedEmail.content,
      isHTML: parsedEmail.isHTML,
      priority: parsedEmail.priority,
    });
  };

  // Zbytek kódu zůstává nezměněn (moduly, formáty, atd.)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  // Return statement následuje...

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Mail className="mr-2" />
        <h1 className="text-2xl font-bold">Editor emailových šablon</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form onSubmit={handleSubmit}>
          {/* Základní informace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Interní název šablony</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={currentTemplate.internalName}
                onChange={(e) => setCurrentTemplate({...currentTemplate, internalName: e.target.value})}
                placeholder="Např. Jarní kampaň 2024"
              />
            </div>
          </div>
            

          {/* Nastavení předmětu a priority */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Předmět emailu</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={currentTemplate.subject}
                onChange={(e) => setCurrentTemplate({...currentTemplate, subject: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priorita</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={currentTemplate.priority}
                onChange={(e) => setCurrentTemplate({...currentTemplate, priority: e.target.value as 'normal' | 'high' | 'low'})}
              >
                <option value="normal">Normální</option>
                <option value="high">Vysoká</option>
                <option value="low">Nízká</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Jazyk</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={currentTemplate.language}
                onChange={(e) => setCurrentTemplate({...currentTemplate, language: e.target.value as 'cs' | 'en'})}
              >
                <option value="cs">Čeština</option>
                <option value="en">Angličtina</option>
              </select>
            </div>
          </div>

          {/* Přepínač HTML/Text */}
          <div className="flex items-center mb-4 space-x-4">
            <button
              type="button"
              className={`px-4 py-2 rounded ${currentTemplate.isHTML ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
              onClick={() => setCurrentTemplate({...currentTemplate, isHTML: false})}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Text
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded ${currentTemplate.isHTML ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setCurrentTemplate({...currentTemplate, isHTML: true})}
            >
              <Code className="w-4 h-4 inline mr-2" />
              HTML
            </button>
          </div>

          {/* Editor obsahu */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Obsah emailu</label>
            {currentTemplate.isHTML ? (
              <div className="h-96">
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={currentTemplate.content}
                  onChange={(content) => setCurrentTemplate({...currentTemplate, content})}
                  className="h-80"
                />
              </div>
            ) : (
              <textarea
                className="w-full p-2 border rounded h-64 focus:ring-2 focus:ring-blue-500"
                value={currentTemplate.content}
                onChange={(e) => setCurrentTemplate({...currentTemplate, content: e.target.value})}
                placeholder="Váš textový obsah..."
              />
            )}
          </div>

          {/* Tracking pixel a přílohy */}
          <div className="mb-4 space-y-4">

            <div>
              <label className="block text-sm font-medium mb-2">Přílohy</label>
              <div className="space-y-2">
                {currentTemplate.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="block">
                  <span className="sr-only">Vybrat soubory</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsImportDialogOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            <Mail className="w-4 h-4 mr-2" />
            Importovat email
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Uložit šablonu
          </button>
        </div>
        </form>
      </div>

      {/* Seznam existujících šablon */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Existující šablony</h2>
        <div className="space-y-4">
          {templates.map(template => (
            <div key={template.id} className="border p-4 rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{template.internalName}</h3>
                  <p className="text-sm text-gray-600">
                    {template.displayName} &lt;
                  </p>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                  <div className="flex space-x-4 mt-1">
                    {template.priority === 'high' && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        Vysoká priorita
                      </span>
                    )}
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      <Globe className="w-3 h-3 inline mr-1" />
                      {template.language === 'cs' ? 'Čeština' : 'Angličtina'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {previewMode && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <div className="text-sm">
                    <div className={template.isHTML ? 'font-mono' : ''}>
                      {template.content}
                    </div>
                    {template.attachments.length > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-gray-500">Přílohy ({template.attachments.length}):</p>
                        {template.attachments.map((file, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-center">
                            <Upload className="w-3 h-3 mr-1" />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
            {/* Dialog pro import emailu */}
            <EmailImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleEmailImport}
      />
    </div>
  );
};

export default EmailTemplateEditor;