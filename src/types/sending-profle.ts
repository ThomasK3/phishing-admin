// src/types/sending-profile.ts
export interface SendingProfile {
    id: number;
    profileName: string;
    interfaceType: 'SMTP';
    smtpFrom: string;
    host: string;
    port: number;
    username: string;
    password: string;
    useTLS: boolean;
    headers: {
      key: string;
      value: string;
    }[];
    replyToAddress: string;
    spoofedDomain: string;
    customBoundary: string;
  }