import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, TaskFormData, TaskFilters } from '@/types/task';
import {
  createTask,
  updateTask as updateTaskUtil,
  sortTasks,
  filterTasks,
  calculateSummary,
} from '@/lib/taskUtils';

const STORAGE_KEY = 'task-glitch-tasks';

// Sample tasks for initial load
const sampleTasks: Task[] = [
  {
    id: 'sample_1',
    title: 'Enterprise Client Proposal',
    description: 'Prepare and send proposal for Q1 enterprise deal',
    revenue: 50000,
    timeTaken: 10,
    roi: 5000,
    priority: 'high',
    status: 'in-progress',
    notes: 'Decision expected by end of month',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'sample_2',
    title: 'Follow-up Call with Acme Corp',
    description: 'Schedule demo and discuss pricing',
    revenue: 15000,
    timeTaken: 2,
    roi: 7500,
    priority: 'high',
    status: 'pending',
    notes: 'Contact: John Smith, VP of Operations',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z',
  },
  {
    id: 'sample_3',
    title: 'Renewal Discussion - TechStart',
    description: 'Annual contract renewal negotiation',
    revenue: 25000,
    timeTaken: 5,
    roi: 5000,
    priority: 'medium',
    status: 'completed',
    notes: 'Upgraded to premium tier',
    createdAt: '2024-01-13T14:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
  {
    id: 'sample_4',
    title: 'Cold Outreach Campaign',
    description: 'Email sequence for new prospects',
    revenue: 8000,
    timeTaken: 8,
    roi: 1000,
    priority: 'low',
    status: 'pending',
    notes: 'Using new email templates',
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-12T08:00:00Z',
  },
  {
    id: 'sample_5',
    title: 'Product Demo - GlobalTech',
    description: 'Live demonstration for technical team',
    revenue: 35000,
    timeTaken: 3,
    roi: 11666.67,
    priority: 'high',
    status: 'pending',
    notes: 'Include integration capabilities',
    createdAt: '2024-01-11T16:00:00Z',
    updatedAt: '2024-01-11T16:00:00Z',
  },
];

interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  summary: ReturnType<typeof calculateSummary>;
  isLoading: boolean;
  lastDeletedTask: Task | null;
  showUndoSnackbar: boolean;
  addTask: (formData: TaskFormData) => void;
  editTask: (id: string, formData: TaskFormData) => void;
  deleteTask: (id: string) => void;
  undoDelete: () => void;
  dismissSnackbar: () => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  importTasks: (newTasks: Task[]) => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFiltersState] = useState<TaskFilters>({
    search: '',
    status: 'all',
    priority: 'all',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [showUndoSnackbar, setShowUndoSnackbar] = useState(false);

  /**
   * BUG FIX #1: Prevent double fetch
   * Use a ref to track if initial load has happened
   */
  const hasInitialized = useRef(false);

  // Load tasks from localStorage on mount - only once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    console.log('Fetching data...');
    
    const loadTasks = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setTasks(parsed);
        } else {
          // Use sample tasks for first-time users
          setTasks(sampleTasks);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
        setTasks(sampleTasks);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate async load
    setTimeout(loadTasks, 100);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && hasInitialized.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  /**
   * BUG FIX #2: Auto-dismiss snackbar timer
   * Properly clears state when snackbar closes
   */
  useEffect(() => {
    if (!showUndoSnackbar) return;

    const timer = setTimeout(() => {
      dismissSnackbar();
    }, 5000);

    return () => clearTimeout(timer);
  }, [showUndoSnackbar]);

  const addTask = useCallback((formData: TaskFormData) => {
    const newTask = createTask(formData);
    setTasks(prev => [...prev, newTask]);
  }, []);

  const editTask = useCallback((id: string, formData: TaskFormData) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? updateTaskUtil(task, formData) : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setLastDeletedTask(taskToDelete);
      setShowUndoSnackbar(true);
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  }, [tasks]);

  const undoDelete = useCallback(() => {
    if (lastDeletedTask) {
      setTasks(prev => [...prev, lastDeletedTask]);
      dismissSnackbar();
    }
  }, [lastDeletedTask]);

  /**
   * BUG FIX #2: Proper snackbar dismissal
   * Always clear the lastDeletedTask when snackbar closes
   */
  const dismissSnackbar = useCallback(() => {
    setShowUndoSnackbar(false);
    setLastDeletedTask(null);
  }, []);

  const setFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const importTasks = useCallback((newTasks: Task[]) => {
    setTasks(prev => [...prev, ...newTasks]);
  }, []);

  // Apply filters and sorting
  const filteredTasks = sortTasks(filterTasks(tasks, filters));
  const summary = calculateSummary(tasks);

  return {
    tasks,
    filteredTasks,
    filters,
    summary,
    isLoading,
    lastDeletedTask,
    showUndoSnackbar,
    addTask,
    editTask,
    deleteTask,
    undoDelete,
    dismissSnackbar,
    setFilters,
    importTasks,
  };
}
