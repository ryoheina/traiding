import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ADMIN_EMAIL = 'aivideo7775@gmail.com';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('[PROJECTS] Fetching all projects');
    
    const result = await query(
      `SELECT id, title, description, image_url, rar_file_url, status, created_at, updated_at
       FROM projects
       ORDER BY created_at DESC`
    );
    
    console.log('[PROJECTS] Found', result.rows.length, 'projects');
    
    const response = NextResponse.json({
      projects: result.rows
    });
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('[PROJECTS] Failed to fetch projects:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[PROJECTS] Creating new project');
    console.log('[PROJECTS] Cookies:', request.cookies.getAll());
    
    // Check admin authorization
    const sessionCookie = request.cookies.get('session');
    console.log('[PROJECTS] Session cookie:', sessionCookie ? sessionCookie.value : 'not found');
    
    if (!sessionCookie) {
      console.log('[PROJECTS] No session cookie found');
      return NextResponse.json(
        { error: 'Unauthorized - No session' },
        { status: 401 }
      );
    }

    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
      console.log('[PROJECTS] Session data parsed:', sessionData);
    } catch (error) {
      console.log('[PROJECTS] Failed to parse session cookie:', error);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session format' },
        { status: 401 }
      );
    }
    
    if (!sessionData.userId) {
      console.log('[PROJECTS] No userId in session');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session' },
        { status: 401 }
      );
    }

    // Fetch user to check if admin
    console.log('[PROJECTS] Fetching user with userId:', sessionData.userId);
    const userResult = await query(
      'SELECT email FROM users WHERE id = $1',
      [sessionData.userId]
    );

    if (userResult.rows.length === 0) {
      console.log('[PROJECTS] User not found');
      return NextResponse.json(
        { error: 'Unauthorized - User not found' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];
    console.log('[PROJECTS] User found:', user.email);
    
    if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      console.log('[PROJECTS] User is not admin:', user.email);
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    console.log('[PROJECTS] Admin verified:', user.email);
    
    const body = await request.json();
    const { title, description, image_url, rar_file_url, status } = body;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const result = await query(
      `INSERT INTO projects (title, description, image_url, rar_file_url, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, image_url, rar_file_url, status, created_at`,
      [title, description || null, image_url || null, rar_file_url || null, status || 'active']
    );
    
    console.log('[PROJECTS] Project created:', result.rows[0]);
    
    const response = NextResponse.json({
      project: result.rows[0]
    });
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('[PROJECTS] Failed to create project:', error.message);
    console.error('[PROJECTS] Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to create project', details: error.message },
      { status: 500 }
    );
  }
}
