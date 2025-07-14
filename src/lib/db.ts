import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { dev } from '$app/environment';

// Load environment variables in development
if (dev) {
  config();
}

// Get connection string
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set.');
  if (dev) {
    console.error('In development, create a .env file with:');
    console.error('DATABASE_URL="postgresql://username:password@localhost:5432/database_name"');
  } else {
    console.error('In production, make sure DATABASE_URL is set in Railway environment variables.');
  }
  throw new Error('DATABASE_URL is not configured');
}

// Configure connection options
const connectionOptions = {
  ssl: !dev ? { rejectUnauthorized: false } : false,
  max: 1,
};

// for query purposes
const queryClient = postgres(connectionString, connectionOptions);
export const db = drizzle(queryClient, { schema });

// for migrations
export const migrationClient = postgres(connectionString, { ...connectionOptions, max: 1 }); 