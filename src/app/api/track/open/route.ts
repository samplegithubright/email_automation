import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/lib/models/Lead';

const GIF_BUFFER = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(req: NextRequest) {
  try {
    const trackingId = req.nextUrl.searchParams.get('id');

    if (trackingId) {
      await dbConnect();
      
      const lead = await Lead.findOne({ trackingId });
      if (lead && !lead.emailOpened) {
        lead.emailOpened = true;
        lead.emailOpenedAt = new Date();
        await lead.save();
        console.log(`Email marked as OPENED for trackingId: ${trackingId}`);
      }
    }
  } catch (error) {
    console.error('Error in open tracking route:', error);
  }

  return new NextResponse(GIF_BUFFER, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
