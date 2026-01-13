import { useState, useEffect } from 'react';
import { TaskFormData, Task, Priority, Status } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { calculateROI, formatROI } from '@/lib/taskUtils';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task;
  mode: 'create' | 'edit';
}

const defaultFormData: TaskFormData = {
  title: '',
  description: '',
  revenue: '',
  timeTaken: '',
  priority: 'medium',
  status: 'pending',
  notes: '',
};

export function TaskForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          description: initialData.description,
          revenue: initialData.revenue,
          timeTaken: initialData.timeTaken,
          priority: initialData.priority,
          status: initialData.status,
          notes: initialData.notes,
        });
      } else {
        setFormData(defaultFormData);
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    const revenue = parseFloat(String(formData.revenue));
    if (isNaN(revenue) || revenue < 0) {
      newErrors.revenue = 'Revenue must be a positive number';
    }

    const timeTaken = parseFloat(String(formData.timeTaken));
    if (isNaN(timeTaken) || timeTaken <= 0) {
      newErrors.timeTaken = 'Time taken must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      onOpenChange(false);
    }
  };

  const previewROI = calculateROI(formData.revenue, formData.timeTaken);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter task title"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter task description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue ($) *</Label>
              <Input
                id="revenue"
                type="number"
                step="0.01"
                min="0"
                value={formData.revenue}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, revenue: e.target.value }))
                }
                placeholder="0.00"
                className={errors.revenue ? 'border-destructive' : ''}
              />
              {errors.revenue && (
                <p className="text-sm text-destructive">{errors.revenue}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeTaken">Time Taken (hrs) *</Label>
              <Input
                id="timeTaken"
                type="number"
                step="0.5"
                min="0.5"
                value={formData.timeTaken}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, timeTaken: e.target.value }))
                }
                placeholder="0"
                className={errors.timeTaken ? 'border-destructive' : ''}
              />
              {errors.timeTaken && (
                <p className="text-sm text-destructive">{errors.timeTaken}</p>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <p className="text-sm text-muted-foreground">Calculated ROI</p>
            <p className="text-2xl font-semibold text-primary">
              {formatROI(previewROI)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Status) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Additional notes..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Task' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
