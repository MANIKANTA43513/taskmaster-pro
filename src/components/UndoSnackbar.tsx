import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UndoSnackbarProps {
  show: boolean;
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function UndoSnackbar({
  show,
  message,
  onUndo,
  onDismiss,
  duration = 5000,
}: UndoSnackbarProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!show) {
      setProgress(100);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [show, duration]);

  if (!show) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'animate-slide-up'
      )}
    >
      <div className="bg-foreground text-background rounded-lg shadow-lg overflow-hidden min-w-[320px]">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-sm flex-1">{message}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={onUndo}
            className="text-background hover:text-background hover:bg-background/20 gap-1"
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onDismiss}
            className="h-8 w-8 text-background/70 hover:text-background hover:bg-background/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="h-1 bg-background/20">
          <div
            className="h-full bg-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
