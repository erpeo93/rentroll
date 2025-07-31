import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { secret } = await req.json();

  if (secret === process.env.ADMIN_SECRET) {
    const response = NextResponse.json({ success: true });
    // Set cookie via response cookies API:
    response.cookies.set({
      name: 'admin_auth',
      value: secret,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours in seconds
      sameSite: 'lax',  // optional but recommended
      secure: process.env.NODE_ENV === 'production', // cookie secure in prod
    });
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}