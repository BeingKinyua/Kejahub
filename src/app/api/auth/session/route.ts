import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('kejahub_session');
  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
