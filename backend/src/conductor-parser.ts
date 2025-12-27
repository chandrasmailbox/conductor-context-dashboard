// backend/src/conductor-parser.ts
import { GitHubContent } from './github';

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
