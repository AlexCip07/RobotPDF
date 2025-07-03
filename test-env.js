import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

console.log('Environment check:');
console.log('==================');

if (process.env.DATABASE_URL) {
  // Mask the password for security
  const url = process.env.DATABASE_URL;
  const masked = url.replace(/:([^@]+)@/, ':****@');
  console.log('DATABASE_URL is set:', masked);
  
  // Parse the URL to check components
  try {
    const urlObj = new URL(url);
    console.log('- Protocol:', urlObj.protocol);
    console.log('- Host:', urlObj.hostname);
    console.log('- Port:', urlObj.port || '(default)');
    console.log('- Database:', urlObj.pathname.slice(1));
  } catch (e) {
    console.error('DATABASE_URL is not a valid URL:', e.message);
  }
} else {
  console.error('DATABASE_URL is NOT set!');
  console.log('\nPlease create a .env file with:');
  console.log('DATABASE_URL="postgresql://username:password@localhost:5432/database_name"');
} 