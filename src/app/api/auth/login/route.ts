import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('[LOGIN] Login attempt started');
    console.log('[LOGIN] Environment check - ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
    
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
      console.log('[LOGIN] User not found in database');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    console.log('[LOGIN] User found:', { id: user.id, email: user.email, approval_status: user.approval_status });

    // Verify password
    console.log('[LOGIN] Verifying password');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log('[LOGIN] Invalid password - password verification failed');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('[LOGIN] Password verified successfully');

    // Check if user is approved (unless admin)
    const isAdmin = email.toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase();
    console.log('[LOGIN] Is admin check:', { isAdmin, userEmail: email, adminEmail: process.env.ADMIN_EMAIL });
    
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

    console.log('[LOGIN] User approved or is admin - proceeding with login');

    // Update last login
    console.log('[LOGIN] Updating last login timestamp');
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );
    console.log('[LOGIN] Last login updated successfully');

    // Create audit log
    console.log('[LOGIN] Creating audit log');
    const ipHeader = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const ip = ipHeader.includes(',') ? ipHeader.split(',')[0].trim() : ipHeader;
    await query(
      `INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        'USER_LOGIN',
        JSON.stringify({ email: user.email }),
        ip,
        request.headers.get('user-agent') || ''
      ]
    );
    console.log('[LOGIN] Audit log created successfully');

    console.log('[LOGIN] Login successful for user:', user.email);
    
    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        approvalStatus: user.approval_status,
        role: isAdmin ? 'admin' : 'member'
      }
    });
    
    // Set session cookie
    response.cookies.set('session', JSON.stringify({ userId: user.id }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    // Also set non-httpOnly cookie for client-side access
    response.cookies.set('user_session', JSON.stringify({ 
      userId: user.id, 
      email: user.email,
      approvalStatus: user.approval_status 
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;

  } catch (error: any) {
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
