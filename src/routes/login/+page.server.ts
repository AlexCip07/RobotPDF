import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users } from '$lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (!email || !password) {
            return fail(400, { 
                error: 'Email and password are required',
                email: email
            });
        }

        try {
            console.log('Attempting to find user with email:', email);
            
            // Find user by email
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.email, email.toString()));

            console.log('Database query result:', user ? 'User found' : 'User not found');

            if (!user) {
                return fail(400, { 
                    error: 'Invalid email or password',
                    email: email
                });
            }

            // Verify password
            try {
                const passwordMatch = await bcrypt.compare(password.toString(), user.password);
                console.log('Password verification result:', passwordMatch ? 'Match' : 'No match');
                
                if (!passwordMatch) {
                    return fail(400, { 
                        error: 'Invalid email or password',
                        email: email
                    });
                }
            } catch (bcryptError) {
                console.error('bcrypt error:', bcryptError);
                return fail(500, { 
                    error: 'Error verifying password',
                    email: email
                });
            }

            // Set session cookie
            cookies.set('session', user.id.toString(), {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });

            // Redirect based on admin status
            if (user.admin) {
                throw redirect(302, '/');
            } else {
                throw redirect(302, '/blank');
            }

        } catch (error) {
            console.error('Login error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            return fail(500, { 
                error: 'Internal server error. Please check server logs.',
                email: email
            });
        }
    }
}; 