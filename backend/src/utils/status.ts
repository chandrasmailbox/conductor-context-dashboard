// backend/src/utils/status.ts
import type { Status } from '../models/progress.js';

export const deriveStatus = (subtasks: { status: string }[]): Status => {
  if (subtasks.length === 0) {
    return 'pending';
  }

  const allCompleted = subtasks.every(t => t.status === 'completed' || t.status === 'x');
  if (allCompleted) return 'completed';

  const anyInProgress = subtasks.some(t => t.status === 'in_progress' || t.status === '~');
  const anyCompleted = subtasks.some(t => t.status === 'completed' || t.status === 'x');
  
  if (anyInProgress || anyCompleted) return 'in_progress';

  return 'pending';
};
