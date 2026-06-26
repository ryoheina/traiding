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
    
    console.log('[UPLOAD] File size:', buffer.length, 'bytes');
    
    // Create upload directory if it doesn't exist - use root uploads directory
    const uploadDir = path.join(process.cwd(), 'uploads', type);
    console.log('[UPLOAD] Upload directory:', uploadDir);
    console.log('[UPLOAD] Directory exists before:', existsSync(uploadDir));
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
      console.log('[UPLOAD] Directory created');
    }
    
    console.log('[UPLOAD] Directory exists after:', existsSync(uploadDir));
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = path.join(uploadDir, filename);
    
    console.log('[UPLOAD] Writing file to:', filepath);
    
    // Write file
    await writeFile(filepath, buffer);
    
    // Verify file was written
    if (!existsSync(filepath)) {
      console.error('[UPLOAD] File was not written successfully');
      throw new Error('File was not written successfully');
    }
    
    console.log('[UPLOAD] File verified to exist:', existsSync(filepath));
    
    // Return public URL - use relative URL to work with any domain
    const fileUrl = `/api/uploads/${type}/${filename}`;
    
    console.log('[UPLOAD] File uploaded successfully:', { filename, type, fileUrl, filepath });
    
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
