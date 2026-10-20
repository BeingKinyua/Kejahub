import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const newUser = {
      id: 'usr-landlord-' + Date.now().toString(36),
      name,
      email,
      role: 'LANDLORD',
      isAuthenticated: true,
      onboardingStatus: 'in_progress',
      workspaceId: 'ws-' + Date.now().toString(36),
    };

    const res = NextResponse.json({
      success: true,
      user: newUser,
      message: 'Account successfully registered. Beginning landlord onboarding.',
    });

    res.cookies.set('kejahub_session', JSON.stringify({ userId: newUser.id, email: newUser.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
