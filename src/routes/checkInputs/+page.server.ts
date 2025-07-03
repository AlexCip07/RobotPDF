import { db } from '$lib/db';
import { users } from '$lib/schema';
import type { PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const sessionId = cookies.get('session');
    
  if (!sessionId) {
    throw redirect(302, '/');
  }

  try {
    // First get the current user
    const [currentUser] = await db
      .select({
        firstName: users.firstName,
        lastName: users.lastName,
        admin: users.admin,
        id: users.id
      })
      .from(users)
      .where(eq(users.id, parseInt(sessionId)));

    if (!currentUser) {
      // If no user found, clear the invalid session cookie
      cookies.delete('session', { path: '/' });
      throw redirect(302, '/');
    }

    if (!currentUser.admin) {
      // If user is not an admin, redirect to home
      throw redirect(302, '/');
    }

    // Now fetch all users for the admin view
    const allUsers = await db.select().from(users);
    
    return {
      status: 'success',
      message: 'Database connected',
      users: allUsers,
      connectionInfo: {
        timestamp: new Date().toISOString(),
        userCount: allUsers.length
      },
      currentUser: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        id: currentUser.id
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
      },
      currentUser: null
    };
  }
};

export const actions: Actions = {
  deleteUser: async ({ request, cookies }) => {
    const data = await request.formData();
    const userId = data.get('userId');
    const sessionId = cookies.get('session');

    if (!sessionId) {
      return fail(401, { success: false, message: 'Not authenticated' });
    }

    try {
      // Check if current user is admin
      const [currentUser] = await db
        .select({ admin: users.admin, id: users.id })
        .from(users)
        .where(eq(users.id, parseInt(sessionId)));

      if (!currentUser?.admin) {
        return fail(403, { success: false, message: 'Not authorized' });
      }

      // Don't allow deleting yourself
      if (parseInt(userId as string) === currentUser.id) {
        return fail(400, { success: false, message: 'Cannot delete your own account' });
      }

      // Delete the user
      await db.delete(users).where(eq(users.id, parseInt(userId as string)));

      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      return fail(500, { success: false, message: 'Failed to delete user' });
    }
  },

  toggleAdmin: async ({ request, cookies }) => {
    const data = await request.formData();
    const userId = data.get('userId');
    const adminStatus = data.get('adminStatus') === 'true';
    const sessionId = cookies.get('session');

    if (!sessionId) {
      return fail(401, { success: false, message: 'Not authenticated' });
    }

    try {
      // Check if current user is admin
      const [currentUser] = await db
        .select({ admin: users.admin, id: users.id })
        .from(users)
        .where(eq(users.id, parseInt(sessionId)));

      if (!currentUser?.admin) {
        return fail(403, { success: false, message: 'Not authorized' });
      }

      // Don't allow removing admin from yourself
      if (parseInt(userId as string) === currentUser.id && !adminStatus) {
        return fail(400, { success: false, message: 'Cannot remove admin status from your own account' });
      }

      // Update the user's admin status
      await db
        .update(users)
        .set({ admin: adminStatus, updatedAt: new Date() })
        .where(eq(users.id, parseInt(userId as string)));

      return { success: true, message: `Admin status ${adminStatus ? 'granted' : 'revoked'} successfully` };
    } catch (error) {
      console.error('Error updating admin status:', error);
      return fail(500, { success: false, message: 'Failed to update admin status' });
    }
  }
}; 