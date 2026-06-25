import { query } from './db';

export async function ensureProjectsTable() {
  try {
    console.log('[MIGRATION] Checking if projects table exists...');
    
    const result = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'projects'
      );
    `);
    
    const tableExists = result.rows[0].exists;
    console.log('[MIGRATION] Projects table exists:', tableExists);
    
    if (!tableExists) {
      console.log('[MIGRATION] Creating projects table...');
      await query(`
        CREATE TABLE projects (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image_url VARCHAR(500),
          rar_file_url VARCHAR(500),
          status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('[MIGRATION] Projects table created successfully');
      
      // Create trigger for updated_at
      await query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
      
      await query(`
        CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
      
      console.log('[MIGRATION] Trigger created successfully');
    } else {
      console.log('[MIGRATION] Checking if columns exist...');
      const columns = await query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'projects';
      `);
      const columnNames = columns.rows.map((r: any) => r.column_name);
      console.log('[MIGRATION] Existing columns:', columnNames);
      
      const requiredColumns = ['title', 'description', 'image_url', 'rar_file_url', 'status'];
      const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
      
      if (missingColumns.length > 0) {
        console.log('[MIGRATION] Missing columns:', missingColumns);
        for (const col of missingColumns) {
          if (col === 'image_url') {
            await query(`ALTER TABLE projects ADD COLUMN image_url VARCHAR(500);`);
          } else if (col === 'rar_file_url') {
            await query(`ALTER TABLE projects ADD COLUMN rar_file_url VARCHAR(500);`);
          } else if (col === 'status') {
            await query(`ALTER TABLE projects ADD COLUMN status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived'));`);
          }
        }
        console.log('[MIGRATION] Missing columns added');
      }
    }
    
    console.log('[MIGRATION] Migration completed successfully');
    return { success: true };
  } catch (error: any) {
    console.error('[MIGRATION] Migration failed:', error.message);
    return { success: false, error: error.message };
  }
}
