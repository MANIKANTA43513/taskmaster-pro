export type Priority = 'high' | 'medium' | 'low';
export type Status = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  revenue: number;
  timeTaken: number;
  roi: number;
  priority: Priority;
  status: Status;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  revenue: number | string;
  timeTaken: number | string;
  priority: Priority;
  status: Status;
  notes: string;
}

export interface TaskFilters {
  search: string;
  status: Status | 'all';
  priority: Priority | 'all';
}

export interface TaskSummary {
  totalTasks: number;
  completedTasks: number;
  totalRevenue: number;
  averageROI: number;
  efficiency: number;
  performanceGrade: string;
}
