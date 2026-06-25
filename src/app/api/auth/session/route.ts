import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('[SESSION] Checking user session');
    
    // Check if user has a valid session
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      console.log('[SESSION] No session cookie found');
      return NextResponse.json({ user: null });
    }

    console.log('[SESSION] Session cookie found');

    // Parse session and get user info
    const sessionData = JSON.parse(sessionCookie.value);
    console.log('[SESSION] Session data:', { userId: sessionData.userId });
    
    if (!sessionData.userId) {
      console.log('[SESSION] No userId in session data');
      return NextResponse.json({ user: null });
    }

    // Fetch user from database
    const result = await query(
      'SELECT id, full_name, email, approval_status FROM users WHERE id = $1',
      [sessionData.userId]
    );

    if (result.rows.length === 0) {
      console.log('[SESSION] User not found in database');
      return NextResponse.json({ user: null });
    }

    const user = result.rows[0];
    console.log('[SESSION] User found:', { id: user.id, email: user.email, approval_status: user.approval_status });

    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error('[SESSION] Failed to check session:', error);
    return NextResponse.json({ user: null });
  }
}
