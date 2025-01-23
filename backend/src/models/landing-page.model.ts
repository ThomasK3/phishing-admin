import mongoose from 'mongoose';

const landingPageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  html: { type: String, required: true },
  css: String,
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'draft'
  },
  type: {
    type: String,
    enum: ['custom', 'imported'],
    default: 'custom'
  },
  captureData: { type: Boolean, default: true },
  captureFields: [String],
  redirectUrl: String,
  visits: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const LandingPage = mongoose.model('LandingPage', landingPageSchema);