// backend/src/utils/calculations.ts
import type { Task } from '../models/progress.js';

export const calculateCompletion = (tasks: Task[]): number => {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter(task => task.status === 'completed');
  return Math.floor((completedTasks.length / tasks.length) * 100);
};
