import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
const { pathname } = request.nextUrl

// Allow OG image + metadata routes without auth
if (
  pathname.startsWith('/api/og') ||
  pathname === '/' // allow homepage for validator
) {
  return NextResponse.next()
}
  
  const basicAuth = request.headers.get('authorization')

  const username = 'admin'
  const password = 'vireka'

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pass] = atob(authValue).split(':')

    if (user === username && pass === password) {
      return NextResponse.next()
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
