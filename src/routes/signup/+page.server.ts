import { db } from '$lib/db';
import { users } from '$lib/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const firstName = data.get('firstName')?.toString();
    const lastName = data.get('lastName')?.toString();
    const username = data.get('username')?.toString();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    if (!firstName || !lastName || !username || !email || !password) {
      return fail(400, {
        error: 'All fields are required',
        values: { firstName, lastName, username, email }
      });
    }

    try {
      // Check if email already exists
      const existingEmail = await db.select().from(users).where(eq(users.email, email));
      if (existingEmail.length > 0) {
        return fail(400, {
          error: 'Email already exists',
          values: { firstName, lastName, username, email }
        });
      }

      // Check if username already exists
      const existingUsername = await db.select().from(users).where(eq(users.username, username));
      if (existingUsername.length > 0) {
        return fail(400, {
          error: 'Username already exists',
          values: { firstName, lastName, username, email }
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      await db.insert(users).values({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });

      return {
        success: true
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return fail(500, {
        error: 'An error occurred while creating your account',
        values: { firstName, lastName, username, email }
      });
    }
  }
}; 