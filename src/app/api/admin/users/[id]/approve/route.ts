import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendApprovalEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action } = body;
    const userId = parseInt(params.id);

    if (!["approve", "reject", "suspend"].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get user details
    const userResult = await query(
      'SELECT email, full_name FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Update user status
    const statusMap = {
      approve: 'approved',
      reject: 'rejected',
      suspend: 'suspended'
    };

    await query(
      'UPDATE users SET approval_status = $1 WHERE id = $2',
      [statusMap[action as keyof typeof statusMap], userId]
    );

    // Create audit log
    await query(
      `INSERT INTO audit_logs (user_id, action, details)
       VALUES ($1, $2, $3)`,
      [
        userId,
        `USER_${action.toUpperCase()}`,
        JSON.stringify({ email: user.email, action })
      ]
    );

    // Send email notification to user about status change (optional - don't fail if this doesn't work)
    try {
      await sendApprovalEmail(user.email, user.full_name, action as 'approved' | 'rejected' | 'suspended');
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: `User ${action}d successfully`
    });

  } catch (error) {
    console.error('Failed to update user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}
