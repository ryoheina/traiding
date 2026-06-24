import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('[LOGIN] Login attempt started');
    const body = await request.json();
    const { email, password } = body;

    console.log('[LOGIN] Email:', email);

    // Validate input
    if (!email || !password) {
      console.log('[LOGIN] Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    console.log('[LOGIN] Querying database for user');
    const result = await query(
      'SELECT id, full_name, email, password_hash, approval_status FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      console.log('[LOGIN] User not found');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    console.log('[LOGIN] User found:', user.email, 'Approval status:', user.approval_status);

    // Verify password
    console.log('[LOGIN] Verifying password');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log('[LOGIN] Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('[LOGIN] Password valid');

    // Check if user is approved (unless admin)
    const isAdmin = email === process.env.ADMIN_EMAIL;
    if (!isAdmin && user.approval_status !== 'approved') {
      console.log('[LOGIN] Account not approved:', user.approval_status);
      return NextResponse.json(
        {
          error: `Account ${user.approval_status}. Please contact admin for approval.`,
          user: {
            id: user.id,
            email: user.email,
            approval_status: user.approval_status
          }
        },
        { status: 403 }
      );
    }

    console.log('[LOGIN] User approved/admin');

    // Update last login
    console.log('[LOGIN] Updating last login');
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Create audit log
    console.log('[LOGIN] Creating audit log');
    await query(
      `INSERT INTO audit_logs (user_id, action, details)
       VALUES ($1, $2, $3)`,
      [
        user.id,
        'USER_LOGIN',
        JSON.stringify({ email: user.email })
      ]
    );

    console.log('[LOGIN] Login successful');
    // TODO: Set up session with NextAuth
    // For now, return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        approvalStatus: user.approval_status,
        role: isAdmin ? 'admin' : 'member'
      }
    });

  } catch (error) {
    console.error('[LOGIN] Error:', error);
    console.error('[LOGIN] Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('[LOGIN] Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
