import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureProjectsTable } from '@/lib/migrate-projects';

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
    
    // Fetch images for each project
    const projectsWithImages = await Promise.all(
      result.rows.map(async (project) => {
        const imagesResult = await query(
          `SELECT id, image_url, display_order
           FROM project_images
           WHERE project_id = $1
           ORDER BY display_order ASC`,
          [project.id]
        );
        return {
          ...project,
          images: imagesResult.rows
        };
      })
    );
    
    console.log('[PROJECTS] Found', projectsWithImages.length, 'projects');
    
    const response = NextResponse.json({
      projects: projectsWithImages
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
    
    // Ensure projects table exists
    const migrationResult = await ensureProjectsTable();
    if (!migrationResult.success) {
      console.error('[PROJECTS] Migration failed:', migrationResult.error);
      return NextResponse.json(
        { error: 'Database migration failed', details: migrationResult.error },
        { status: 500 }
      );
    }
    
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
    const { title, description, image_url, rar_file_url, status, images } = body;
    
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
    
    const projectId = result.rows[0].id;
    
    // Insert multiple images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await query(
          `INSERT INTO project_images (project_id, image_url, display_order)
           VALUES ($1, $2, $3)`,
          [projectId, images[i], i]
        );
      }
    }
    
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
