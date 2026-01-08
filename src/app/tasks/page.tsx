import { getEnhancedDb } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryBadge } from '@/components/category-badge';
import { TaskFilters } from '@/components/task-filters';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

// Decided to use maintain category filter state via Search Params
// to avoid eslint complains about useState in async

type TasksPageProps = {
  searchParams?: {
    category?: string;
  };
};

export default async function TasksPage(props: TasksPageProps) {
  const db = await getEnhancedDb();
  
  const searchParams = await props.searchParams;
  const category = searchParams?.category || '';

  // TODO (Task B - Bonus): This page currently shows ALL tasks
  // After you add the isPublic field and fix access control in schema.zmodel,
  // this page will automatically only show public tasks (thanks to ZenStack)
  const tasks = await db.task.findMany({
    where: {
      category: category && category !== 'all' ? category : undefined,
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <div className="h-full flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-4xl flex-1 flex flex-col min-h-0">
        {/* Header Section */}
        <div className="shrink-0 mb-6">
          <h1 className="text-3xl font-bold mb-2">All Tasks</h1>
          <p className="text-muted-foreground">
            Browse tasks shared by the community
          </p>
        </div>

        {/* Filters Section */}
        <div className="shrink-0">
          <TaskFilters currentCategory={category} />
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto -mx-4 px-4">
          <div className="space-y-4 pb-4">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                No tasks available yet.
              </p>
            ) : (
              tasks.map((task) => (
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
      </div>
    </div>
  );
}

