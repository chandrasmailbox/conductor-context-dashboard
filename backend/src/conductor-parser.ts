// backend/src/conductor-parser.ts
export interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
}

interface Track {
  title: string;
  link: string;
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
  checkpoint?: string; // Optional checkpoint string
}

export interface ParsedPlan {
  title: string; // The main title of the plan, e.g., "Plan: Progress Visualization Dashboard MVP"
  phases: Phase[];
}

const CONDUCTOR_FILE_NAMES = ['tracks.md', 'plan.md', 'setup_state.json'];

export const identifyConductorFiles = (fileList: GitHubContent[]): GitHubContent[] => {
    return fileList.filter(file => {
        // Check if the file is a file (not a directory) and its name is in our list of Conductor file names.
        // We also check if the path contains 'conductor/' to ensure it's within a Conductor context.
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

  const trackTitleRegex = /^## \[[ ~x]\] Track: (.*)$/;
  const trackLinkRegex = /^\*Link: \[(.*?)\]\((.*?)\)\*$/;

  let currentTrackTitle: string | null = null;

  for (const line of lines) {
    const titleMatch = line.match(trackTitleRegex);
    if (titleMatch && titleMatch[1]) {
      currentTrackTitle = titleMatch[1].trim();
      continue;
    }

    const linkMatch = line.match(trackLinkRegex);
    if (linkMatch && linkMatch[2] && currentTrackTitle) {
      tracks.push({
        title: currentTrackTitle,
        link: linkMatch[2].trim()
      });
      currentTrackTitle = null; // Reset for the next track
    }
  }

  return { tracks };
};

export const parsePlanMd = (content: string): ParsedPlan => {
  const parsedPlan: ParsedPlan = { title: '', phases: [] };
  const lines = content.split('\n');

  const planTitleRegex = /^# Plan: (.*)$/;
  const phaseRegex = /^## (Phase \d+: .*?)(?: \[checkpoint: (.*?)\])?$/;
  const taskRegex = /^- \[(x|~| )\] (Task: .*)$/;
  const subtaskRegex = /^\s*\* - \[(x|~| )\] (.*)$/;

  let currentPhase: Phase | null = null;
  let currentTask: Task | null = null;

  const getStatus = (statusChar: string): 'completed' | 'in_progress' | 'pending' => {
    if (statusChar === 'x') return 'completed';
    if (statusChar === '~') return 'in_progress';
    return 'pending';
  };

  for (const line of lines) {
    const planTitleMatch = line.match(planTitleRegex);
    if (planTitleMatch && planTitleMatch[1]) {
      parsedPlan.title = planTitleMatch[1].trim();
      continue;
    }

    const phaseMatch = line.match(phaseRegex);
    if (phaseMatch && phaseMatch[1]) {
      currentPhase = {
        title: phaseMatch[1].trim(),
        tasks: [],
        ...(phaseMatch[2] && { checkpoint: phaseMatch[2].trim() })
      };
      parsedPlan.phases.push(currentPhase);
      currentTask = null; // Reset current task when a new phase starts
      continue;
    }

    const taskMatch = line.match(taskRegex);
    if (taskMatch && taskMatch[1] && taskMatch[2] && currentPhase) {
      currentTask = {
        description: taskMatch[2].trim(),
        status: getStatus(taskMatch[1]),
        subtasks: []
      };
      currentPhase.tasks.push(currentTask);
      continue;
    }

    const subtaskMatch = line.match(subtaskRegex);
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



