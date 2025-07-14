import { pgTable, serial, text, timestamp, varchar, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  admin: boolean('admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const robots = pgTable('robots', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  robotId: integer('robot_id').references(() => robots.id),
  name: text('name'),
  status: text('status').default('pending'),
  verificationType: varchar('verification_type', { length: 1 }).notNull().default('A'),
  color: varchar('color', { length: 20 }).default('blue'),
});

export const subtasks = pgTable('subtasks', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id').references(() => tasks.id),
  typeOfError: text('type_of_error'),
  description: text('description'),
  priority: integer('priority'),
  status: text('status').default('pending'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Robot = typeof robots.$inferSelect;
export type NewRobot = typeof robots.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type Subtask = typeof subtasks.$inferSelect;
export type NewSubtask = typeof subtasks.$inferInsert; 