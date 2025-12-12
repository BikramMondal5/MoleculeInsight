import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import User from '@/models/user';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = JSON.parse(userSession.value);
    const { feedback, rating, country, userType } = await request.json();

    await dbConnect();

    const user = await User.findById(userData.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newFeedback = await Feedback.create({
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    userAvatar: user.avatar,
    userType: userType || 'User',
    country: country || 'Unknown',
    feedback,
    rating,
    isApproved: true,
    });

    return NextResponse.json({ success: true, feedback: newFeedback }, { status: 201 });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}