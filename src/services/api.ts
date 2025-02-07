import { Contact, Group } from '../types/group';

const API_BASE = 'http://localhost:3001/api';

export const api = {
    // Kampaně
    async getCampaigns() {
      const response = await fetch(`${API_BASE}/campaigns`);
      return response.json();
    },
  
    async createCampaign(data: any) {
      const response = await fetch(`${API_BASE}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  
    // Landing Pages
    async getLandingPages() {
      const response = await fetch(`${API_BASE}/landing-pages`);
      return response.json();
    },

    
  // Groups endpoints
  async getGroups() {
    const response = await fetch(`${API_BASE}/groups`);
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }
    return response.json();
  },

  async createGroup(data: any) {
    const response = await fetch(`${API_BASE}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create group');
    }
    return response.json();
  },

  async updateGroup(id: string, data: any) {
    const response = await fetch(`${API_BASE}/groups/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update group');
    }
    return response.json();
  },

  async updateGroupContact(groupId: string, contacts: Contact[]) {
    const response = await fetch(`${API_BASE}/groups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contacts }),
    });
    if (!response.ok) {
      throw new Error('Failed to update group contacts');
    }
    return response.json();
  },

  getGroupById: async (id: string) => {
    const response = await fetch(`${API_BASE}/groups/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch group');
    }
    return response.json();
  },

  deleteGroup: async (id: string) => {
    const response = await fetch(`${API_BASE}/groups/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete group');
    }
    return response.json();
  },

  // Email Templates endpoints
  async getEmailTemplates() {
    const response = await fetch(`${API_BASE}/email-templates`);
    if (!response.ok) {
      throw new Error('Failed to fetch email templates');
    }
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
    if (!response.ok) {
      throw new Error('Failed to create email template');
    }
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
    if (!response.ok) {
      throw new Error('Failed to update email template');
    }
    return response.json();
  },

  async deleteEmailTemplate(id: string) {
    const response = await fetch(`${API_BASE}/email-templates/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete email template');
    }
    return response.json();
  },
    // Sending Profiles
    async getSendingProfiles() {
      const response = await fetch(`${API_BASE}/sending-profiles`);
      return response.json();
    },
  
    async createSendingProfile(data: any) {
      const response = await fetch(`${API_BASE}/sending-profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  
    async updateSendingProfile(id: string, data: any) {
      const response = await fetch(`${API_BASE}/sending-profiles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  
    async deleteSendingProfile(id: string) {
      const response = await fetch(`${API_BASE}/sending-profiles/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    }
};