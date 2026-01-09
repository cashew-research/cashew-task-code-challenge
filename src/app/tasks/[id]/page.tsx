import { getEnhancedDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailPage({ params }: PageProps) {
  const currentUser = await getCurrentUser(); // May be null for logged-out users
  
  const { id } = await params;
  const db = await getEnhancedDb();
  
  // INTENTIONALLY BROKEN: This queries any task by ID without checking access
  // After the intern fixes access control, this should:
  // 1. Only show tasks owned by the current user OR
  // 2. Tasks marked as isPublic
  const task = await db.task.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!task) {
    notFound();
  }

  const isOwner = currentUser ? task.author.id === currentUser.id : false;

  return (
    <div className="h-full flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Back Button */}
        <Link href="/tasks">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Tasks
          </Button>
        </Link>

        {/* Task Detail Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <CardTitle className="text-2xl">{task.title}</CardTitle>
              </div>
              <div className="flex gap-2">
                {task.completed && (
                  <Badge variant="secondary">Completed</Badge>
                )}
                {isOwner && (
                  <Badge variant="outline">Your Task</Badge>
                )}
              </div>
            </div>
            {task.description && (
              <CardDescription className="text-base mt-2">
                {task.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Author Info */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              {task.author.avatar && (
                <Image
                  src={task.author.avatar}
                  alt={task.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Created by {task.author.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {task.author.email}
                </div>
              </div>
            </div>

            {/* Date Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Created on {new Date(task.createdAt).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            {/* Warning for interns - will be visible in broken state */}
            {!isOwner && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive mb-1">
                  🚨 Security Issue
                </p>
                <p className="text-sm text-foreground/90">
                  You can see this task even though it belongs to {task.author.name}. 
                  This should only be visible if the task is marked as public!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {isOwner && (
              <div className="pt-4 border-t">
                <Link href="/my-tasks">
                  <Button variant="outline" className="w-full">
                    Edit in My Tasks
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

