// backend/src/utils/calculations.test.ts
import { describe, it, expect } from '@jest/globals';
import { calculateCompletion } from './calculations.js';
import type { Task, Stage } from '../models/progress.js';

describe('Completion Calculation', () => {
  it('should calculate 0% when no tasks are completed', () => {
    const tasks: Task[] = [
      { id: '1', description: 'Task 1', status: 'pending', subtasks: [] },
      { id: '2', description: 'Task 2', status: 'pending', subtasks: [] },
    ] as any;
    expect(calculateCompletion(tasks)).toBe(0);
  });

  it('should calculate 100% when all tasks are completed', () => {
    const tasks: Task[] = [
      { id: '1', description: 'Task 1', status: 'completed', subtasks: [] },
      { id: '2', description: 'Task 2', status: 'completed', subtasks: [] },
    ] as any;
    expect(calculateCompletion(tasks)).toBe(100);
  });

  it('should calculate 50% when half tasks are completed', () => {
    const tasks: Task[] = [
      { id: '1', description: 'Task 1', status: 'completed', subtasks: [] },
      { id: '2', description: 'Task 2', status: 'pending', subtasks: [] },
    ] as any;
    expect(calculateCompletion(tasks)).toBe(50);
  });
  
  it('should round to integer', () => {
      const tasks: Task[] = [
      { id: '1', description: 'Task 1', status: 'completed', subtasks: [] },
      { id: '2', description: 'Task 2', status: 'pending', subtasks: [] },
      { id: '3', description: 'Task 3', status: 'pending', subtasks: [] },
    ] as any;
    // 1/3 = 33.33%
    expect(calculateCompletion(tasks)).toBe(33);
  });

  it('should handle empty task list', () => {
      expect(calculateCompletion([])).toBe(0);
  });
});
