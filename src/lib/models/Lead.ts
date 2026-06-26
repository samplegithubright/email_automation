import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  requirement: string;
  createdAt: Date;
  aiCategory: string;
  aiPriority: 'Low' | 'Medium' | 'High';
  trackingId: string;
  emailSent: boolean;
  emailSentAt?: Date;
  emailOpened: boolean;
  emailOpenedAt?: Date;
  linkClicked: boolean;
  linkClickedAt?: Date;
  emailPreviewUrl?: string;
}

const LeadSchema: Schema = new Schema<ILead>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  requirement: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  aiCategory: { type: String, default: 'General Inquiry' },
  aiPriority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  trackingId: { type: String, required: true, unique: true },
  emailSent: { type: Boolean, default: false },
  emailSentAt: { type: Date },
  emailOpened: { type: Boolean, default: false },
  emailOpenedAt: { type: Date },
  linkClicked: { type: Boolean, default: false },
  linkClickedAt: { type: Date },
  emailPreviewUrl: { type: String },
});

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
