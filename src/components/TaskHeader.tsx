import { useRef } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { downloadCSV, importCSV } from '@/lib/csvUtils';
import { useToast } from '@/hooks/use-toast';

interface TaskHeaderProps {
  tasks: Task[];
  onAddClick: () => void;
  onImport: (tasks: Task[]) => void;
}

export function TaskHeader({ tasks, onAddClick, onImport }: TaskHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    if (tasks.length === 0) {
      toast({
        title: 'No tasks to export',
        description: 'Create some tasks first before exporting.',
        variant: 'destructive',
      });
      return;
    }
    downloadCSV(tasks, `tasks-${new Date().toISOString().split('T')[0]}.csv`);
    toast({
      title: 'Export successful',
      description: `Exported ${tasks.length} tasks to CSV.`,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedTasks = await importCSV(file);
      onImport(importedTasks);
      toast({
        title: 'Import successful',
        description: `Imported ${importedTasks.length} tasks from CSV.`,
      });
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Failed to parse CSV file. Please check the format.',
        variant: 'destructive',
      });
    }

    // Reset input
    e.target.value = '';
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <p className="text-sm text-muted-foreground">
              Track and prioritize tasks by ROI
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button variant="outline" size="sm" onClick={handleImportClick}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button onClick={onAddClick}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
