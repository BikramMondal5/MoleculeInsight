import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';

export async function GET() {
  try {
    await dbConnect();
    
    const feedbacks = await Feedback.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (error) {
    console.error('Fetch feedbacks error:', error);
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}