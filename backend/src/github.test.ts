// backend/src/github.test.ts
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { fetchRepositoryFile, fetchRepositoryContents } from './github.js';
import axios from 'axios';

describe('GitHub API Client', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let axiosGetSpy: jest.SpiedFunction<typeof axios.get>;
  let axiosIsAxiosErrorSpy: jest.SpiedFunction<typeof axios.isAxiosError>;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axiosGetSpy = jest.spyOn(axios, 'get');
    axiosIsAxiosErrorSpy = jest.spyOn(axios, 'isAxiosError');
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
    consoleErrorSpy.mockRestore(); // Restore original console.error
    axiosGetSpy.mockRestore();
    axiosIsAxiosErrorSpy.mockRestore();
  });

  it('should fetch content of a file from a public repository', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'test-file.md';
    const expectedContent = 'Test file content.';

    axiosGetSpy.mockResolvedValueOnce({ data: expectedContent });
    axiosIsAxiosErrorSpy.mockReturnValue(false);

    const content = await fetchRepositoryFile(owner, repo, path);
    expect(content).toEqual(expectedContent);
    expect(axiosGetSpy).toHaveBeenCalledWith(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
        },
      }
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should throw an error if fetching a file fails with an AxiosError (with response)', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'nonexistent-file.md';
    const errorMessage = 'Request failed with status code 404';
    const axiosError = new Error(errorMessage);
    (axiosError as any).isAxiosError = true;
    (axiosError as any).response = { status: 404, data: 'Not Found' };

    axiosGetSpy.mockRejectedValueOnce(axiosError);
    axiosIsAxiosErrorSpy.mockReturnValue(true);

    await expect(fetchRepositoryFile(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(axiosIsAxiosErrorSpy).toHaveBeenCalledWith(axiosError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error fetching file from GitHub: ${errorMessage}`);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Status: 404, Data: "Not Found"`);
  });

  it('should throw an error if fetching a file fails with an AxiosError (no response)', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'nonexistent-file.md';
    const errorMessage = 'Network Error';
    const axiosError = new Error(errorMessage);
    (axiosError as any).isAxiosError = true;
    (axiosError as any).response = undefined; // Simulate no response

    axiosGetSpy.mockRejectedValueOnce(axiosError);
    axiosIsAxiosErrorSpy.mockReturnValue(true);

    await expect(fetchRepositoryFile(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(axiosIsAxiosErrorSpy).toHaveBeenCalledWith(axiosError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error fetching file from GitHub: ${errorMessage}`);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('Status:')); // Ensure no status logging
  });

  it('should throw an error if fetching a file fails with a generic error', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'nonexistent-file.md';
    const errorMessage = 'Network Error';
    const genericError = new Error(errorMessage);

    axiosGetSpy.mockRejectedValueOnce(genericError);
    axiosIsAxiosErrorSpy.mockReturnValue(false);

    await expect(fetchRepositoryFile(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(axiosIsAxiosErrorSpy).toHaveBeenCalledWith(genericError);
    expect(consoleErrorSpy).toHaveBeenCalledWith('An unexpected error occurred:', genericError);
  });

  it('should fetch the contents of a directory from a public repository', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'test-dir';
    const expectedContents = [
      { name: 'file1.txt', type: 'file', path: 'test-dir/file1.txt' },
      { name: 'subdir', type: 'dir', path: 'test-dir/subdir' },
    ];

    axiosGetSpy.mockResolvedValueOnce({ data: expectedContents });
    axiosIsAxiosErrorSpy.mockReturnValue(false);

    const contents = await fetchRepositoryContents(owner, repo, path);
    expect(contents).toEqual(expectedContents);
    expect(axiosGetSpy).toHaveBeenCalledWith(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should throw an error if fetching directory contents fails with an AxiosError (with response)', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'nonexistent-dir';
    const errorMessage = 'Request failed with status code 404';
    const axiosError = new Error(errorMessage);
    (axiosError as any).isAxiosError = true;
    (axiosError as any).response = { status: 404, data: 'Not Found' };

    axiosGetSpy.mockRejectedValueOnce(axiosError);
    axiosIsAxiosErrorSpy.mockReturnValue(true);

    await expect(fetchRepositoryContents(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(axiosIsAxiosErrorSpy).toHaveBeenCalledWith(axiosError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error fetching directory contents from GitHub: ${errorMessage}`);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Status: 404, Data: "Not Found"`);
  });

  it('should throw an error if fetching directory contents fails with an AxiosError (no response)', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'nonexistent-dir';
    const errorMessage = 'Network Error';
    const axiosError = new Error(errorMessage);
    (axiosError as any).isAxiosError = true;
    (axiosError as any).response = undefined; // Simulate no response

    axiosGetSpy.mockRejectedValueOnce(axiosError);
    axiosIsAxiosErrorSpy.mockReturnValue(true);

    await expect(fetchRepositoryContents(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(axiosIsAxiosErrorSpy).toHaveBeenCalledWith(axiosError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error fetching directory contents from GitHub: ${errorMessage}`);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('Status:'));
  });

  it('should throw an error if fetching directory contents fails with a generic error', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'nonexistent-dir';
    const errorMessage = 'Network Error';
    const genericError = new Error(errorMessage);

    axiosGetSpy.mockRejectedValueOnce(genericError);
    axiosIsAxiosErrorSpy.mockReturnValue(false);

    await expect(fetchRepositoryContents(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(axiosIsAxiosErrorSpy).toHaveBeenCalledWith(genericError);
    expect(consoleErrorSpy).toHaveBeenCalledWith('An unexpected error occurred:', genericError);
  });
});
