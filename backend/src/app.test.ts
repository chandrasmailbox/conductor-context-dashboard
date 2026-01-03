import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Use unstable_mockModule for ESM mocking
jest.unstable_mockModule('./github.js', () => ({
  fetchRepositoryContents: jest.fn(),
  fetchRepositoryFile: jest.fn(),
  fetchRecentCommits: jest.fn(),
}));

jest.unstable_mockModule('./conductor-parser.js', () => ({
  identifyConductorFiles: jest.fn(),
  parseSetupState: jest.fn(),
  parseTracksMd: jest.fn(),
  parsePlanMd: jest.fn(),
}));

// We must use dynamic imports for everything that depends on the mocks
const request = (await import('supertest')).default;
const app = (await import('./app.js')).default;
const github = await import('./github.js');
const conductorParser = await import('./conductor-parser.js');

const mockedGithub = github as jest.Mocked<typeof github>;
const mockedConductorParser = conductorParser as jest.Mocked<typeof conductorParser>;

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});

describe('POST /api/v1/verify-phase-2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return 400 if repoUrl is not provided', async () => {
    const res = await request(app).post('/api/v1/verify-phase-2').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: 'repoUrl is required' });
  });

  it('should return 400 for invalid repoUrl format', async () => {
    const res = await request(app).post('/api/v1/verify-phase-2').send({ repoUrl: 'http://github.com/owner' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: 'Invalid repoUrl format' });
  });

  it('should return 500 if there is an error processing the repository', async () => {
    mockedGithub.fetchRepositoryContents.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));

    const res = await request(app)
      .post('/api/v1/verify-phase-2')
      .send({ repoUrl: 'https://github.com/owner/repo' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Failed to process repository' });
  });

  it('should return parsed data for a valid repoUrl', async () => {
    const conductorFiles = [
      { name: 'setup_state.json', path: 'conductor/setup_state.json', type: 'file' as const },
      { name: 'tracks.md', path: 'conductor/tracks.md', type: 'file' as const },
      { name: 'plan.md', path: 'conductor/tracks/some-track/plan.md', type: 'file' as const },
    ];
    mockedConductorParser.identifyConductorFiles.mockReturnValue(conductorFiles);

    mockedGithub.fetchRepositoryFile.mockImplementation(async (owner, repo, path) => {
      if (path.endsWith('setup_state.json')) return '{}';
      if (path.endsWith('tracks.md')) return '# Tracks';
      if (path.endsWith('plan.md')) return '# Plan';
      return '';
    });

    mockedGithub.fetchRecentCommits.mockResolvedValue([]);
    
    mockedConductorParser.parseSetupState.mockReturnValue('parsed setup state');
    mockedConductorParser.parseTracksMd.mockReturnValue('parsed tracks' as any);
    mockedConductorParser.parsePlanMd.mockReturnValue('parsed plan' as any);

    const res = await request(app)
      .post('/api/v1/verify-phase-2')
      .send({ repoUrl: 'https://github.com/owner/repo' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      commits: [],
      setupState: 'parsed setup state',
      tracks: 'parsed tracks',
      plan: 'parsed plan',
    });

    expect(mockedConductorParser.identifyConductorFiles).toHaveBeenCalled();
    expect(mockedGithub.fetchRepositoryFile).toHaveBeenCalledTimes(3);
    expect(mockedConductorParser.parseSetupState).toHaveBeenCalledWith('{}');
    expect(mockedConductorParser.parseTracksMd).toHaveBeenCalledWith('# Tracks');
    expect(mockedConductorParser.parsePlanMd).toHaveBeenCalledWith('# Plan');
  });
});

describe('GET /hello', () => {
  it('should return "Hello World!"', async () => {
    const res = await request(app).get('/hello');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello World!');
  });
});
