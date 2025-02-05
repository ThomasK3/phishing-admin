import React, { useState, useRef } from 'react';
import { Users, Upload, Download, Search, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { Group, Contact } from '../types/group';

interface GroupDetailProps {
  onSave: (group: Group) => Promise<void>;
  initialGroup?: Group;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ onSave, initialGroup }) => {
  const [currentGroup, setCurrentGroup] = useState<Group>(initialGroup || {
    name: '',
    tags: [],
    contacts: [],
    lastModified: new Date().toISOString()
  });
  const [newContact, setNewContact] = useState<Partial<Contact>>({});
  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const extractNameFromEmail = (email: string): { firstName: string, lastName: string } => {
    try {
      const localPart = email.split('@')[0];
      const parts = localPart.split('.');
      if (parts.length >= 2) {
        return {
          firstName: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
          lastName: parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
        };
      }
    } catch (e) {
      console.error('Chyba při extrakci jména z emailu:', e);
    }
    return { firstName: '', lastName: '' };
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const newContacts: Contact[] = results.data
            .filter((row: any) => row.Email && validateEmail(row.Email))
            .map((row: any) => {
              let firstName = row['First Name'] || '';
              let lastName = row['Last Name'] || '';
              
              if (!firstName && !lastName) {
                const extracted = extractNameFromEmail(row.Email);
                firstName = extracted.firstName;
                lastName = extracted.lastName;
              }

              return {
                id: Math.random().toString(36).substr(2, 9),
                firstName: firstName,
                lastName: lastName,
                email: row.Email,
                position: row.Position || '',
                active: true,
                dateAdded: new Date().toISOString()
              };
            });

          const existingEmails = new Set(currentGroup.contacts.map(c => c.email));
          const uniqueNewContacts = newContacts.filter(c => !existingEmails.has(c.email));

          setCurrentGroup({
            ...currentGroup,
            contacts: [...currentGroup.contacts, ...uniqueNewContacts],
            lastModified: new Date().toISOString()
          });

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
        header: true,
        skipEmptyLines: true,
        transform: (value) => value.trim(),
        dynamicTyping: false
      });
    }
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(currentGroup.contacts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentGroup.name}_contacts.csv`;
    link.click();
  };

  const addContact = () => {
    if (!newContact.email || !validateEmail(newContact.email)) {
      alert('Prosím zadejte platnou emailovou adresu');
      return;
    }

    const contact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: newContact.firstName || '',
      lastName: newContact.lastName || '',
      email: newContact.email,
      position: newContact.position || '',
      active: true,
      dateAdded: new Date().toISOString()
    };

    setCurrentGroup({
      ...currentGroup,
      contacts: [...currentGroup.contacts, contact],
      lastModified: new Date().toISOString()
    });
    setNewContact({});
  };

  const removeContact = (id: string) => {
    setCurrentGroup({
      ...currentGroup,
      contacts: currentGroup.contacts.filter(c => c.id !== id),
      lastModified: new Date().toISOString()
    });
  };

  const addTag = () => {
    if (newTag && !currentGroup.tags.includes(newTag)) {
      setCurrentGroup({
        ...currentGroup,
        tags: [...currentGroup.tags, newTag],
        lastModified: new Date().toISOString()
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setCurrentGroup({
      ...currentGroup,
      tags: currentGroup.tags.filter(t => t !== tag),
      lastModified: new Date().toISOString()
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentGroup.name) {
      alert('Prosím vyplňte název skupiny');
      return;
    }

    // Převedeme group do správného formátu pro MongoDB
    const groupToSave = {
      ...currentGroup,
      _id: currentGroup._id  // Zachováme MongoDB ID pokud existuje
    };
    
    onSave(groupToSave);
  };

  const filteredContacts = currentGroup.contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(searchLower) ||
      contact.lastName.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.position.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="mr-2" />
          <h1 className="text-2xl font-bold">
            {initialGroup ? 'Upravit skupinu' : 'Nová skupina'}
          </h1>
        </div>
        <Link 
          to="/groups"
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Zpět na seznam
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form onSubmit={handleSubmit}>
          {/* Základní informace o skupině */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Název skupiny</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={currentGroup.name}
              onChange={(e) => setCurrentGroup({...currentGroup, name: e.target.value})}
              placeholder="např. IT Oddělení"
            />
          </div>

          {/* Tagy */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Tagy</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentGroup.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nový tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Import/Export */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importovat CSV
              </label>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportovat CSV
            </button>
          </div>

          {/* Přidání kontaktu */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Přidat kontakt</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={newContact.firstName || ''}
                  onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
                  placeholder="Jméno"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={newContact.lastName || ''}
                  onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
                  placeholder="Příjmení"
                />
              </div>
              <div>
                <input
                  type="email"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={newContact.email || ''}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  placeholder="Email"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={newContact.position || ''}
                  onChange={(e) => setNewContact({...newContact, position: e.target.value})}
                  placeholder="Pozice"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={addContact}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Přidat
                </button>
              </div>
            </div>
          </div>

          {/* Seznam kontaktů */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Seznam kontaktů</h3>
              <div className="flex items-center">
                <Search className="w-4 h-4 mr-2 text-gray-400" />
                <input
                  type="text"
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Hledat..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Jméno</th>
                    <th className="px-4 py-2 text-left">Příjmení</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Pozice</th>
                    <th className="px-4 py-2 text-left">Datum přidání</th>
                    <th className="px-4 py-2 text-right">Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map(contact => (
                    <tr key={contact.id} className="border-t">
                      <td className="px-4 py-2">{contact.firstName}</td>
                      <td className="px-4 py-2">{contact.lastName}</td>
                      <td className="px-4 py-2">{contact.email}</td>
                      <td className="px-4 py-2">{contact.position}</td>
                      <td className="px-4 py-2">{new Date(contact.dateAdded).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeContact(contact.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statistiky */}
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Celkem kontaktů:</span>
                  <span className="ml-2 font-medium">{currentGroup.contacts.length}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Aktivních:</span>
                  <span className="ml-2 font-medium">
                    {currentGroup.contacts.filter(c => c.active).length}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Poslední úprava:</span>
                  <span className="ml-2 font-medium">
                    {new Date(currentGroup.lastModified).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tlačítko pro uložení */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {initialGroup ? 'Uložit změny' : 'Vytvořit skupinu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupDetail;