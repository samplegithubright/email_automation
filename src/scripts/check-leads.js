const mongoose = require('mongoose');

// MongoDB Atlas URI loaded from env or fallback
const MONGODB_URI = "mongodb+srv://chandan:5UZKaJYsuW96682d@cluster0.im8vmoe.mongodb.net/?appName=Cluster0";

const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  requirement: String,
  createdAt: Date,
  aiCategory: String,
  aiPriority: String,
  emailSent: Boolean,
  emailOpened: Boolean,
  linkClicked: Boolean,
});

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { dbName: 'email_automation' });
  console.log('Connected successfully!');

  const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

  const count = await Lead.countDocuments({});
  console.log(`\nTotal Leads in Database: ${count}`);

  if (count > 0) {
    const leads = await Lead.find({}).sort({ createdAt: -1 }).limit(5);
    console.log('\n--- Recent Leads in Database ---');
    leads.forEach((lead, i) => {
      console.log(`\n[Lead #${i+1}]`);
      console.log(`Name: ${lead.name}`);
      console.log(`Email: ${lead.email}`);
      console.log(`Phone: ${lead.phone}`);
      console.log(`Company: ${lead.company || 'N/A'}`);
      console.log(`Requirement: "${lead.requirement}"`);
      console.log(`Created At: ${lead.createdAt}`);
      console.log(`AI Category: ${lead.aiCategory} (Priority: ${lead.aiPriority})`);
      console.log(`Status: Sent: ${lead.emailSent}, Opened: ${lead.emailOpened}, Clicked: ${lead.linkClicked}`);
    });
  } else {
    console.log('No leads found in the database. Submit a lead at http://localhost:3000 first!');
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

main().catch(err => {
  console.error('Error querying database:', err);
  process.exit(1);
});
