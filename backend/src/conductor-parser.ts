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
