// backend/src/github.ts
import axios from 'axios';

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
        if (axios.isAxiosError(error)) {
            console.error(`Error fetching file from GitHub: ${error.message}`);
            if (error.response) {
                console.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
            }
        } else {
            console.error('An unexpected error occurred:', error);
        }
        throw error;
    }
};