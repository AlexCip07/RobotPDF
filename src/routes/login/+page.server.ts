import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users } from '$lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { dev } from '$app/environment';

export const actions = {
    default: async ({ request, cookies }) => {
        console.log('Starting login process...');
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (!email || !password) {
            console.log('Missing email or password');
            return fail(400, { 
                error: 'Email and password are required',
                email: email
            });
        }

        let user;

        try {
            console.log('Attempting to find user with email:', email);
            
            // Find user by email
            const [foundUser] = await db
                .select()
                .from(users)
                .where(eq(users.email, email.toString()));

            console.log('Database query result:', foundUser ? 'User found' : 'User not found');

            if (!foundUser) {
                console.log('User not found, returning error');
                return fail(400, { 
                    error: 'Invalid email or password',
                    email: email
                });
            }

            user = foundUser;

            // Verify password
            console.log('Starting password verification...');
            const passwordMatch = await bcrypt.compare(password.toString(), user.password);
            console.log('Password verification result:', passwordMatch ? 'Match' : 'No match');

            if (!passwordMatch) {
                console.log('Password does not match, returning error');
                return fail(400, { 
                    error: 'Invalid email or password',
                    email: email
                });
            }

            console.log('Login successful for user:', email);
            console.log('User admin status:', user.admin ? 'Admin User' : 'Regular User');

            console.log('Setting session cookie...');
            // Set session cookie
            cookies.set('session', user.id.toString(), {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: !dev,
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });

        } catch (error) {
            // Handle actual errors
            console.error('Login error:', error);
            return fail(500, { 
                error: 'Internal server error. Please try again later.',
                email: email
            });
        }

        // Handle redirect outside try/catch
       
            console.log('Redirecting to welcome page');
            throw redirect(302, '/welcome');
        
        
      
    }
}; 