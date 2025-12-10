import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/user';

async function connectDB() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { firstName, lastName, email, password, skills, country } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !password) {
    return NextResponse.json(
        { success: false, message: "First name, last name, email and password are required" },
        { status: 400 }
    );
}
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists with this email" },
        { status: 400 }
      );
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = new User({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.toLowerCase(),
        password: hashedPassword,
        provider: 'local',
        isActive: true
    });
    
    await user.save();

    // Create session data
    const sessionData = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar || null
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      },
      { status: 201 }
    );

    // Set session cookie
    response.cookies.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}