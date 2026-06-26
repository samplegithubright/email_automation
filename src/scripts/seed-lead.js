const path = require('path');
const { loadEnvConfig } = require('@next/env');

// Load environment variables from .env.local
loadEnvConfig(path.join(__dirname, '../../'));

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined. Please check your .env.local file.');
  process.exit(1);
}

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  requirement: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  aiCategory: { type: String, default: 'AI Automation' },
  aiPriority: { type: String, default: 'High' },
  trackingId: { type: String, required: true },
  emailSent: { type: Boolean, default: true },
  emailSentAt: { type: Date, default: Date.now },
  emailOpened: { type: Boolean, default: false },
  linkClicked: { type: Boolean, default: false },
});

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { dbName: 'email_automation' });
  console.log('Connected successfully!');

  const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

  const mockLead = new Lead({
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    phone: '9876543210',
    company: 'ABC Pvt Ltd',
    requirement: 'Need AI email automation setup for sales team.',
    trackingId: 'seed-tracking-id-12345',
    aiCategory: 'AI Automation',
    aiPriority: 'High',
    createdAt: new Date(),
  });

  await mockLead.save();
  console.log('Mock lead successfully saved to MongoDB Atlas!');

  await mongoose.disconnect();
  console.log('Disconnected.');
}

main().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
