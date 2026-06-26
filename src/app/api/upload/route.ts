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
    
    // Use local storage
    const baseDir = process.cwd();
    const uploadDir = path.join(baseDir, 'public', 'uploads', type);
    
    console.log('[UPLOAD] Upload directory:', uploadDir);
    console.log('[UPLOAD] Directory exists before:', existsSync(uploadDir));
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
      console.log('[UPLOAD] Directory created');
    }
    
    console.log('[UPLOAD] Directory exists after:', existsSync(uploadDir));
    
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = path.join(uploadDir, filename);
    
    console.log('[UPLOAD] Writing file to:', filepath);
    
    await writeFile(filepath, buffer);
    
    if (!existsSync(filepath)) {
      console.error('[UPLOAD] File was not written successfully');
      throw new Error('File was not written successfully');
    }
    
    console.log('[UPLOAD] File verified to exist:', existsSync(filepath));
    
    const fileUrl = `/api/uploads/${type}/${filename}`;
    
    console.log('[UPLOAD] File uploaded locally:', { fileUrl, filepath });
    
    const response = NextResponse.json({
      success: true,
      fileUrl,
      filename: file.name,
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
