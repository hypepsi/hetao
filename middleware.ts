import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('hetaolog-auth')
  const isLoginPage = request.nextUrl.pathname === '/login'

  // 如果未登录且不在登录页，重定向到登录页
  if (!authCookie && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 如果已登录且在登录页，重定向到首页
  if (authCookie && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest|icon-|sw.js).*)'],
}






