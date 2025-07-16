import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users, robots, tasks, subtasks } from '$lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function load({ cookies, params, url }) {
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

        // Get robot ID from URL params
        const robotId = parseInt(params.robotId);
        
        // Fetch the specific robot
        const [robot] = await db
            .select()
            .from(robots)
            .where(eq(robots.id, robotId));

        if (!robot) {
            throw redirect(302, '/progress');
        }

        // Fetch tasks for the robot in descending order
        const robotTasks = await db
            .select()
            .from(tasks)
            .where(eq(tasks.robotId, robotId))
            .orderBy(desc(tasks.id));

        // Get selected task ID from URL params
        const selectedTaskId = url.searchParams.get('taskId');
        let selectedTask = null;
        let taskSubtasks = [];

        if (selectedTaskId) {
            // Fetch the selected task
            [selectedTask] = await db
                .select()
                .from(tasks)
                .where(eq(tasks.id, parseInt(selectedTaskId)));

            // Fetch subtasks for the selected task in descending order
            if (selectedTask) {
                taskSubtasks = await db
                    .select()
                    .from(subtasks)
                    .where(eq(subtasks.taskId, parseInt(selectedTaskId)))
                    .orderBy(desc(subtasks.id));
            }
        }

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                email: user.email,
                admin: user.admin
            },
            robot,
            robotTasks,
            selectedTask,
            taskSubtasks
        };
    } catch (error) {
        console.error('Error fetching robot details:', error);
        throw redirect(302, '/progress');
    }
}

export const actions = {
    createTask: async ({ request, cookies, params }) => {
        const sessionId = cookies.get('session');
        
        if (!sessionId) {
            throw redirect(302, '/login');
        }

        try {
            const formData = await request.formData();
            const robotId = params.robotId;
            const taskName = formData.get('taskName');
            const verificationType = formData.get('verificationType') || 'A';
            const color = formData.get('color') || 'blue';

            if (!robotId || !taskName || !taskName.trim()) {
                return {
                    error: 'Robot ID and task name are required'
                };
            }

            // Create the new task
            await db.insert(tasks).values({
                robotId: parseInt(robotId),
                name: taskName.trim(),
                status: 'pending',
                verificationType: verificationType,
                color: color
            });

            return {
                success: true,
                message: 'Task created successfully'
            };
        } catch (error) {
            console.error('Error creating task:', error);
            return {
                error: 'Failed to create task'
            };
        }
    },

    editTask: async ({ request, cookies }) => {
        const sessionId = cookies.get('session');
        
        if (!sessionId) {
            throw redirect(302, '/login');
        }

        try {
            const formData = await request.formData();
            const taskId = formData.get('taskId');
            const taskName = formData.get('taskName');
            const verificationType = formData.get('verificationType') || 'A';
            const color = formData.get('color') || 'blue';
            const status = formData.get('status') || 'pending';

            if (!taskId || !taskName || !taskName.trim()) {
                return {
                    error: 'Task ID and task name are required'
                };
            }

            // Update the task
            await db.update(tasks)
                .set({
                    name: taskName.trim(),
                    verificationType: verificationType,
                    color: color,
                    status: status
                })
                .where(eq(tasks.id, parseInt(taskId)));

            return {
                success: true,
                message: 'Task updated successfully'
            };
        } catch (error) {
            console.error('Error updating task:', error);
            return {
                error: 'Failed to update task'
            };
        }
    },

    createSubtask: async ({ request, cookies }) => {
        const sessionId = cookies.get('session');
        
        if (!sessionId) {
            throw redirect(302, '/login');
        }

        try {
            const formData = await request.formData();
            const taskId = formData.get('taskId');
            const typeOfError = formData.get('typeOfError');
            const description = formData.get('description');
            const priority = formData.get('priority');

            if (!taskId || !description || !description.trim()) {
                return {
                    error: 'Task ID and description are required'
                };
            }

            // Create the new subtask
            await db.insert(subtasks).values({
                taskId: parseInt(taskId),
                typeOfError: typeOfError || '',
                description: description.trim(),
                priority: priority ? parseInt(priority) : 1,
                status: 'pending'
            });

            return {
                success: true,
                message: 'Subtask created successfully'
            };
        } catch (error) {
            console.error('Error creating subtask:', error);
            return {
                error: 'Failed to create subtask'
            };
        }
    },

    editSubtask: async ({ request, cookies }) => {
        const sessionId = cookies.get('session');
        
        if (!sessionId) {
            throw redirect(302, '/login');
        }

        try {
            const formData = await request.formData();
            const subtaskId = formData.get('subtaskId');
            const typeOfError = formData.get('typeOfError');
            const description = formData.get('description');
            const priority = formData.get('priority');
            const status = formData.get('status') || 'pending';

            if (!subtaskId || !description || !description.trim()) {
                return {
                    error: 'Subtask ID and description are required'
                };
            }

            // Update the subtask
            await db.update(subtasks)
                .set({
                    typeOfError: typeOfError || '',
                    description: description.trim(),
                    priority: priority ? parseInt(priority) : 1,
                    status: status
                })
                .where(eq(subtasks.id, parseInt(subtaskId)));

            return {
                success: true,
                message: 'Subtask updated successfully'
            };
        } catch (error) {
            console.error('Error updating subtask:', error);
            return {
                error: 'Failed to update subtask'
            };
        }
    }
}; 