// backend/src/github.test.ts
import { fetchRepositoryFile, fetchRepositoryContents } from './github';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
  ...jest.requireActual('axios'), // Use actual axios for everything else
  isAxiosError: jest.fn(), // Mock isAxiosError
  get: jest.fn(), // Mock get
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GitHub API Client', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
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
  });
});