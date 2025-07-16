import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users, robots } from '$lib/schema';
import { eq } from 'drizzle-orm';

export async function load({ cookies }) {
    const sessionId = cookies.get('session');
    
    if (!sessionId) {
        throw redirect(302, '/login');
    }

    try {
        // Check if user is logged in
        const [user] = await db
            .select({
                id: users.id,
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

        // Fetch all robots from the database
        const allRobots = await db
            .select()
            .from(robots);

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                email: user.email,
                admin: user.admin
            },
            robots: allRobots
        };
    } catch (error) {
        console.error('Error fetching user or robots:', error);
        throw redirect(302, '/login');
    }
} 