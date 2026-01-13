# Task Glitch - ROI-Based Task Management App

A modern, bug-free task management application designed for sales teams to track, manage, and prioritize tasks based on Return on Investment (ROI).

![Task Manager](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue)

## 🚀 Live Demo

[View Live App](https://your-deployment-url.vercel.app)

## ✨ Features

- **Task CRUD Operations** - Create, read, update, and delete tasks
- **ROI Calculation** - Automatic ROI calculation (Revenue ÷ Time Taken)
- **Smart Sorting** - Tasks sorted by ROI → Priority → Title (stable sorting)
- **Search & Filter** - Filter by status, priority, or search by keywords
- **Summary Dashboard** - View total revenue, average ROI, efficiency metrics
- **CSV Import/Export** - Bulk import and export tasks
- **Undo Delete** - 5-second window to undo accidental deletions
- **LocalStorage Persistence** - Data persists across browser sessions

## 🐛 Bug Fixes Implemented

### Bug #1: Double Fetch Issue
**Problem:** Task retrieval function ran twice on page load due to React StrictMode and improper useEffect setup.

**Solution:** Implemented a `useRef` flag (`hasInitialized`) to ensure data loading only happens once, regardless of StrictMode's double-invocation behavior.

```typescript
const hasInitialized = useRef(false);

useEffect(() => {
  if (hasInitialized.current) return;
  hasInitialized.current = true;
  // Load data...
}, []);
```

### Bug #2: Undo Snackbar State Management
**Problem:** Closing the snackbar didn't reset `lastDeletedTask` state, causing incorrect undo behavior.

**Solution:** Implemented proper state cleanup in `dismissSnackbar` function that clears both `showUndoSnackbar` and `lastDeletedTask` states.

```typescript
const dismissSnackbar = useCallback(() => {
  setShowUndoSnackbar(false);
  setLastDeletedTask(null);
}, []);
```

### Bug #3: Unstable Sorting (Flickering)
**Problem:** Tasks with identical ROI and priority values caused random reordering on re-renders.

**Solution:** Added a stable tie-breaker using alphabetical title comparison as the tertiary sort criterion.

```typescript
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Primary: ROI descending
    if (a.roi !== b.roi) return b.roi - a.roi;
    // Secondary: Priority descending
    const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    // Tertiary: Title alphabetically (stable)
    return a.title.localeCompare(b.title);
  });
}
```

### Bug #4: Double Dialog Opening (Event Bubbling)
**Problem:** Clicking Edit/Delete buttons also triggered the View dialog due to event propagation.

**Solution:** Added `e.stopPropagation()` to Edit and Delete button handlers.

```typescript
const handleEditClick = (e: React.MouseEvent, task: Task) => {
  e.stopPropagation();
  setEditTask(task);
};

const handleDeleteClick = (e: React.MouseEvent, task: Task) => {
  e.stopPropagation();
  setDeleteTask(task);
};
```

### Bug #5: ROI Calculation Errors
**Problem:** Division by zero, invalid inputs, and NaN values broke the UI.

**Solution:** Implemented safe ROI calculation with comprehensive validation.

```typescript
export function calculateROI(revenue: number | string, timeTaken: number | string): number {
  const rev = typeof revenue === 'string' ? parseFloat(revenue) : revenue;
  const time = typeof timeTaken === 'string' ? parseFloat(timeTaken) : timeTaken;

  // Validate inputs
  if (isNaN(rev) || isNaN(time) || time <= 0 || rev < 0) {
    return 0;
  }

  return Math.round((rev / time) * 100) / 100;
}
```

## 🛠️ Tech Stack

- **Frontend Framework:** React 18.3 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React hooks (useState, useEffect, useCallback, useRef)
- **Icons:** Lucide React
- **Data Persistence:** LocalStorage

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── TaskHeader.tsx         # Header with import/export
│   ├── TaskSummary.tsx        # Metrics dashboard
│   ├── TaskFilters.tsx        # Search and filter controls
│   ├── TaskList.tsx           # Task list with row actions
│   ├── TaskForm.tsx           # Create/edit task dialog
│   ├── TaskViewDialog.tsx     # View task details
│   ├── DeleteConfirmDialog.tsx# Delete confirmation
│   └── UndoSnackbar.tsx       # Undo delete notification
├── hooks/
│   └── useTasks.ts            # Task state management hook
├── lib/
│   ├── taskUtils.ts           # ROI calculation, sorting, filtering
│   ├── csvUtils.ts            # CSV import/export utilities
│   └── utils.ts               # General utilities
├── types/
│   └── task.ts                # TypeScript interfaces
├── pages/
│   └── Index.tsx              # Main application page
└── index.css                  # Global styles & design tokens
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/task-glitch.git

# Navigate to project directory
cd task-glitch

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 📊 Usage Guide

### Creating a Task
1. Click "Add Task" button in the header
2. Fill in task details (title, revenue, time taken, etc.)
3. ROI is automatically calculated as you type
4. Click "Create Task" to save

### Editing a Task
1. Click the pencil icon on any task row
2. Modify the task details
3. Click "Save Changes"

### Deleting a Task
1. Click the trash icon on any task row
2. Confirm deletion in the dialog
3. Use "Undo" in the snackbar within 5 seconds to restore

### Filtering Tasks
- Use the search bar to find tasks by title, description, or notes
- Filter by status (Pending, In Progress, Completed)
- Filter by priority (High, Medium, Low)

### Import/Export
- **Export:** Click "Export" to download all tasks as CSV
- **Import:** Click "Import" and select a CSV file

## 📝 CSV Format

```csv
Title,Description,Revenue,Time Taken,ROI,Priority,Status,Notes,Created At,Updated At
"Enterprise Deal","Q1 proposal",50000,10,5000,high,in-progress,"Decision pending",2024-01-15,2024-01-15
```

## 🎨 Design System

The app uses a carefully crafted design system with:
- **Primary:** Indigo for brand elements
- **Success:** Green for positive metrics
- **Warning:** Amber for attention items
- **Destructive:** Red for errors and deletions
- **Semantic tokens** for consistent theming

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👤 Author

[Your Name](https://github.com/your-username)

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
