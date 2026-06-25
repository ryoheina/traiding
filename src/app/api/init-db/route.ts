import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('[INIT-DB] Database initialization started');

    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split by semicolon to get individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      try {
        await query(statement);
        console.log('[INIT-DB] Executed statement:', statement.substring(0, 50) + '...');
      } catch (error) {
        // Ignore errors for IF NOT EXISTS statements (they fail if already exists)
        if (!statement.includes('IF NOT EXISTS')) {
          console.error('[INIT-DB] Failed to execute statement:', statement);
          throw error;
        }
      }
    }

    console.log('[INIT-DB] Database initialization completed');

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('[INIT-DB] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
