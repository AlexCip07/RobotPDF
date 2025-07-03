import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { users } from '$lib/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Constants for the user to be added
const CONSTANT_USER = {
  email: 'admin1@admin.com',
  username: 'notadmin',
  password: 'admin123',
  firstName: 'DD',
  lastName: 'DD1',
  admin: false,
};

export const load: PageServerLoad = async () => {
  try {
    // Check if user already exists (by email or username)
    const existingUser = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, CONSTANT_USER.email),
          eq(users.username, CONSTANT_USER.username)
        )
      )
      .limit(1);

    if (existingUser.length > 0) {
      // User already exists
      return {
        success: false,
        message: 'User already exists',
        user: {
          email: CONSTANT_USER.email,
          username: CONSTANT_USER.username,
          firstName: CONSTANT_USER.firstName,
          lastName: CONSTANT_USER.lastName
        }
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(CONSTANT_USER.password, 10);

    // Insert new user
    const newUser = await db
      .insert(users)
      .values({
        email: CONSTANT_USER.email,
        username: CONSTANT_USER.username,
        password: hashedPassword,
        firstName: CONSTANT_USER.firstName,
        lastName: CONSTANT_USER.lastName,
        admin: CONSTANT_USER.admin
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        admin: users.admin,
      });

    return {
      success: true,
      message: 'User added',
      user: newUser[0]
    };

  } catch (error) {
    console.error('Error in addInputs:', error);
    
    return {
      success: false,
      message: 'An error occurred while adding the user',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 