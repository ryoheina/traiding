import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Only allow these paths
  const allowedPaths = ['/', '/register', '/login', '/forgot-password', '/admin', '/register/success', '/team'];
  
  // Check if path is allowed
  const isAllowedPath = allowedPaths.some(allowedPath => 
    path === allowedPath || path.startsWith(allowedPath + '/')
  );
  
  if (!isAllowedPath) {
    // Redirect to home for all other paths
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes that handle their own auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
