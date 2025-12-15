import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isSignUp = searchParams.get('signup') === 'true';

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: `${process.env.NEXTAUTH_URL || 'https://molecule-insight.vercel.app'}/api/auth/callback/google`,
    scope: 'openid profile email',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    state: isSignUp ? 'signup' : 'signin'
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?${params}`;
  return NextResponse.redirect(googleAuthUrl);
}