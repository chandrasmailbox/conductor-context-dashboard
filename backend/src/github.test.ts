// backend/src/github.test.ts
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { fetchRepositoryFile, fetchRepositoryContents } from './github.js';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
  default: {
    ...jest.requireActual('axios'),
    get: jest.fn(),
    isAxiosError: jest.fn(),
  },
  isAxiosError: jest.fn(),
}));
const mockedAxios = (await import('axios')).default as jest.Mocked<typeof axios>;

describe('GitHub API Client', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
    consoleErrorSpy.mockRestore(); // Restore original console.error
  });

  it('should fetch content of a file from a public repository', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'test-file.md';
    const expectedContent = 'Test file content.';

    mockedAxios.get.mockResolvedValueOnce({ data: expectedContent });
    mockedAxios.isAxiosError.mockReturnValue(false);

    const content = await fetchRepositoryFile(owner, repo, path);
    expect(content).toEqual(expectedContent);
    expect(mockedAxios.get).toHaveBeenCalledWith(
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

    mockedAxios.get.mockRejectedValueOnce(axiosError);
    mockedAxios.isAxiosError.mockReturnValue(true);

    await expect(fetchRepositoryFile(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(mockedAxios.isAxiosError).toHaveBeenCalledWith(axiosError);
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

    mockedAxios.get.mockRejectedValueOnce(axiosError);
    mockedAxios.isAxiosError.mockReturnValue(true);

    await expect(fetchRepositoryFile(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(mockedAxios.isAxiosError).toHaveBeenCalledWith(axiosError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error fetching file from GitHub: ${errorMessage}`);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('Status:')); // Ensure no status logging
  });

  it('should throw an error if fetching a file fails with a generic error', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'nonexistent-file.md';
    const errorMessage = 'Network Error';
    const genericError = new Error(errorMessage);

    mockedAxios.get.mockRejectedValueOnce(genericError);
    mockedAxios.isAxiosError.mockReturnValue(false);

    await expect(fetchRepositoryFile(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(mockedAxios.isAxiosError).toHaveBeenCalledWith(genericError);
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

    mockedAxios.get.mockResolvedValueOnce({ data: expectedContents });
    mockedAxios.isAxiosError.mockReturnValue(false);

    const contents = await fetchRepositoryContents(owner, repo, path);
    expect(contents).toEqual(expectedContents);
    expect(mockedAxios.get).toHaveBeenCalledWith(
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

    mockedAxios.get.mockRejectedValueOnce(axiosError);
    mockedAxios.isAxiosError.mockReturnValue(true);

    await expect(fetchRepositoryContents(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(mockedAxios.isAxiosError).toHaveBeenCalledWith(axiosError);
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

    mockedAxios.get.mockRejectedValueOnce(axiosError);
    mockedAxios.isAxiosError.mockReturnValue(true);

    await expect(fetchRepositoryContents(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(mockedAxios.isAxiosError).toHaveBeenCalledWith(axiosError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error fetching directory contents from GitHub: ${errorMessage}`);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('Status:'));
  });

  it('should throw an error if fetching directory contents fails with a generic error', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'nonexistent-dir';
    const errorMessage = 'Network Error';
    const genericError = new Error(errorMessage);

    mockedAxios.get.mockRejectedValueOnce(genericError);
    mockedAxios.isAxiosError.mockReturnValue(false);

    await expect(fetchRepositoryContents(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(mockedAxios.isAxiosError).toHaveBeenCalledWith(genericError);
    expect(consoleErrorSpy).toHaveBeenCalledWith('An unexpected error occurred:', genericError);
  });
});
