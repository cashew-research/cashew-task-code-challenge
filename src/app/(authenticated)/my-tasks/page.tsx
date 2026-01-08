import { getEnhancedDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-server';
import { TaskCard } from './components/task-card';
import { TaskListHeader } from './components/task-list-header';
import { TaskFilters } from '@/components/task-filters';
import { redirect } from 'next/navigation';

// Decided to use maintian category filter state via Search Params
// to avoid eslint complains about useState in async

type DashboardPageProps = {
  searchParams?: {
    category?: string;
  };
};

export default async function DashboardPage(props: DashboardPageProps) {
  const currentUser = await getCurrentUser();
  
  // Redirect to home/login if not authenticated
  if (!currentUser) {
    redirect('/');
  }

  const searchParams = await props.searchParams;
  const category = searchParams?.category || '';
  
  const db = await getEnhancedDb();
  // TODO (Task B): Currently this query returns ALL tasks from ALL users
  // After you fix the access control in schema.zmodel, this will automatically
  // only return tasks belonging to the current user (thanks to ZenStack)
  const tasks = await db.task.findMany({
    where: {
      category: category && category !== 'all' ? category : undefined,
      authorId: currentUser.id
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  // Calculate unique users
  const uniqueUserIds = new Set<string>(tasks.map((task: typeof tasks[number]) => task.authorId));
  const userCount = uniqueUserIds.size;

  return (
    <div className="h-full flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-4xl flex-1 flex flex-col min-h-0">
        {/* Greeting Section */}
        <div className="shrink-0 mb-6">
          <h1 className="text-3xl font-bold" data-testid="user-greeting">
            Hello, {currentUser.name}
          </h1>
        </div>

        {/* Header Section - Fixed */}
        <div className="shrink-0 mb-6">
          <TaskListHeader taskCount={tasks.length} userCount={userCount} />
        </div>

        {/* Filters Section - Fixed */}
        <div className="shrink-0">
          <TaskFilters currentCategory={category} />
        </div>

        {/* Scrollable Task List */}
        <div className="flex-1 overflow-y-auto -mx-4 px-4">
          <div className="space-y-4 pb-4">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">
                No tasks yet. Click New Task to create your first task!
              </p>
            ) : (
              tasks.map((task: typeof tasks[number]) => (
                <TaskCard key={task.id} task={task} currentUserId={currentUser.id} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


