import { CheckCircle2, Clock, Circle, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { cn } from "../utils/cn";

// Define styles using Tailwind classes directly since we don't have the same CSS classes
const statusConfig = {
  completed: {
    icon: CheckCircle2,
    badge: "COMPLETED",
    className: "text-emerald-500 border-emerald-500",
    lineClass: "bg-emerald-500",
    bgClass: "bg-emerald-500/10",
  },
  in_progress: {
    icon: Clock,
    badge: "IN PROGRESS",
    className: "text-amber-500 border-amber-500",
    lineClass: "bg-amber-500",
    bgClass: "bg-amber-500/10",
  },
  pending: {
    icon: Circle,
    badge: "PENDING",
    className: "text-muted-foreground border-border",
    lineClass: "bg-border",
    bgClass: "bg-muted",
  },
  blocked: {
    icon: Circle,
    badge: "BLOCKED",
    className: "text-rose-500 border-rose-500",
    lineClass: "bg-rose-500",
    bgClass: "bg-rose-500/10",
  }
};

export interface Task {
  description: string;
  status: string;
  commit_sha?: string;
}

export interface Phase {
  title: string;
  status: string;
  tasks?: Task[];
}

interface StageTimelineProps {
  stages: Phase[]; // Renaming prop to match data structure but keeping type generic
  repoUrl?: string;
}

function PhaseItem({ phase, index, isLast, repoUrl }: { phase: Phase; index: number; isLast: boolean; repoUrl?: string }) {
  const [expanded, setExpanded] = useState(false);
  const statusKey = phase.status as keyof typeof statusConfig;
  const config = statusConfig[statusKey] || statusConfig.pending;
  const Icon = config.icon;
  const isActive = phase.status === "in_progress";

  const completedTasks = phase.tasks?.filter(t => t.status === "completed").length || 0;
  const totalTasks = phase.tasks?.length || 0;

  return (
    <div className="relative" data-testid={`phase-${index}`}>
      {/* Connector line */}
      {!isLast && (
        <div
          className={cn(
            "absolute left-5 top-12 bottom-0 w-0.5",
            config.lineClass
          )}
        />
      )}

      <div
        className={cn(
          "relative flex gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200",
          "hover:bg-muted/50",
          isActive && "bg-muted/30"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Status icon */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10",
          "bg-background border-2",
          config.className
        )}>
          <Icon
            className="w-5 h-5"
            strokeWidth={1.5}
          />
        </div>

        {/* Phase content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{phase.title}</h3>
            <Badge
              variant="outline"
              className={cn("text-[10px] px-2 py-0 uppercase tracking-wide", config.className)}     
            >
              {config.badge}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{completedTasks}/{totalTasks} tasks</span>
            {totalTasks > 0 && (
              <span className="flex items-center gap-1">
                {expanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                {expanded ? "Hide" : "Show"} tasks
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded task list */}
      <AnimatePresence>
        {expanded && phase.tasks && phase.tasks.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-14 mt-2 space-y-1 pb-4">
              {phase.tasks.map((task, taskIndex) => {
                const taskStatusKey = task.status as keyof typeof statusConfig;
                const taskConfig = statusConfig[taskStatusKey] || statusConfig.pending;
                const TaskIcon = taskConfig.icon;
                return (
                  <div
                    key={taskIndex}
                    className="flex items-center gap-3 p-2 rounded text-sm hover:bg-muted/30"
                    data-testid={`task-${index}-${taskIndex}`}
                  >
                    <TaskIcon
                      className={cn("w-4 h-4 shrink-0", taskConfig.className)}        
                      strokeWidth={1.5}
                    />
                    <span className={cn(
                      "flex-1 truncate",
                      task.status === "completed" && "text-muted-foreground line-through"
                    )}>
                      {task.description}
                    </span>
                    {task.commit_sha && repoUrl && (
                      <a
                        href={`${repoUrl}/commit/${task.commit_sha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-primary hover:underline font-mono bg-muted px-1.5 py-0.5 rounded"
                      >
                        {task.commit_sha.substring(0, 7)}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StageTimeline({ stages, repoUrl }: StageTimelineProps) {
  if (!stages || stages.length === 0) {
    return (
      <Card className="border card-hover" data-testid="stage-timeline-empty">
        <CardHeader className="border-b border-border/50 pb-4">
          <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
            Development Timeline
          </p>
          <CardTitle>No Phases Found</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground">
            No Conductor phases detected in this repository.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border card-hover" data-testid="stage-timeline">
      <CardHeader className="border-b border-border/50 pb-4">
        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
          Development Timeline
        </p>
        <CardTitle>Project Phases</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {stages.map((stage, index) => (
            <PhaseItem
              key={index}
              phase={stage}
              index={index}
              isLast={index === stages.length - 1}
              repoUrl={repoUrl}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}