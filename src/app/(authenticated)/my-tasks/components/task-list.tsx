'use client';

import { TaskFilters } from "@/components/task-filters";
import { useDeferredValue, useMemo, useState } from "react";
import { TaskCard } from "./task-card";
import { CategoryBadge } from "@/components/category-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { User } from "@/lib/auth";

type TaskWithAuthor = {
  author: {
    name: string;
    id: string;
    email: string;
    avatar: string | null;
  } 
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  category: string | null;
  isPublic: boolean | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;

};

type TaskListBodyProps = {
  currentUser: User | null ;
  tasks: TaskWithAuthor[]
};

export function TaskListBody({ currentUser, tasks }: TaskListBodyProps) {
  const [category, setCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categoryFilteredTasks = category == 'all' ? 
    tasks : tasks.filter((task: typeof tasks[number]) => task.category == category)

  // Used deferred hook and memo hook to avoid lags with seach bar typing when list is big
  const deferredSearch = useDeferredValue(searchTerm);
  const searchFilteredTasks = useMemo(
    () => deferredSearch == '' ? 
    categoryFilteredTasks : 
    categoryFilteredTasks.filter(
        (task: typeof tasks[number]) => task.title.toLowerCase().includes(deferredSearch.toLowerCase())),
    [categoryFilteredTasks, deferredSearch]);


  return (
    <>
     {/* Filters Section - Fixed */}
        <div className="shrink-0">
            <TaskFilters 
                currentCategory={category} 
                handleCategoryChange={setCategory}
                currentSearchTerm={searchTerm} 
                handleSearchTermChange={setSearchTerm}
            />
        </div>

        {/* Returns authenticated task list of authenticated page else the unauthenticed for the opposite */}
        { currentUser ? (
            <>
            {/* Scrollable Task List */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4">
                <div className="space-y-4 pb-4">
                {searchFilteredTasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-12">
                    No tasks yet. Click New Task to create your first task!
                    </p>
                ) : (
                    searchFilteredTasks.map((task: typeof tasks[number]) => (
                    <TaskCard key={task.id} task={task} currentUserId={currentUser.id} />
                    ))
                )}
                </div>
            </div>
            </>
        ) : (
            <>
                {/* Task List */}
                <div className="flex-1 overflow-y-auto -mx-4 px-4">
                <div className="space-y-4 pb-4">
                    {searchFilteredTasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-12">
                        No tasks available yet.
                    </p>
                    ) : (
                    searchFilteredTasks.map((task: typeof tasks[number]) => (
                        <Card key={task.id} className={task.completed ? 'opacity-60' : ''}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
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
                                <CategoryBadge category={task.category}/>
                                </div>
                            </div>
                            {task.completed && (
                                <Badge variant="secondary">Completed</Badge>
                            )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
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
                                Created by {task.author.name} • {new Date(task.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                })}
                                </span>
                            </div>
                            <a 
                                href={`/tasks/${task.id}`}
                                className="text-sm text-primary hover:underline"
                            >
                                View Details →
                            </a>
                            </div>
                        </CardContent>
                        </Card>
                    ))
                    )}
                </div>
                </div>
            </>
        )}
    </>
  );
}
