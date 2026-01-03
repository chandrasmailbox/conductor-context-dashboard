// backend/src/conductor-parser.ts
export interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
}

interface Track {
  title: string;
  link: string;
  status: 'completed' | 'in_progress' | 'pending';
}

interface ParsedTracks {
  tracks: Track[];
}

export interface SubTask {
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface Task {
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  subtasks: SubTask[];
}

export interface Phase {
  title: string;
  tasks: Task[];
  checkpoint?: string;
}

export interface ParsedPlan {
  title: string;
  phases: Phase[];
}

const CONDUCTOR_FILE_NAMES = ['tracks.md', 'plan.md', 'setup_state.json'];

export const identifyConductorFiles = (fileList: GitHubContent[]): GitHubContent[] => {
    return fileList.filter(file => {
        return file.type === 'file' &&
               CONDUCTOR_FILE_NAMES.includes(file.name) &&
               file.path.includes('conductor/');
    });
};

interface SetupState {
  last_successful_step: string;
}

export const parseSetupState = (content: string): string => {
    try {
        const setupState: SetupState = JSON.parse(content);
        if (typeof setupState.last_successful_step !== 'string') {
            throw new Error('last_successful_step not found or is not a string');
        }
        return setupState.last_successful_step;
    } catch (error) {
        console.error('Error parsing setup_state.json:', error);
        throw new Error('Failed to parse setup_state.json');
    }
};

export const parseTracksMd = (content: string): ParsedTracks => {
  const tracks: Track[] = [];
  const lines = content.split('\n');

  const trackTitleRegex = /^## \[([ ~x])\] Track: (.*)$/; 
  const trackLinkRegex = /^\*Link: \[(.*?)\]\((.*?)\)\*$/;

  let currentTrackTitle: string | null = null;
  let currentTrackStatus: 'completed' | 'in_progress' | 'pending' = 'pending';

  const getStatus = (statusChar: string): 'completed' | 'in_progress' | 'pending' => {
    if (statusChar === 'x') return 'completed';
    if (statusChar === '~') return 'in_progress';
    return 'pending';
  };

  for (const line of lines) {
    const titleMatch = line.match(trackTitleRegex);
    if (titleMatch && titleMatch[1] && titleMatch[2]) {
      currentTrackStatus = getStatus(titleMatch[1]);
      currentTrackTitle = titleMatch[2].trim();
      continue;
    }

    const linkMatch = line.match(trackLinkRegex);
    if (linkMatch && linkMatch[2] && currentTrackTitle) {
      tracks.push({
        title: currentTrackTitle,
        link: linkMatch[2].trim(),
        status: currentTrackStatus
      });
      currentTrackTitle = null; // Reset for the next track
    }
  }

  return { tracks };
};

export const parsePlanMd = (content: string): ParsedPlan => {
  const parsedPlan: ParsedPlan = { title: '', phases: [] };
  const lines = content.split(/\r?\n/);

  const planTitleRegex = /^# Plan: (.*)$/i;
  const phaseRegex = /^## (Phase \d+: .*?)(?: \[checkpoint: (.*?)])?$/i;
  const taskRegex = /^- \[(x|~| )] (.*)$/i;
  const subtaskRegex = /^\s*\*[\s-]+\[(x|~| )] (.*)$/i;

  let currentPhase: Phase | null = null;
  let currentTask: Task | null = null;

  const getStatus = (statusChar: string): 'completed' | 'in_progress' | 'pending' => {
    const char = statusChar.toLowerCase();
    if (char === 'x') return 'completed';
    if (char === '~') return 'in_progress';
    return 'pending';
  };

  for (const line of lines) {
    const trimmedLine = line.trimEnd();
    
    const planTitleMatch = trimmedLine.match(planTitleRegex);
    if (planTitleMatch && planTitleMatch[1]) {
      parsedPlan.title = planTitleMatch[1].trim();
      continue;
    }

    const phaseMatch = trimmedLine.match(phaseRegex);
    if (phaseMatch && phaseMatch[1]) {
      currentPhase = {
        title: phaseMatch[1].trim(),
        tasks: [],
        ...(phaseMatch[2] && { checkpoint: phaseMatch[2].trim() })
      };
      parsedPlan.phases.push(currentPhase);
      currentTask = null;
      continue;
    }

    const taskMatch = trimmedLine.match(taskRegex);
    if (taskMatch && taskMatch[1] && taskMatch[2] && currentPhase) {
      currentTask = {
        description: taskMatch[2].trim(),
        status: getStatus(taskMatch[1]),
        subtasks: []
      };
      currentPhase.tasks.push(currentTask);
      continue;
    }

    const subtaskMatch = trimmedLine.match(subtaskRegex);
    if (subtaskMatch && subtaskMatch[1] && subtaskMatch[2] && currentTask) {
      const subtask: SubTask = {
        description: subtaskMatch[2].trim(),
        status: getStatus(subtaskMatch[1])
      };
      currentTask.subtasks.push(subtask);
      continue;
    }
  }

  return parsedPlan;
};