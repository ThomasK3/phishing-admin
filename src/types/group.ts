// src/types/group.ts
export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    active: boolean;
    dateAdded: string;
  }
  
  export interface Group {
    _id?: string;  // MongoDB ID
    id?: string;   // Frontend ID
    name: string;
    tags: string[];
    contacts: Contact[];
    lastModified: string;
  }