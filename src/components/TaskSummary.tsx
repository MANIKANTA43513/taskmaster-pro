import { TaskSummary as TaskSummaryType } from '@/types/task';
import { formatCurrency } from '@/lib/taskUtils';
import { TrendingUp, DollarSign, CheckCircle2, Gauge } from 'lucide-react';

interface TaskSummaryProps {
  summary: TaskSummaryType;
}

export function TaskSummary({ summary }: TaskSummaryProps) {
  const metrics = [
    {
      label: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Average ROI',
      value: summary.averageROI.toFixed(2),
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Efficiency',
      value: `${summary.efficiency}%`,
      icon: Gauge,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Completed',
      value: `${summary.completedTasks}/${summary.totalTasks}`,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="metric-card animate-fade-in">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-xl font-semibold">{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
