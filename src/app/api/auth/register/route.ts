import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { sendNewRegistrationNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    console.log('[REGISTER] Registration attempt started');
    const body = await request.json();
    const { fullName, email, phone, password } = body;

    console.log('[REGISTER] Email:', email, 'Phone:', phone);

    // Validate input
    if (!fullName || !email || !phone || !password) {
      console.log('[REGISTER] Missing required fields');
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('[REGISTER] Checking for existing user');
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existingUser.rows.length > 0) {
      console.log('[REGISTER] User already exists');
      return NextResponse.json(
        { error: 'User with this email or phone already exists' },
        { status: 409 }
      );
    }

    // Hash password
    console.log('[REGISTER] Hashing password');
    const passwordHash = await bcrypt.hash(password, 12);

    // Get device and browser info
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Insert user
    console.log('[REGISTER] Inserting user into database');
    const result = await query(
      `INSERT INTO users (full_name, email, phone, password_hash, device_info, browser_info, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, full_name, email, approval_status`,
      [
        fullName,
        email.toLowerCase(),
        phone,
        passwordHash,
        JSON.stringify({ type: 'web' }),
        JSON.stringify({ userAgent }),
        ip
      ]
    );

    const user = result.rows[0];
    console.log('[REGISTER] User created:', user.id, user.email);

    // Create audit log
    console.log('[REGISTER] Creating audit log');
    await query(
      `INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        'USER_REGISTRATION',
        JSON.stringify({ email: user.email }),
        ip,
        userAgent
      ]
    );

    // Create notification for admin (optional - don't fail if this doesn't work)
    try {
      console.log('[REGISTER] Creating admin notification');
      await query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (
           (SELECT id FROM users WHERE email = $1),
           $2, $3, $4
         )`,
        [
          process.env.ADMIN_EMAIL,
          'New Registration',
          `New user registration: ${user.email} (${user.full_name})`,
          'info'
        ]
      );
    } catch (notificationError) {
      console.error('[REGISTER] Failed to create notification:', notificationError);
    }

    // Send email notification to admin (optional - don't fail if this doesn't work)
    try {
      console.log('[REGISTER] Sending email notification');
      await sendNewRegistrationNotification(
        process.env.ADMIN_EMAIL || '',
        user.email,
        user.full_name
      );
    } catch (emailError) {
      console.error('[REGISTER] Failed to send email notification:', emailError);
    }

    console.log('[REGISTER] Registration successful');
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        approvalStatus: user.approval_status
      }
    });

  } catch (error) {
    console.error('[REGISTER] Error:', error);
    console.error('[REGISTER] Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('[REGISTER] Error message:', error instanceof Error ? error.message : 'Unknown error');
    
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
