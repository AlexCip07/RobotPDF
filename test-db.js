import { db } from './src/lib/db.ts';
import { users } from './src/lib/schema.ts';
import { sql } from 'drizzle-orm';

console.log('Testing database connection...');

// Test 1: Basic connection
try {
  const result = await db.execute(sql`SELECT 1 as test`);
  console.log('✓ Basic connection successful:', result);
} catch (error) {
  console.error('✗ Basic connection failed:', error.message);
  process.exit(1);
}

// Test 2: Check if users table exists
try {
  const tableCheck = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    );
  `);
  console.log('✓ Table check result:', tableCheck);
} catch (error) {
  console.error('✗ Table check failed:', error.message);
}

// Test 3: Try to query users
try {
  const allUsers = await db.select().from(users);
  console.log('✓ Users query successful. User count:', allUsers.length);
} catch (error) {
  console.error('✗ Users query failed:', error.message);
  console.error('  This usually means the table doesn\'t exist. Run: npm run db:migrate');
}

process.exit(0); 