// backend/src/github.test.ts
import { fetchRepositoryFile } from './github';
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
    // Ensure isAxiosError returns false for a successful call (or not called)
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

  it('should throw an error if fetching fails with an AxiosError', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'nonexistent-file.md';
    const errorMessage = 'Request failed with status code 404';
    const axiosError = new Error(errorMessage);
    // Explicitly set the properties that axios.isAxiosError would check
    (axiosError as any).isAxiosError = true;
    (axiosError as any).response = { status: 404, data: 'Not Found' };

    mockedAxios.get.mockRejectedValueOnce(axiosError);
    mockedAxios.isAxiosError.mockReturnValue(true); // isAxiosError should return true for this mock

    await expect(fetchRepositoryFile(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(mockedAxios.isAxiosError).toHaveBeenCalledWith(axiosError);
  });

  it('should throw an error if fetching fails with a generic error', async () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const path = 'nonexistent-file.md';
    const errorMessage = 'Network Error';
    const genericError = new Error(errorMessage);

    mockedAxios.get.mockRejectedValueOnce(genericError);
    mockedAxios.isAxiosError.mockReturnValue(false); // isAxiosError should return false for this mock

    await expect(fetchRepositoryFile(owner, repo, path)).rejects.toThrow(errorMessage);
    expect(mockedAxios.isAxiosError).toHaveBeenCalledWith(genericError);
  });
});
