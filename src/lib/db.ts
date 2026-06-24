import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

    if (process.env.DATABASE_URL) {
      try {
        const dbUrl = new URL(process.env.DATABASE_URL);
        console.log('DATABASE_URL host:', dbUrl.hostname);
        console.log('DATABASE_URL port:', dbUrl.port);
        console.log('DATABASE_URL database:', dbUrl.pathname.replace('/', ''));
      } catch (e) {
        console.log('DATABASE_URL parse error:', e);
      }
    } else {
      console.log('DATABASE_URL host: undefined');
    }

    console.log('NODE_ENV:', process.env.NODE_ENV);

    if (!process.env.DATABASE_URL) {
      console.error('FATAL: DATABASE_URL is undefined');
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const pool = getPool();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default getPool;
