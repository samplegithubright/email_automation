import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Lead from '@/lib/models/Lead';
import { classifyLead } from '@/lib/classifier';
import { sendLeadEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, requirement } = await req.json();

    if (!name || !email || !phone || !requirement) {
      return NextResponse.json(
        { error: 'Name, Email, Phone, and Requirement are required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const trackingId = crypto.randomUUID();
    const classification = await classifyLead(requirement);

    const newLead = new Lead({
      name,
      email,
      phone,
      company: company || '',
      requirement,
      trackingId,
      aiCategory: classification.category,
      aiPriority: classification.priority,
      createdAt: new Date(),
    });

    await newLead.save();

    const emailResult = await sendLeadEmail({
      name,
      email,
      requirement,
      trackingId,
      origin: req.nextUrl.origin,
    });

    if (emailResult.success) {
      newLead.emailSent = true;
      newLead.emailSentAt = new Date();
      if (emailResult.previewUrl) {
        newLead.emailPreviewUrl = emailResult.previewUrl;
      }
      await newLead.save();
    } else {
      console.error('Email failed to send for trackingId:', trackingId, emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully and email sent.',
      lead: {
        id: newLead._id,
        name: newLead.name,
        category: newLead.aiCategory,
        priority: newLead.aiPriority,
        emailPreviewUrl: newLead.emailPreviewUrl,
      },
    });
  } catch (error: any) {
    console.error('API Error in capturing lead:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json(
        { error: 'Lead not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully.',
    });
  } catch (error: any) {
    console.error('API Error in deleting lead:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
