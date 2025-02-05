// src/pages/Groups.tsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GroupList from '../components/GroupList';
import GroupDetail from '../components/GroupDetail';
import { Group } from '../types/group';
import { api } from '../services/api';

const EditGroup: React.FC<{ onSave: (group: Group) => Promise<void> }> = ({ onSave }) => {
  const [group, setGroup] = useState<Group | undefined>(undefined);
  // Add group loading logic here if needed
  return <GroupDetail initialGroup={group} onSave={onSave} />;
};

const Groups: React.FC = () => {
  // Change the type to match the group interface from types/group.ts
  const [groups, setGroups] = useState<Group[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await api.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleSaveGroup = async (group: Group): Promise<void> => {
    try {
      let savedGroup: Group;
      if (group._id) {
        savedGroup = await api.updateGroup(group._id, group);
      } else {
        savedGroup = await api.createGroup(group);
      }

      setGroups(prevGroups => {
        const index = prevGroups.findIndex(g => g._id === savedGroup._id);
        if (index >= 0) {
          const updatedGroups = [...prevGroups];
          updatedGroups[index] = savedGroup;
          return updatedGroups;
        }
        return [...prevGroups, savedGroup];
      });

      navigate('/groups');
    } catch (error) {
      console.error('Error saving group:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route index element={<GroupList groups={groups as any[]} />} />
        <Route path="new" element={<GroupDetail onSave={handleSaveGroup} />} />
        <Route path=":groupId" element={<EditGroup onSave={handleSaveGroup} />} />
      </Routes>
    </div>
  );
};

export default Groups;