import { CheckCircle2, Clock, AlertCircle, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Progress } from "./ui/Progress";

interface ProgressOverviewProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  blockedTasks: number;
  projectName?: string;
  repoName?: string;
  phasesCount: number;
}

export default function ProgressOverview({ 
  progress, 
  completedTasks, 
  totalTasks, 
  inProgressTasks, 
  pendingTasks, 
  blockedTasks,
  projectName,
  repoName,
  phasesCount
}: ProgressOverviewProps) {
  const stats = [
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
      className: "text-emerald-500",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      className: "text-amber-500",
    },
    {
      label: "Pending",
      value: pendingTasks,
      icon: Circle,
      className: "text-slate-500",
    },
    {
      label: "Blocked",
      value: blockedTasks,
      icon: AlertCircle,
      className: "text-rose-500",
    },
  ];

  return (
    <Card className="border card-hover" data-testid="progress-overview">
      <CardHeader className="border-b border-border/50 pb-4">
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
          Overall Progress
        </p>
        <div className="flex items-baseline gap-2">
          <CardTitle className="text-5xl font-extrabold tracking-tight">
            {progress}%
          </CardTitle>
          <span className="text-muted-foreground text-sm">complete</span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            <span>{completedTasks} of {totalTasks} tasks</span>
            <span>{phasesCount} phases</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
            >
              <stat.icon className={`w-4 h-4 ${stat.className}`} strokeWidth={1.5} />
              <div>
                <p className="text-lg font-bold leading-tight">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tighter font-semibold">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {projectName && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">       
              Project
            </p>
            <p className="font-semibold text-sm truncate">{projectName}</p>
            {repoName && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {repoName}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
