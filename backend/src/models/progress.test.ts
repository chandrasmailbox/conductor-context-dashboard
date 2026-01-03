// backend/src/models/progress.test.ts
import { describe, it, expect } from '@jest/globals';
import type { ProgressData, Stage, Task, Status } from './progress.js';

describe('Progress Data Model', () => {
  it('should allow creating a valid ProgressData object', () => {
    const task: Task = {
      id: 'task-1',
      description: 'Test Task',
      status: 'completed',
      commitHash: 'abc1234'
    };

    const stage: Stage = {
      id: 'stage-1',
      title: 'Test Stage',
      status: 'completed',
      tasks: [task],
      checkpoint: 'def5678',
      completionPercentage: 100
    };

    const progressData: ProgressData = {
      projectName: 'Test Project',
      overallCompletion: 50,
      stages: [stage],
      lastUpdated: new Date().toISOString(),
      currentPhase: 'Test Stage',
      currentTask: 'Next Task'
    };

    expect(progressData.projectName).toBe('Test Project');
    expect(progressData.stages).toHaveLength(1);
    expect(progressData.stages[0].tasks).toHaveLength(1);
    expect(progressData.stages[0].tasks[0].status).toBe('completed');
  });

  it('should accept different status values', () => {
      const statuses: Status[] = ['completed', 'in_progress', 'pending', 'blocked'];
      statuses.forEach(status => {
          const task: Task = { id: '1', description: 'desc', status: status };
          expect(task.status).toBe(status);
      });
  });
});
