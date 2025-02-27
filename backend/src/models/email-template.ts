import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema({
  internalName: { type: String, required: true },
  envelopeSender: { type: String, required: true },
  displayName: String,
  replyTo: String,
  subject: { type: String, required: true },
  content: { 
    type: String, 
    required: true,
    // Zvětšíme max velikost pro HTML obsah
    maxLength: 100000  // Nastavíme větší limit pro HTML
  },
  isHTML: { 
    type: Boolean, 
    default: true  // Změníme default na true
  },
  hasTrackingPixel: { type: Boolean, default: false },
  priority: { 
    type: String,
    enum: ['normal', 'high', 'low'],
    default: 'normal'
  },
  language: {
    type: String,
    enum: ['cs', 'en'],
    default: 'cs'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);