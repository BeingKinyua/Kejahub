import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role = 'LANDLORD', isDemo = false } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const isDemoAccount = isDemo || email.includes('david.mwangi') || email.includes('sarah.omondi');

    const user = {
      id: isDemoAccount ? 'usr-demo-david' : 'usr-' + Math.random().toString(36).substring(2, 9),
      name: isDemoAccount
        ? (role === 'PROPERTY_MANAGER' ? 'Sarah Omondi' : 'David Mwangi')
        : email.split('@')[0].replace(/[._-]/g, ' '),
      email,
      role: isDemoAccount ? role : 'LANDLORD',
      isAuthenticated: true,
      onboardingStatus: isDemoAccount ? 'completed' : 'completed',
    };

    const res = NextResponse.json({ success: true, user });
    res.cookies.set('kejahub_session', JSON.stringify({ userId: user.id, email: user.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
