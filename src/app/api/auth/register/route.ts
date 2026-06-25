import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { sendNewRegistrationNotification } from '@/lib/email';
import fs from 'fs';
import path from 'path';

// Function to initialize database schema
async function initializeDatabase() {
  try {
    console.log('[INIT-DB] Checking if database needs initialization');
    
    // Try to query the users table to see if it exists
    try {
      const result = await query('SELECT 1 FROM users LIMIT 1');
      console.log('[INIT-DB] Database already initialized, users table exists');
      return;
    } catch (error: any) {
      console.log('[INIT-DB] Users table does not exist, initializing...');
      console.log('[INIT-DB] Error checking users table:', error.message);
    }

    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
    console.log('[INIT-DB] Reading schema from:', schemaPath);
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    console.log('[INIT-DB] Schema file read successfully, length:', schema.length);

    // Split by semicolon to get individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log('[INIT-DB] Found', statements.length, 'SQL statements to execute');

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await query(statement);
        console.log(`[INIT-DB] Executed statement ${i + 1}/${statements.length}:`, statement.substring(0, 50) + '...');
      } catch (error: any) {
        // Ignore errors for IF NOT EXISTS statements
        if (!statement.includes('IF NOT EXISTS')) {
          console.error('[INIT-DB] Failed to execute statement:', statement);
          console.error('[INIT-DB] Error:', error.message);
          throw error;
        } else {
          console.log('[INIT-DB] IF NOT EXISTS statement failed (expected):', statement.substring(0, 50) + '...');
        }
      }
    }

    console.log('[INIT-DB] Database initialization completed successfully');
  } catch (error: any) {
    console.error('[INIT-DB] Fatal error during initialization:', error.message);
    console.error('[INIT-DB] Stack:', error.stack);
    // Don't throw - let registration proceed even if init fails
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[REGISTER] Registration attempt started');
    console.log('[REGISTER] Environment check - ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
    console.log('[REGISTER] Environment check - SMTP_HOST:', process.env.SMTP_HOST ? 'configured' : 'not configured');
    
    // Initialize database if needed
    await initializeDatabase();
    
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
    const ipHeader = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    // Extract only the first IP if multiple are present (comma-separated)
    const ip = ipHeader.includes(',') ? ipHeader.split(',')[0].trim() : ipHeader;

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
    console.log('[REGISTER] User created successfully:', { id: user.id, email: user.email, status: user.approval_status });

    // Verify user count immediately after insert
    console.log('[REGISTER] Verifying total user count after insert');
    const countResult = await query('SELECT COUNT(*) as count FROM users');
    console.log('[REGISTER] Total users in database after insert:', countResult.rows[0].count);

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
      console.log('[REGISTER] Sending email notification to admin:', process.env.ADMIN_EMAIL);
      const emailSent = await sendNewRegistrationNotification(
        process.env.ADMIN_EMAIL || '',
        user.email,
        user.full_name
      );
      if (emailSent) {
        console.log('[REGISTER] Admin email notification sent successfully');
      } else {
        console.log('[REGISTER] Admin email notification skipped (SMTP not configured or failed)');
      }
    } catch (emailError: any) {
      console.error('[REGISTER] Failed to send email notification:', emailError.message);
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
