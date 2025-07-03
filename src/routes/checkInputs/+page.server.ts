import { db } from '$lib/db';
import { users } from '$lib/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    // Attempt to connect and fetch all users
    const allUsers = await db.select().from(users);
    
    return {
      status: 'success',
      message: 'Database connected',
      users: allUsers,
      connectionInfo: {
        timestamp: new Date().toISOString(),
        userCount: allUsers.length
      }
    };
  } catch (error) {
    console.error('Database connection error:', error);
    
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown database error',
      users: [],
      connectionInfo: {
        timestamp: new Date().toISOString(),
        userCount: 0,
        errorDetails: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : { message: 'Unknown error' }
      }
    };
  }
}; 