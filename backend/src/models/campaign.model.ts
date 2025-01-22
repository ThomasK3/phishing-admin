import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  emailTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' },
  landingPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'LandingPage' },
  targetGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  launchDate: Date,
  sendUntil: Date,
  stats: {
    total: { type: Number, default: 0 },
    sent: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    submitted: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Campaign = mongoose.model('Campaign', campaignSchema);