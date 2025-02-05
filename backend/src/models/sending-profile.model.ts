// src/models/sending-profile.model.ts
import mongoose from 'mongoose';

const sendingProfileSchema = new mongoose.Schema({
  profileName: { type: String, required: true },
  interfaceType: { 
    type: String, 
    enum: ['SMTP'],
    default: 'SMTP'
  },
  smtpFrom: { type: String, required: true },
  host: { type: String, required: true },
  port: { type: Number, default: 587 },
  username: { type: String, required: true },
  password: { type: String, required: true },
  useTLS: { type: Boolean, default: true },
  headers: [{
    key: String,
    value: String
  }],
  // Pokročilé vlastnosti
  replyToAddress: String,
  spoofedDomain: String,
  customBoundary: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const SendingProfile = mongoose.model('SendingProfile', sendingProfileSchema);