import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendApprovalEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[ADMIN-APPROVE] Approval action started');
    const body = await request.json();
    const { action } = body;
    const userId = parseInt(params.id);

    console.log('[ADMIN-APPROVE] User ID:', userId, 'Action:', action);

    if (!["approve", "reject", "suspend"].includes(action)) {
      console.log('[ADMIN-APPROVE] Invalid action:', action);
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get user details
    console.log('[ADMIN-APPROVE] Fetching user details');
    const userResult = await query(
      'SELECT email, full_name FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      console.log('[ADMIN-APPROVE] User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];
    console.log('[ADMIN-APPROVE] User found:', user.email);

    // Update user status
    const statusMap = {
      approve: 'approved',
      reject: 'rejected',
      suspend: 'suspended'
    };

    console.log('[ADMIN-APPROVE] Updating user status to:', statusMap[action as keyof typeof statusMap]);
    await query(
      'UPDATE users SET approval_status = $1 WHERE id = $2',
      [statusMap[action as keyof typeof statusMap], userId]
    );
    console.log('[ADMIN-APPROVE] User status updated successfully');

    // Create audit log
    console.log('[ADMIN-APPROVE] Creating audit log');
    await query(
      `INSERT INTO audit_logs (user_id, action, details)
       VALUES ($1, $2, $3)`,
      [
        userId,
        `USER_${action.toUpperCase()}`,
        JSON.stringify({ email: user.email, action })
      ]
    );
    console.log('[ADMIN-APPROVE] Audit log created');

    // Send email notification to user about status change (optional - don't fail if this doesn't work)
    try {
      console.log('[ADMIN-APPROVE] Sending email notification to user:', user.email);
      const emailSent = await sendApprovalEmail(user.email, user.full_name, action as 'approved' | 'rejected' | 'suspended');
      if (emailSent) {
        console.log('[ADMIN-APPROVE] Email notification sent successfully to:', user.email);
      } else {
        console.log('[ADMIN-APPROVE] Email notification skipped (SMTP not configured or failed)');
      }
    } catch (emailError: any) {
      console.error('[ADMIN-APPROVE] Failed to send approval email:', emailError.message);
    }

    console.log('[ADMIN-APPROVE] Action completed successfully');
    return NextResponse.json({
      success: true,
      message: `User ${action}d successfully`
    });

  } catch (error: any) {
    console.error('[ADMIN-APPROVE] Failed to update user status:', error.message);
    console.error('[ADMIN-APPROVE] Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to update user status', details: error.message },
      { status: 500 }
    );
  }
}
