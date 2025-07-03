import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users } from '$lib/schema';
import { eq } from 'drizzle-orm';

export const actions = {
    logoff: async ({ cookies }) => {
        cookies.delete('session', { path: '/' });
        return { success: true };
    }
};

export async function load({ cookies }) {
    const sessionId = cookies.get('session');
    
    if (!sessionId) {
        throw redirect(302, '/login');
    }

    try {
        const [user] = await db
            .select({
                firstName: users.firstName,
                email: users.email,
                admin: users.admin
            })
            .from(users)
            .where(eq(users.id, parseInt(sessionId)));

        if (!user) {
            // If no user found, clear the invalid session cookie
            cookies.delete('session', { path: '/' });
            throw redirect(302, '/login');
        }

        return {
            firstName: user.firstName,
            admin: user.admin
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        throw redirect(302, '/login');
    }
} 