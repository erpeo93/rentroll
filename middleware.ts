import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin')
  const adminCookie = req.cookies.get('admin_auth')?.value

  if (isAdminPath && adminCookie !== process.env.ADMIN_SECRET) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/admin-login'
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}