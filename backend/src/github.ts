// backend/src/github.ts
import axios from 'axios';

export interface GitHubContent {
    name: string;
    path: string;
    type: 'file' | 'dir';
    // Add other properties as needed from GitHub API response
}

const handleGitHubError = (error: unknown, context: string) => {
    if (axios.isAxiosError(error)) {
        console.error(`Error ${context} from GitHub: ${error.message}`);
        if (error.response) {
            console.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
        }
    } else {
        console.error('An unexpected error occurred:', error);
    }
    throw error;
};

export const fetchRepositoryFile = async (owner: string, repo: string, path: string): Promise<string> => {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
            {
                headers: {
                    Accept: 'application/vnd.github.v3.raw', // Request raw content
                },
            }
        );
        return response.data;
    } catch (error) {
        handleGitHubError(error, 'fetching file');
    }
};

export const fetchRepositoryContents = async (owner: string, repo: string, path: string = ''): Promise<GitHubContent[]> => {
    try {
        const response = await axios.get<GitHubContent[]>(
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
            {
                headers: {
                    Accept: 'application/vnd.github.v3+json', // Request structured JSON for contents
                },
            }
        );
        return response.data;
    } catch (error) {
        handleGitHubError(error, 'fetching directory contents');
    }
};