'use client';

import { useOptimistic, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil } from 'lucide-react';
import { TASK_CATEGORIES, TaskCategory } from '@/lib/categories';
import { toast } from 'sonner';
import { updateTask } from '../actions';
import { z } from 'zod';

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  category?: string | null; // TODO: Uncomment after Task A
};

type EditTaskDialogProps = {
  task: Task;
};

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Other']).optional(),
});

/**
 * EditTaskDialog Component
 * 
 * INCOMPLETE - This component is a starting point for the intern to complete.
 * 
 * TODO (Task A): After adding the `category` field to the Task model:
 * 1. Uncomment the `category` field in the Task type above
 * 2. Add category to the initial state
 * 3. Create/update the server action to handle category updates
 * 4. Wire up the form submission to save the category
 * 
 * TODO (Stretch Goal): Add form validation using Zod
 * TODO (Stretch Goal): Add optimistic UI updates
 */
export function EditTaskDialog({ task }: EditTaskDialogProps) {
  // This is for opitmistic UI updates
  const [optimisticTask, setOptimisticTask] = useOptimistic(
    task,
    (_state, newTask: Task) => newTask
  );

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(optimisticTask.title);
  const [description, setDescription] = useState(optimisticTask.description || '');
  const [category, setCategory] = useState<string>(optimisticTask.category || ''); // TODO: Initialize from task.category

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // TODO: Call server action to update the task
    // Example:
    // await updateTask({
    //   id: task.id,
    //   title,
    //   description,
    //   category,
    // });
    

    startTransition(async () => {
      try {
        const validatedData = updateTaskSchema.parse({ title, description, category });
        // There was a mismatch for description type (undfined vs. null) 
        // not sure if I can keep changing other components for this so I
        // handled it here for now.
        setOptimisticTask({
          ...optimisticTask,
          title: validatedData.title.trim(),
          description: validatedData.description?.trim() || null,
          category: validatedData.category?.trim() || undefined
        });
        await updateTask({
          id: optimisticTask.id,
          title: validatedData.title.trim(),
          description: validatedData.description?.trim() || undefined,
          category: validatedData.category?.trim() || undefined
        });
        setOpen(false);
        toast.success('Task updated successfully');
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((e) => toast.error(e.message));
        } else {
          toast.error('Failed to update task. Please try again.');
        } 
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                disabled={isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description (optional)"
                disabled={isPending}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">
                Category
                {/* <span className="text-xs text-muted-foreground ml-2">
                  (TODO: Wire up to server action)
                </span> */}
              </Label>
              <Select value={category} onValueChange={setCategory} disabled={isPending}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_CATEGORIES.map((category: TaskCategory) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

