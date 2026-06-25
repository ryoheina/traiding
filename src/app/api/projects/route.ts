import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
    return NextResponse.json(
      { error: 'Failed to create project', details: error.message },
      { status: 500 }
    );
  }
}
