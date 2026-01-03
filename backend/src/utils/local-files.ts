import fs from 'node:fs/promises';

/**
 * Reads a file from the local filesystem.
 * @param filePath The absolute or relative path to the file.
 * @returns The file content as a string.
 * @throws Error if the file cannot be read.
 */
export const readLocalFile = async (filePath: string): Promise<string> => {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
    } catch (error) {
        console.error(`Error reading local file at ${filePath}:`, error);
        throw new Error(`Failed to read local file: ${error instanceof Error ? error.message : String(error)}`);
    }
};
