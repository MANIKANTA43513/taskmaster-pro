import { Task } from '@/types/task';
import { formatCurrency, formatROI } from '@/lib/taskUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, DollarSign, TrendingUp, FileText } from 'lucide-react';

interface TaskViewDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskViewDialog({ task, open, onOpenChange }: TaskViewDialogProps) {
  if (!task) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-2">
            <Badge className={priorityStyles[task.priority]} variant="outline">
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </Badge>
            <Badge className={statusStyles[task.status]}>
              {statusLabels[task.status]}
            </Badge>
          </div>

          {task.description && (
            <p className="text-muted-foreground">{task.description}</p>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <DollarSign className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="font-semibold">{formatCurrency(task.revenue)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time Taken</p>
                <p className="font-semibold">{task.timeTaken} hrs</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <TrendingUp className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Return on Investment</p>
              <p className="text-2xl font-bold text-primary">{formatROI(task.roi)}</p>
            </div>
          </div>

          {task.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Notes</span>
              </div>
              <p className="text-sm p-3 rounded-lg bg-secondary/50">{task.notes}</p>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
