import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    console.log('[DOWNLOAD] File download requested:', params.path);
    
    const filePath = params.path.join('/');
    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    const fileBuffer = await readFile(fullPath);
    const filename = path.basename(fullPath);
    
    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', 'application/octet-stream');
    response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    console.log('[DOWNLOAD] File sent:', filename);
    
    return response;
  } catch (error: any) {
    console.error('[DOWNLOAD] Failed to download file:', error.message);
    return NextResponse.json(
      { error: 'Failed to download file', details: error.message },
      { status: 500 }
    );
  }
}
