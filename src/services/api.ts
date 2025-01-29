const API_BASE = 'http://localhost:3001/api';

export const api = {
  // Email Templates
  async getEmailTemplates() {
    const response = await fetch(`${API_BASE}/email-templates`);
    return response.json();
  },

  async createEmailTemplate(data: any) {
    const response = await fetch(`${API_BASE}/email-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateEmailTemplate(id: string, data: any) {
    const response = await fetch(`${API_BASE}/email-templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteEmailTemplate(id: string) {
    const response = await fetch(`${API_BASE}/email-templates/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};