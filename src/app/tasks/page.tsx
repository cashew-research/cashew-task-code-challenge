import { getEnhancedDb } from '@/lib/db';
import { TaskListBody } from '../(authenticated)/my-tasks/components/task-list';

// Ditched search params and implemented standalone component (TaskListBody)
// to handle the useState hook connecting both TaskFilter and task rendering.
// Reason: depending on search or url params require more uncessary db queries per filter

export default async function TasksPage() {
  const db = await getEnhancedDb();

  // TODO (Task B - Bonus): This page currently shows ALL tasks
  // After you add the isPublic field and fix access control in schema.zmodel,
  // this page will automatically only show public tasks (thanks to ZenStack)
  const tasks = await db.task.findMany({
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

        <TaskListBody currentUser={null} tasks={tasks} />
      </div>
    </div>
  );
}

