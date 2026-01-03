import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.unstable_mockModule('node:fs/promises', () => ({
  default: {
    readFile: jest.fn(),
  }
}));

const fs = (await import('node:fs/promises')).default;
const { readLocalFile } = await import('./local-files.js');
import path from 'node:path';

describe('Local File Service', () => {
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read a local file successfully', async () => {
    const filePath = 'C:/test/file.txt';
    const content = 'hello world';
    (mockFs.readFile as jest.Mock).mockResolvedValue(content);

    const result = await readLocalFile(filePath);
    expect(result).toBe(content);
    expect(mockFs.readFile).toHaveBeenCalledWith(filePath, 'utf-8');
  });

  it('should throw an error if file does not exist', async () => {
    (mockFs.readFile as jest.Mock).mockRejectedValue(new Error('ENOENT'));

    await expect(readLocalFile('missing.txt')).rejects.toThrow('Failed to read local file');
  });

  it('should handle different path formats', async () => {
    const filePath = path.join('relative', 'path.txt');
    (mockFs.readFile as jest.Mock).mockResolvedValue('data');

    await readLocalFile(filePath);
    expect(mockFs.readFile).toHaveBeenCalledWith(filePath, 'utf-8');
  });
});
