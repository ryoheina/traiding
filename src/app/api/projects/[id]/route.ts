import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ADMIN_EMAIL = 'aivideo7775@gmail.com';

export const dynamic = 'force-dynamic';

const checkAdminAuth = async (request: NextRequest) => {
  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie) {
    return { authorized: false, reason: 'No session' };
  }

  const sessionData = JSON.parse(sessionCookie.value);
  if (!sessionData.userId) {
    return { authorized: false, reason: 'Invalid session' };
  }

  const userResult = await query(
    'SELECT email FROM users WHERE id = $1',
    [sessionData.userId]
  );

  if (userResult.rows.length === 0) {
    return { authorized: false, reason: 'User not found' };
  }

  const user = userResult.rows[0];
  if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return { authorized: false, reason: 'Not admin' };
  }

  return { authorized: true, user };
};

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[PROJECTS] Updating project:', params.id);
    
    // Check admin authorization
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      console.log('[PROJECTS] Authorization failed:', auth.reason);
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    console.log('[PROJECTS] Admin verified:', auth.user.email);
    
    const body = await request.json();
    const { title, description, image_url, rar_file_url, status } = body;
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const result = await query(
      `UPDATE projects 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           image_url = COALESCE($3, image_url),
           rar_file_url = COALESCE($4, rar_file_url),
           status = COALESCE($5, status)
       WHERE id = $6
       RETURNING id, title, description, image_url, rar_file_url, status, created_at, updated_at`,
      [title, description, image_url, rar_file_url, status, projectId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    console.log('[PROJECTS] Project updated:', result.rows[0]);
    
    const response = NextResponse.json({
      project: result.rows[0]
    });
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('[PROJECTS] Failed to update project:', error.message);
    return NextResponse.json(
      { error: 'Failed to update project', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[PROJECTS] Deleting project:', params.id);
    
    // Check admin authorization
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      console.log('[PROJECTS] Authorization failed:', auth.reason);
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    console.log('[PROJECTS] Admin verified:', auth.user.email);
    
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const result = await query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [projectId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    console.log('[PROJECTS] Project deleted:', result.rows[0]);
    
    const response = NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('[PROJECTS] Failed to delete project:', error.message);
    return NextResponse.json(
      { error: 'Failed to delete project', details: error.message },
      { status: 500 }
    );
  }
}
