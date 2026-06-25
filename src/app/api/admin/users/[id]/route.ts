import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[ADMIN-DELETE] Delete action started');
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      console.log('[ADMIN-DELETE] Invalid user ID:', params.id);
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    console.log('[ADMIN-DELETE] Deleting user:', userId);

    // Check if user exists
    const userResult = await query(
      'SELECT email, full_name FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      console.log('[ADMIN-DELETE] User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];
    console.log('[ADMIN-DELETE] User found:', { id: userId, email: user.email });

    // Delete user
    const deleteResult = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );

    if (deleteResult.rows.length === 0) {
      console.error('[ADMIN-DELETE] Failed to delete user - no rows returned');
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    console.log('[ADMIN-DELETE] User deleted successfully:', { userId: deleteResult.rows[0].id });

    const response = NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

    // Disable caching for this endpoint
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error: any) {
    console.error('[ADMIN-DELETE] Failed to delete user:', error.message);
    console.error('[ADMIN-DELETE] Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}
