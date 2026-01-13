import { useState } from 'react';
import { Task, TaskFormData } from '@/types/task';
import { formatCurrency, formatROI } from '@/lib/taskUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, TrendingUp, Clock } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskViewDialog } from './TaskViewDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface TaskListProps {
  tasks: Task[];
  onEdit: (id: string, data: TaskFormData) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const priorityStyles = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };

  const statusStyles = {
    pending: 'status-pending',
    'in-progress': 'status-in-progress',
    completed: 'status-completed',
  };

  const statusLabels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };

  const handleRowClick = (task: Task) => {
    setViewTask(task);
  };

  /**
   * BUG FIX #4: Stop event propagation
   * Prevent row click when clicking edit/delete buttons
   */
  const handleEditClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setEditTask(task);
  };

  const handleDeleteClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setDeleteTask(task);
  };

  const handleEditSubmit = (data: TaskFormData) => {
    if (editTask) {
      onEdit(editTask.id, data);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTask) {
      onDelete(deleteTask.id);
      setDeleteTask(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
          <TrendingUp className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No tasks found</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Create your first task to start tracking ROI and managing your sales pipeline.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="task-row animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => handleRowClick(task)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{task.title}</h3>
                  <Badge className={priorityStyles[task.priority]} variant="outline">
                    {task.priority}
                  </Badge>
                  <Badge className={statusStyles[task.status]}>
                    {statusLabels[task.status]}
                  </Badge>
                </div>

                {task.description && (
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-success font-medium">
                    {formatCurrency(task.revenue)}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {task.timeTaken}h
                  </span>
                  <span className="flex items-center gap-1 text-primary font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    ROI: {formatROI(task.roi)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => handleEditClick(e, task)}
                  className="h-8 w-8"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => handleDeleteClick(e, task)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Dialog */}
      <TaskViewDialog
        task={viewTask}
        open={!!viewTask}
        onOpenChange={(open) => !open && setViewTask(null)}
      />

      {/* Edit Dialog */}
      <TaskForm
        open={!!editTask}
        onOpenChange={(open) => !open && setEditTask(null)}
        onSubmit={handleEditSubmit}
        initialData={editTask ?? undefined}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        task={deleteTask}
        open={!!deleteTask}
        onOpenChange={(open) => !open && setDeleteTask(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
