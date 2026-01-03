import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execPromise = promisify(exec);

export interface LocalCommit {
    sha: string;
    author: string;
    date: string;
    message: string;
}

/**
 * Fetches the recent commit history from a local git repository.
 * @param directoryPath The path to the local repository.
 * @param limit The maximum number of commits to fetch.
 * @returns A list of commit objects.
 */
export const fetchLocalCommits = async (directoryPath: string, limit: number = 10): Promise<LocalCommit[]> => {
    try {
        // %H: Full hash
        // %an: Author name
        // %aI: Author date, strict ISO 8601 format
        // %s: Subject (message)
        const format = '%H|%an|%aI|%s';
        const { stdout } = await execPromise(`git log -n ${limit} --format="${format}"`, {
            cwd: directoryPath,
        });

        if (!stdout.trim()) {
            return [];
        }

        return stdout.trim().split('\n').map(line => {
            const [sha, author, date, message] = line.split('|');
            return {
                sha: sha || '',
                author: author || '',
                date: date || '',
                message: message || '',
            };
        });
    } catch (error) {
        console.error(`Error fetching local commits at ${directoryPath}:`, error);
        throw new Error(`Failed to fetch local commits: ${error instanceof Error ? error.message : String(error)}`);
    }
};
