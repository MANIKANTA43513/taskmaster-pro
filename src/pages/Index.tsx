import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskHeader } from '@/components/TaskHeader';
import { TaskSummary } from '@/components/TaskSummary';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { UndoSnackbar } from '@/components/UndoSnackbar';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const {
    tasks,
    filteredTasks,
    filters,
    summary,
    isLoading,
    showUndoSnackbar,
    lastDeletedTask,
    addTask,
    editTask,
    deleteTask,
    undoDelete,
    dismissSnackbar,
    setFilters,
    importTasks,
  } = useTasks();

  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TaskHeader
        tasks={tasks}
        onAddClick={() => setShowAddForm(true)}
        onImport={importTasks}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary Metrics */}
        <TaskSummary summary={summary} />

        {/* Filters */}
        <TaskFilters filters={filters} onFiltersChange={setFilters} />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onEdit={editTask}
          onDelete={deleteTask}
        />
      </main>

      {/* Add Task Form */}
      <TaskForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSubmit={addTask}
        mode="create"
      />

      {/* Undo Snackbar */}
      <UndoSnackbar
        show={showUndoSnackbar}
        message={`"${lastDeletedTask?.title}" was deleted`}
        onUndo={undoDelete}
        onDismiss={dismissSnackbar}
      />
    </div>
  );
};

export default Index;
