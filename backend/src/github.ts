// backend/src/github.ts
import axios from 'axios';

export interface GitHubContent {
    name: string;
    path: string;
    type: 'file' | 'dir';
}

export interface GitHubCommit {
    sha: string;
    commit: {
        author: {
            name: string;
            date: string;
        };
        message: string;
    };
}

const handleGitHubError = (error: unknown, context: string): never => {
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
                    Accept: 'application/vnd.github.v3.raw',
                },
            }
        );
        return response.data;
    } catch (error) {
        return handleGitHubError(error, 'fetching file');
    }
};

export const fetchRepositoryContents = async (owner: string, repo: string, path: string = ''): Promise<GitHubContent[]> => {
    try {
        const response = await axios.get<GitHubContent[]>(
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
            {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );
        return response.data;
    } catch (error) {
        return handleGitHubError(error, 'fetching directory contents');
    }
};

export const fetchRecentCommits = async (owner: string, repo: string, perPage: number = 10): Promise<GitHubCommit[]> => {
    try {
        const response = await axios.get<GitHubCommit[]>(
            `https://api.github.com/repos/${owner}/${repo}/commits`,
            {
                params: {
                    per_page: perPage,
                },
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );
        return response.data;
    } catch (error) {
        return handleGitHubError(error, 'fetching commits');
    }
};
