// backend/src/models/group.model.ts
import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tags: [String],
  contacts: [{
    id: { type: String, required: true },  // přidáme id pro každý kontakt
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    position: String,
    active: { type: Boolean, default: true },
    dateAdded: { type: Date, default: Date.now }
  }],
  lastModified: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const Group = mongoose.model('Group', groupSchema);