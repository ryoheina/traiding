import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/register', '/login', '/forgot-password'];
  
  // Admin paths
  const adminPaths = ['/admin'];
  
  // Member paths
  const memberPaths = ['/dashboard', '/profile'];
  
  // Check if path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(publicPath + '/')
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Check if path is admin
  const isAdminPath = adminPaths.some(adminPath => 
    path.startsWith(adminPath)
  );
  
  // Check if path is member
  const isMemberPath = memberPaths.some(memberPath => 
    path.startsWith(memberPath)
  );
  
  // For protected routes, check for session
  // TODO: Implement proper session checking with NextAuth
  const session = request.cookies.get('session');
  
  if (isMemberPath) {
    if (!session) {
      // Redirect to login if no session
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
    
    // TODO: Verify session and check user role/approval status
    // For now, allow access
  }
  
  // Allow admin access without session for now (temporary fix)
  if (isAdminPath) {
    return NextResponse.next();
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
