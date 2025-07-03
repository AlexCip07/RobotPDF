import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { building } from '$app/environment';

// Load environment variables
config();

// Get connection string - in dev/server context, use process.env
const connectionString = building 
  ? process.env.DATABASE_URL || 'postgresql://localhost:5432/postgres'
  : process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set. Please create a .env file with:');
  console.error('DATABASE_URL="postgresql://username:password@localhost:5432/database_name"');
  throw new Error('DATABASE_URL is not configured');
}

// for query purposes
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

// for migrations
export const migrationClient = postgres(connectionString, { max: 1 }); 