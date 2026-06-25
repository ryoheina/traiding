import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[UPLOAD] File upload started');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'rar'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (!type || (type !== 'image' && type !== 'rar')) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be "image" or "rar"' },
        { status: 400 }
      );
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = path.join(uploadDir, filename);
    
    // Write file
    await writeFile(filepath, buffer);
    
    // Verify file was written
    if (!existsSync(filepath)) {
      throw new Error('File was not written successfully');
    }
    
    // Return public URL - use absolute URL from request
    const baseUrl = request.nextUrl.origin;
    const fileUrl = `${baseUrl}/uploads/${type}/${filename}`;
    
    console.log('[UPLOAD] File uploaded successfully:', { filename, type, fileUrl, filepath, baseUrl });
    
    const response = NextResponse.json({
      success: true,
      fileUrl,
      filename,
      type
    });
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('[UPLOAD] Failed to upload file:', error.message);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    );
  }
}
