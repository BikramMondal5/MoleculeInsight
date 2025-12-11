import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { cookies } from 'next/headers';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(request: NextRequest) {
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
    await dbConnect();

    const user = await User.findById(sessionData.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Delete avatar file if exists (but not Google avatars)
    if (user.avatar && !user.avatar.startsWith('http')) {
      try {
        const avatarPath = path.join(process.cwd(), 'public', user.avatar);
        await unlink(avatarPath);
      } catch (err) {
        console.error('Error deleting avatar file:', err);
      }
    }

    // Delete user
    await User.findByIdAndDelete(sessionData.userId);

    // Clear session cookie
    cookieStore.delete('user_session');

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}