'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DeleteButton } from './delete-button';
import { EditTaskDialog } from './edit-task-dialog';
import { CategoryBadge } from '@/components/category-badge';
import { toggleTaskComplete } from '../actions';
import { useTransition } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    completed: boolean;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    };
  };
  currentUserId: string;
};

export function TaskCard({ task, currentUserId }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleTaskComplete(task.id);
        toast.success(
          task.completed 
            ? `Task marked as incomplete: ${task.title}` 
            : `Task completed: ${task.title}`,
          {
          closeButton: true,
        }
        );
      } catch {
        toast.error(`Failed to update: ${task.title}`, {
          closeButton: true,
        });
      }
    });
  };

  return (
    <Card className={task.completed ? 'opacity-60' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggle}
              disabled={isPending}
              className="mt-1"
            />
            <div className="flex-1">
              <CardTitle className={task.completed ? 'line-through' : ''}>
                {task.title}
              </CardTitle>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {task.description}
                </p>
              )}
              <div className="mt-2">
                {/* TODO (Task C): Pass task.category as a prop to CategoryBadge */}
                <CategoryBadge category={task.category}/>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-1">
            <EditTaskDialog task={task} />
            <DeleteButton 
              taskId={task.id} 
              taskTitle={task.title}
              authorName={task.author.name}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {task.author.avatar && (
            <Image
              src={task.author.avatar}
              alt={task.author.name}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span>
            Created by {task.author.id === currentUserId ? (
              <span className="font-medium text-foreground">you ({task.author.name})</span>
            ) : (
              task.author.name
            )} • {new Date(task.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

