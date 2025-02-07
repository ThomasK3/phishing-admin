import React, { useState } from 'react';
import { Users, Plus, Tag, ChevronRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Group } from '../types/group';
import { api } from '../services/api';

interface GroupListProps {
  groups: Group[];
  onGroupDeleted?: () => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onGroupDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteGroup = async (id: string) => {
    if (!window.confirm('Opravdu chcete smazat tuto skupinu? Tato akce je nevratná.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.deleteGroup(id);
      if (onGroupDeleted) {
        onGroupDeleted();
      }
    } catch (error) {
      console.error('Chyba při mazání skupiny:', error);
      alert('Nepodařilo se smazat skupinu');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="mr-2" />
          <h1 className="text-2xl font-bold">Skupiny kontaktů</h1>
        </div>
        <Link 
          to="/groups/new" 
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nová skupina
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        {groups.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Žádné skupiny</h3>
            <p className="text-gray-500 mb-4">Zatím nebyly vytvořeny žádné skupiny kontaktů.</p>
            <Link 
              to="/groups/new"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Vytvořit první skupinu
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {groups.map(group => (
              <div key={group.id} className="p-6 hover:bg-gray-50 flex justify-between items-start">
                <Link 
                  to={`/groups/${group.id}`}
                  className="flex-1"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{group.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Users className="w-4 h-4 mr-1" />
                      {group.contacts?.length || 0} kontaktů
                      <span className="mx-2">•</span>
                      Upraveno {new Date(group.lastModified).toLocaleDateString()}
                    </div>
                    {group.tags && group.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {group.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    disabled={isDeleting}
                    className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                    title="Smazat skupinu"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;