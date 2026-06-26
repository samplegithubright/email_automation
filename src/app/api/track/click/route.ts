import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/lib/models/Lead';

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const trackingId = req.nextUrl.searchParams.get('id');

  let name = '';

  try {
    if (trackingId) {
      await dbConnect();
      
      const lead = await Lead.findOne({ trackingId });
      if (lead) {
        name = lead.name;
        if (!lead.linkClicked) {
          lead.linkClicked = true;
          lead.linkClickedAt = new Date();
          
          if (!lead.emailOpened) {
            lead.emailOpened = true;
            lead.emailOpenedAt = new Date();
          }
          
          await lead.save();
          console.log(`Link marked as CLICKED for trackingId: ${trackingId}`);
        }
      }
    }
  } catch (error) {
    console.error('Error in click tracking route:', error);
  }

  const redirectUrl = name 
    ? `${origin}/thank-you?name=${encodeURIComponent(name)}`
    : `${origin}/thank-you`;

  return NextResponse.redirect(redirectUrl);
}
