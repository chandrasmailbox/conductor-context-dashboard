// backend/src/models/progress.ts
export type Status = 'completed' | 'in_progress' | 'pending' | 'blocked';

export interface Task {
  id: string;
  description: string;
  status: Status;
  commitHash?: string;
}

export interface Stage {
  id: string;
  title: string;
  status: Status;
  tasks: Task[];
  checkpoint?: string;
  completionPercentage: number;
}

export interface ProgressData {
  projectName: string;
  overallCompletion: number;
  stages: Stage[];
  lastUpdated: string; // ISO 8601 date string
  currentPhase?: string;
  currentTask?: string;
}
