import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('[ADMIN-USERS] Fetching all users');
    
    // Get all users with their details
    const usersResult = await query(
      `SELECT id, full_name, email, phone, approval_status, created_at, device_info, browser_info, ip_address
       FROM users
       ORDER BY created_at DESC`
    );
    
    console.log('[ADMIN-USERS] Found', usersResult.rows.length, 'users');
    
    // Log detailed user information for verification
    console.log('[ADMIN-USERS] User IDs returned:', usersResult.rows.map(u => u.id));
    console.log('[ADMIN-USERS] Approval statuses returned:', usersResult.rows.map(u => ({ id: u.id, status: u.approval_status })));

    // Get statistics
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE approval_status = 'approved') as approved,
        COUNT(*) FILTER (WHERE approval_status = 'pending') as pending,
        COUNT(*) FILTER (WHERE approval_status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE approval_status = 'suspended') as suspended
      FROM users
    `);
    
    console.log('[ADMIN-USERS] Stats:', statsResult.rows[0]);

    const response = NextResponse.json({
      users: usersResult.rows,
      stats: statsResult.rows[0]
    });
    
    // Disable caching for this endpoint
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('[ADMIN-USERS] Failed to fetch users:', error.message);
    console.error('[ADMIN-USERS] Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}
