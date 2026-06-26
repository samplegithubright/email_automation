import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/lib/models/Lead';

export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();

    const [totalLeads, emailsSent, emailsOpened, linksClicked, leads] = await Promise.all([
      Lead.countDocuments({}),
      Lead.countDocuments({ emailSent: true }),
      Lead.countDocuments({ emailOpened: true }),
      Lead.countDocuments({ linkClicked: true }),
      Lead.find({}).sort({ createdAt: -1 }),
    ]);

    const openRate = emailsSent > 0 ? Math.round((emailsOpened / emailsSent) * 100) : 0;
    const clickRate = emailsSent > 0 ? Math.round((linksClicked / emailsSent) * 100) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        emailsSent,
        emailsOpened,
        linksClicked,
        openRate,
        clickRate,
      },
      leads,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
