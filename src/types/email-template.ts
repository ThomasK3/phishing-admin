export interface EmailTemplate {
    id: number;
    internalName: string;
    envelopeSender: string;
    displayName: string;
    replyTo: string;
    subject: string;
    content: string;
    isHTML: boolean;
    hasTrackingPixel: boolean;
    attachments: File[];
    priority: 'normal' | 'high' | 'low';
    language: 'cs' | 'en';
    scheduledTime: string;
    includeFakeForward: boolean;
    fakeForwardFrom: string;
}