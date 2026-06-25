import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if user has a valid session
    // For now, we'll use a simple cookie-based approach
    // In production, you'd use proper session management
    
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    // Parse session and get user info
    // This is a simplified version - in production use proper JWT or session store
    const sessionData = JSON.parse(sessionCookie.value);
    
    if (!sessionData.userId) {
      return NextResponse.json({ user: null });
    }

    // Fetch user from database
    const result = await query(
      'SELECT id, full_name, email, approval_status FROM users WHERE id = $1',
      [sessionData.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error('[SESSION] Failed to check session:', error);
    return NextResponse.json({ user: null });
  }
}
