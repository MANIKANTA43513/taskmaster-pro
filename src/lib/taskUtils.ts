import { Task, TaskFormData, TaskSummary, Priority } from '@/types/task';

/**
 * BUG FIX #5: Safe ROI calculation
 * Handles division by zero and invalid inputs
 */
export function calculateROI(revenue: number | string, timeTaken: number | string): number {
  const rev = typeof revenue === 'string' ? parseFloat(revenue) : revenue;
  const time = typeof timeTaken === 'string' ? parseFloat(timeTaken) : timeTaken;

  // Validate inputs
  if (isNaN(rev) || isNaN(time) || time <= 0 || rev < 0) {
    return 0;
  }

  // Calculate and round to 2 decimal places
  const roi = rev / time;
  return Math.round(roi * 100) / 100;
}

/**
 * Format ROI for display
 */
export function formatROI(roi: number): string {
  if (!isFinite(roi) || isNaN(roi)) {
    return '—';
  }
  return roi.toFixed(2);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Priority weight for sorting
 */
const priorityWeight: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * BUG FIX #3: Stable sorting with tie-breakers
 * Sort by: ROI (desc) → Priority (desc) → Title (asc)
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Primary: ROI descending
    if (a.roi !== b.roi) {
      return b.roi - a.roi;
    }

    // Secondary: Priority descending
    const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    // Tertiary: Title alphabetically (stable tie-breaker)
    return a.title.localeCompare(b.title);
  });
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new task from form data
 */
export function createTask(formData: TaskFormData): Task {
  const revenue = typeof formData.revenue === 'string' ? parseFloat(formData.revenue) || 0 : formData.revenue;
  const timeTaken = typeof formData.timeTaken === 'string' ? parseFloat(formData.timeTaken) || 0 : formData.timeTaken;

  const now = new Date().toISOString();

  return {
    id: generateId(),
    title: formData.title.trim(),
    description: formData.description.trim(),
    revenue,
    timeTaken,
    roi: calculateROI(revenue, timeTaken),
    priority: formData.priority,
    status: formData.status,
    notes: formData.notes.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update an existing task
 */
export function updateTask(existingTask: Task, formData: TaskFormData): Task {
  const revenue = typeof formData.revenue === 'string' ? parseFloat(formData.revenue) || 0 : formData.revenue;
  const timeTaken = typeof formData.timeTaken === 'string' ? parseFloat(formData.timeTaken) || 0 : formData.timeTaken;

  return {
    ...existingTask,
    title: formData.title.trim(),
    description: formData.description.trim(),
    revenue,
    timeTaken,
    roi: calculateROI(revenue, timeTaken),
    priority: formData.priority,
    status: formData.status,
    notes: formData.notes.trim(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate task summary/metrics
 */
export function calculateSummary(tasks: Task[]): TaskSummary {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalRevenue = tasks.reduce((sum, t) => sum + t.revenue, 0);

  const validROIs = tasks.filter(t => t.roi > 0);
  const averageROI = validROIs.length > 0
    ? validROIs.reduce((sum, t) => sum + t.roi, 0) / validROIs.length
    : 0;

  const efficiency = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Performance grade based on average ROI
  let performanceGrade: string;
  if (averageROI >= 100) performanceGrade = 'A+';
  else if (averageROI >= 75) performanceGrade = 'A';
  else if (averageROI >= 50) performanceGrade = 'B';
  else if (averageROI >= 25) performanceGrade = 'C';
  else performanceGrade = 'D';

  return {
    totalTasks,
    completedTasks,
    totalRevenue,
    averageROI: Math.round(averageROI * 100) / 100,
    efficiency: Math.round(efficiency * 10) / 10,
    performanceGrade,
  };
}

/**
 * Filter tasks based on criteria
 */
export function filterTasks(
  tasks: Task[],
  filters: { search: string; status: string; priority: string }
): Task[] {
  return tasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.notes.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    return true;
  });
}
