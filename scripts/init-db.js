const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Only run if DATABASE_URL is available (production/Railway)
if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL not set, skipping database initialization');
  process.exit(0);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  try {
    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, '../src/lib/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Connecting to database...');
    await pool.connect();
    
    console.log('Executing schema...');
    await pool.query(schema);
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    // If tables already exist, that's okay
    if (error.message.includes('already exists')) {
      console.log('Database tables already exist, skipping initialization');
      process.exit(0);
    }
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
