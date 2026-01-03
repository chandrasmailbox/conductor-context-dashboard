import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.unstable_mockModule('node:child_process', () => ({
  exec: jest.fn(),
}));

const { exec } = await import('node:child_process');
const { fetchLocalCommits } = await import('./local-git.js');

describe('Local Git Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch local commits successfully', async () => {
    const mockOutput = 'sha1|Author Name|2026-01-01T00:00:00Z|Commit message 1\nsha2|Author Name|2026-01-02T00:00:00Z|Commit message 2';
    (exec as unknown as jest.Mock).mockImplementation((cmd, options, callback: any) => {
      callback(null, { stdout: mockOutput, stderr: '' });
    });

    const commits = await fetchLocalCommits('C:/projects/repo');

    expect(commits).toHaveLength(2);
    expect(commits[0]).toEqual({
      sha: 'sha1',
      author: 'Author Name',
      date: '2026-01-01T00:00:00Z',
      message: 'Commit message 1',
    });
  });

  it('should throw an error if git command fails', async () => {
    (exec as unknown as jest.Mock).mockImplementation((cmd, options, callback: any) => {
      callback(new Error('Git error'), { stdout: '', stderr: 'Fatal error' });
    });

    await expect(fetchLocalCommits('C:/invalid')).rejects.toThrow('Failed to fetch local commits');
  });

  it('should return an empty array if no commits are found', async () => {
    (exec as unknown as jest.Mock).mockImplementation((cmd, options, callback: any) => {
      callback(null, { stdout: '', stderr: '' });
    });

    const commits = await fetchLocalCommits('C:/empty');
    expect(commits).toEqual([]);
  });
});
