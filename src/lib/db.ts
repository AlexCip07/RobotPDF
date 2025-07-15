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
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // During build time, use a placeholder to allow build to complete
  connectionString = "postgresql://placeholder:placeholder@placeholder:5432/placeholder";
  console.warn('DATABASE_URL is not set, using placeholder for build.');
  if (dev) {
    console.error('In development, create a .env file with:');
    console.error('DATABASE_URL="postgresql://username:password@localhost:5432/database_name"');
  }
  
  // Use placeholder during build, but still throw error at runtime if missing
  if (process.env.NODE_ENV === 'production' && !connectionString.includes('placeholder')) {
    console.error('In production, make sure DATABASE_URL is set in Railway environment variables.');
    throw new Error('DATABASE_URL is not configured');
  }
}

// Configure connection options
const connectionOptions = {
  ssl: !dev ? { rejectUnauthorized: false } : false,
  max: 1,
};

// Only create real connections if not using placeholder
let queryClient: any;
let db: any;
let migrationClient: any;

if (connectionString.includes('placeholder')) {
  // During build time with placeholder, create mock objects
  console.warn('Using placeholder database connection for build');
  queryClient = null;
  db = null;
  migrationClient = null;
} else {
  // for query purposes
  queryClient = postgres(connectionString, connectionOptions);
  db = drizzle(queryClient, { schema });
  
  // for migrations
  migrationClient = postgres(connectionString, { ...connectionOptions, max: 1 });
}

export { db, migrationClient }; 