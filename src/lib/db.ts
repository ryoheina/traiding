import { Pool } from 'pg';

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
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;
