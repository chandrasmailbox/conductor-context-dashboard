// backend/src/utils/status.test.ts
import { describe, it, expect } from '@jest/globals';
import { deriveStatus } from './status.js';
import type { Task, Status } from '../models/progress.js';

describe('Status Tracking', () => {
  it('should return "completed" if all subtasks are completed', () => {
    const subtasks = [
      { description: 'Subtask 1', status: 'completed' },
      { description: 'Subtask 2', status: 'completed' },
    ] as any;
    expect(deriveStatus(subtasks)).toBe('completed');
  });

  it('should return "in_progress" if any subtask is in_progress', () => {
    const subtasks = [
      { description: 'Subtask 1', status: 'completed' },
      { description: 'Subtask 2', status: 'in_progress' },
      { description: 'Subtask 3', status: 'pending' },
    ] as any;
    expect(deriveStatus(subtasks)).toBe('in_progress');
  });

  it('should return "pending" if all subtasks are pending', () => {
    const subtasks = [
      { description: 'Subtask 1', status: 'pending' },
      { description: 'Subtask 2', status: 'pending' },
    ] as any;
    expect(deriveStatus(subtasks)).toBe('pending');
  });
  
  it('should return "in_progress" if some are completed and some pending (no in_progress explicit)', () => {
       const subtasks = [
      { description: 'Subtask 1', status: 'completed' },
      { description: 'Subtask 2', status: 'pending' },
    ] as any;
    expect(deriveStatus(subtasks)).toBe('in_progress');
  });

  it('should handle empty subtasks (default to pending or provided default)', () => {
    // If a task has no subtasks, its status is likely manually set, but if we *must* derive it:
    expect(deriveStatus([])).toBe('pending');
  });
});
