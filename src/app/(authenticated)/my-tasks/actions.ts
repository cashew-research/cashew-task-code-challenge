'use server';

import { getEnhancedDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-server';
import { revalidatePath } from 'next/cache';

export async function createTask(data: { 
  title: string; 
  description?: string;
  // TODO (Task A): Add category?: string; here after adding the field to the schema
  category?: string;
}) {
  const db = await getEnhancedDb();
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  const task = await db.task.create({
    data: {
      ...data,
      authorId: user.id,
    },
  });
  
  revalidatePath('/my-tasks');
  return { success: true, task };
}

export async function deleteTask(taskId: string) {
  const db = await getEnhancedDb();
  
  await db.task.delete({
    where: { id: taskId },
  });
  
  revalidatePath('/my-tasks');
  return { success: true };
}

export async function toggleTaskComplete(taskId: string) {
  const db = await getEnhancedDb();
  
  const task = await db.task.findUnique({
    where: { id: taskId },
  });
  
  if (!task) {
    throw new Error('Task not found');
  }
  
  const updated = await db.task.update({
    where: { id: taskId },
    data: { completed: !task.completed },
  });
  
  revalidatePath('/my-tasks');
  return { success: true, task: updated };
}

