import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import GroupList from '../components/GroupList.tsx';
import GroupDetail from '../components/GroupDetail.tsx';

interface Group {
  id: string;
  name: string;
  tags: string[];
  contacts: any[];
  lastModified: string;
}

// Komponenta pro editaci existující skupiny
const EditGroup: React.FC<{ groups: Group[], onSave: (group: Group) => void }> = ({ groups, onSave }) => {
  const { groupId } = useParams();
  const group = groups.find(g => g.id === groupId);

  if (!group) {
    return <div className="p-6">Skupina nenalezena</div>;
  }

  return <GroupDetail initialGroup={group} onSave={onSave} />;
};

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const navigate = useNavigate();

  const handleSaveGroup = (group: Group) => {
    const existingIndex = groups.findIndex(g => g.id === group.id);
    
    if (existingIndex >= 0) {
      // Aktualizace existující skupiny
      const updatedGroups = [...groups];
      updatedGroups[existingIndex] = group;
      setGroups(updatedGroups);
    } else {
      // Přidání nové skupiny
      setGroups([...groups, { ...group, id: Math.random().toString(36).substr(2, 9) }]);
    }
    
    navigate('/groups');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route index element={<GroupList groups={groups} />} />
        <Route 
          path="new" 
          element={<GroupDetail onSave={handleSaveGroup} />} 
        />
        <Route 
          path=":groupId" 
          element={<EditGroup groups={groups} onSave={handleSaveGroup} />} 
        />
      </Routes>
    </div>
  );
};

export default Groups;