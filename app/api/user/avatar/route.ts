import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { cookies } from 'next/headers';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {mkdir} from 'fs/promises';

// POST - Upload avatar
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const sessionData = JSON.parse(userSession.value);
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPG, PNG, and GIF are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user to check for old avatar
    const user = await User.findById(sessionData.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Delete old avatar if exists
    if (user.avatar && !user.avatar.startsWith('http')) {
      try {
        const oldAvatarPath = path.join(process.cwd(), 'public', user.avatar);
        await unlink(oldAvatarPath);
      } catch (err) {
        console.error('Error deleting old avatar:', err);
      }
    }

    // Generate unique filename
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const avatarPath = `/uploads/avatars/${filename}`;
    const fullPath = path.join(process.cwd(), 'public', avatarPath);

    // Create directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    try {
    await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
    // Directory might already exist
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(fullPath, buffer);

    // Update user
    user.avatar = avatarPath;
    await user.save();

    // Update session
    const updatedSession = {
      ...sessionData,
      avatar: avatarPath
    };

    cookieStore.set('user_session', JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar: avatarPath
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove avatar
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
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

    // Update user
    user.avatar = null;
    await user.save();

    // Update session
    const updatedSession = {
      ...sessionData,
      avatar: null
    };

    cookieStore.set('user_session', JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Avatar removed successfully'
    });
  } catch (error) {
    console.error('Remove avatar error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}