import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const userData = JSON.parse(userSession.value);
   
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData.userId,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}