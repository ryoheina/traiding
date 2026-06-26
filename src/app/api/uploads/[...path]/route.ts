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
    const filePath = params.path.join('/');
    
    // Try multiple possible paths - prioritize public/uploads for Next.js static serving
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'uploads', filePath),
      path.join(process.cwd(), 'uploads', filePath),
      path.join(process.cwd(), '.next', 'public', 'uploads', filePath),
    ];

    let fullPath = '';
    let fileExists = false;

    for (const possiblePath of possiblePaths) {
      console.log('[FILE-SERVE] Checking path:', possiblePath);
      if (existsSync(possiblePath)) {
        fullPath = possiblePath;
        fileExists = true;
        console.log('[FILE-SERVE] File found at:', fullPath);
        break;
      }
    }

    if (!fileExists) {
      console.log('[FILE-SERVE] File not found in any location');
      return NextResponse.json(
        { error: 'File not found', path: filePath, checkedPaths: possiblePaths },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(fullPath);

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.rar': 'application/vnd.rar',
      '.zip': 'application/zip',
      '.pdf': 'application/pdf',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    console.log('[FILE-SERVE] Serving file:', { filePath, contentType, size: fileBuffer.length, fullPath });

    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    // For RAR files, set content-disposition to trigger download with filename
    if (ext === '.rar' || ext === '.zip') {
      const filename = path.basename(filePath);
      response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    }
    
    return response;
  } catch (error: any) {
    console.error('[FILE-SERVE] Error serving file:', error.message);
    return NextResponse.json(
      { error: 'Failed to serve file', details: error.message },
      { status: 500 }
    );
  }
}
