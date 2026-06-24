import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all users with their details
    const usersResult = await query(
      `SELECT id, full_name, email, phone, approval_status, created_at, device_info, browser_info, ip_address
       FROM users
       ORDER BY created_at DESC`
    );

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

    return NextResponse.json({
      users: usersResult.rows,
      stats: statsResult.rows[0]
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
