import { getEnhancedDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-server';
import { TaskListHeader } from './components/task-list-header';
import { redirect } from 'next/navigation';
import { TaskListBody } from './components/task-list';

// Ditched search params and implemented standalone component (TaskListBody)
// to handle the useState hook connecting both TaskFilter and task rendering.
// Reason depending on search or url params require more uncessary db queries per filter

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  
  // Redirect to home/login if not authenticated
  if (!currentUser) {
    redirect('/');
  }

  const db = await getEnhancedDb();
  // TODO (Task B): Currently this query returns ALL tasks from ALL users
  // After you fix the access control in schema.zmodel, this will automatically
  // only return tasks belonging to the current user (thanks to ZenStack)
  const tasks = await db.task.findMany({
    where: {
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

        <TaskListBody currentUser={currentUser} tasks={tasks} />
      </div>
    </div>
  );
}


