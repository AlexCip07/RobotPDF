import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users } from '$lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// GET /user - Get all users or a specific user
export const GET = async ({ url }) => {
  try {
    const userId = url.searchParams.get('id');
    
    if (userId) {
      // Get specific user
      const user = await db
        .select({
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        })
        .from(users)
        .where(eq(users.id, parseInt(userId)))
        .limit(1);
      
      if (user.length === 0) {
        return json({ error: 'User not found' }, { status: 404 });
      }
      
      return json(user[0]);
    } else {
      // Get all users (without passwords)
      const allUsers = await db
        .select({
          id: users.id,
          email: users.email,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        })
        .from(users);
      
      return json(allUsers);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return json({ error: 'Failed to fetch users' }, { status: 500 });
  }
};

// POST /user - Create a new user
export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, username, password, firstName, lastName } = body;
    
    // Validate required fields
    if (!email || !username || !password || !firstName || !lastName) {
      return json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const newUser = await db
      .insert(users)
      .values({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      });
    
    return json(newUser[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle unique constraint violations
    if (error.code === '23505') {
      if (error.constraint === 'users_email_unique') {
        return json({ error: 'Email already exists' }, { status: 409 });
      }
      if (error.constraint === 'users_username_unique') {
        return json({ error: 'Username already exists' }, { status: 409 });
      }
    }
    
    return json({ error: 'Failed to create user' }, { status: 500 });
  }
};