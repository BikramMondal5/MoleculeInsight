import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/user';

async function connectDB() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (error || !code) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
    }

    // Exchange code for tokens
    const tokenParams = new URLSearchParams();
    tokenParams.append('client_id', process.env.GOOGLE_CLIENT_ID as string);
    tokenParams.append('client_secret', process.env.GOOGLE_CLIENT_SECRET as string);
    tokenParams.append('code', code);
    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('redirect_uri', `${process.env.NEXTAUTH_URL || 'https://molecule-insight.vercel.app'}/api/auth/callback/google`);

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams,
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info from Google
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`);
    const googleUser = await userResponse.json();

    // Check if user exists
    let user = await User.findOne({
      $or: [
        { googleId: googleUser.id },
        { email: googleUser.email.toLowerCase() }
      ]
    });

    const isSignUpFlow = state === 'signup';
    let isNewUser = false;

    if (!user) {
      // User doesn't exist
      if (!isSignUpFlow) {
        // Trying to sign in but no account exists
        return NextResponse.redirect(new URL('/login?error=no_account', request.url));
      }

      // Create new user (sign up flow)
      isNewUser = true;
      const nameParts = googleUser.name.split(' ');
      const firstName = nameParts[0] || googleUser.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      user = new User({
        googleId: googleUser.id,
        email: googleUser.email.toLowerCase(),
        name: googleUser.name,
        firstName,
        lastName,
        avatar: googleUser.picture,
        provider: 'google',
        isActive: true,
      });
      await user.save();
    } else {
      //User check
      if (isSignUpFlow) {
        // Check if user registered with local provider
        if (user.provider === 'local') {
          return NextResponse.redirect(new URL('/sign-up?error=local_account_exists', request.url));
        }
        // Trying to sign up but account already exists with Google
        return NextResponse.redirect(new URL('/login?error=account_exists', request.url));
      }

      // Sign in flow - check if user registered with local provider
      if (user.provider === 'local') {
        return NextResponse.redirect(new URL('/login?error=use_local_signin', request.url));
      }

      // Update user info for Google sign-in
      if (!user.googleId) {
        user.googleId = googleUser.id;
      }

      if (user.avatar === undefined) {
        user.avatar = googleUser.picture;
      }

      user.lastLogin = new Date();
      await user.save();
    }

    // Create session
    const sessionData = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar
    };

    const successParam = isNewUser ? 'registered' : 'signin';
    const response = NextResponse.redirect(new URL(`/?${successParam}=true`, request.nextUrl.origin));

    response.cookies.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('OAuth callback error:', error);
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }
}