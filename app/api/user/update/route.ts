import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore =await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const sessionData = JSON.parse(userSession.value);
    const { name } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      sessionData.userId,
      { 
        name: name.trim(),
        $set: { lastLogin: new Date() }
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Update session cookie with new name
    const updatedSession = {
      ...sessionData,
      name: user.name
    };

    cookieStore.set('user_session', JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Name updated successfully',
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update name error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}