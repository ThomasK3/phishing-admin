// src/pages/EmailTemplates.tsx
import React from 'react';
import EmailTemplateEditor from '../components/EmailTemplateEditor.tsx';

const EmailTemplates: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <EmailTemplateEditor />
    </div>
  );
};

export default EmailTemplates;