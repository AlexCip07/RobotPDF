import { config } from 'dotenv';
import { spawn } from 'child_process';

// Load environment variables
config();

console.log('Starting dev server with environment variables loaded...');
console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL);

// Start the dev server
const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

devServer.on('error', (error) => {
  console.error('Failed to start dev server:', error);
});

devServer.on('exit', (code) => {
  console.log(`Dev server exited with code ${code}`);
}); 