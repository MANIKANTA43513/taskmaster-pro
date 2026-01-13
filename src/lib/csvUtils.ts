import { Task, Priority, Status } from '@/types/task';
import { calculateROI, generateId } from './taskUtils';

/**
 * Export tasks to CSV format
 */
export function exportToCSV(tasks: Task[]): string {
  const headers = [
    'Title',
    'Description',
    'Revenue',
    'Time Taken',
    'ROI',
    'Priority',
    'Status',
    'Notes',
    'Created At',
    'Updated At',
  ];

  const rows = tasks.map(task => [
    escapeCSV(task.title),
    escapeCSV(task.description),
    task.revenue.toString(),
    task.timeTaken.toString(),
    task.roi.toString(),
    task.priority,
    task.status,
    escapeCSV(task.notes),
    task.createdAt,
    task.updatedAt,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(tasks: Task[], filename = 'tasks.csv'): void {
  const csv = exportToCSV(tasks);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse CSV file and return tasks
 */
export function parseCSV(csvContent: string): Task[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  // Skip header row
  const dataRows = lines.slice(1);

  return dataRows.map(row => {
    const values = parseCSVRow(row);

    const revenue = parseFloat(values[2]) || 0;
    const timeTaken = parseFloat(values[3]) || 0;
    const priority = validatePriority(values[5]);
    const status = validateStatus(values[6]);
    const now = new Date().toISOString();

    return {
      id: generateId(),
      title: values[0] || 'Untitled Task',
      description: values[1] || '',
      revenue,
      timeTaken,
      roi: calculateROI(revenue, timeTaken),
      priority,
      status,
      notes: values[7] || '',
      createdAt: values[8] || now,
      updatedAt: values[9] || now,
    };
  });
}

/**
 * Import CSV from file
 */
export function importCSV(file: File): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const tasks = parseCSV(content);
        resolve(tasks);
      } catch (error) {
        reject(new Error('Failed to parse CSV file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Escape special characters for CSV
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Parse a CSV row handling quoted values
 */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Validate and return a valid priority
 */
function validatePriority(value: string): Priority {
  const normalized = value?.toLowerCase().trim();
  if (normalized === 'high' || normalized === 'medium' || normalized === 'low') {
    return normalized;
  }
  return 'medium';
}

/**
 * Validate and return a valid status
 */
function validateStatus(value: string): Status {
  const normalized = value?.toLowerCase().trim();
  if (normalized === 'pending' || normalized === 'in-progress' || normalized === 'completed') {
    return normalized;
  }
  return 'pending';
}
