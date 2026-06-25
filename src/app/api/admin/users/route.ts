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

    return NextResponse.json({
      users: usersResult.rows,
      stats: statsResult.rows[0]
    });
  } catch (error: any) {
    console.error('[ADMIN-USERS] Failed to fetch users:', error.message);
    console.error('[ADMIN-USERS] Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}
