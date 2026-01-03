import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

jest.unstable_mockModule('./utils/local-files.js', () => ({
  readLocalFile: jest.fn(),
}));

jest.unstable_mockModule('./utils/local-git.js', () => ({
  fetchLocalCommits: jest.fn(),
}));

jest.unstable_mockModule('./conductor-parser.js', () => ({
  parseSetupState: jest.fn(),
  parseTracksMd: jest.fn(),
  parsePlanMd: jest.fn(),
}));

const request = (await import('supertest')).default;
const app = (await import('./app.js')).default;
const localFiles = await import('./utils/local-files.js');
const localGit = await import('./utils/local-git.js');
const conductorParser = await import('./conductor-parser.js');

const mockedLocalFiles = localFiles as jest.Mocked<typeof localFiles>;
const mockedLocalGit = localGit as jest.Mocked<typeof localGit>;
const mockedConductorParser = conductorParser as jest.Mocked<typeof conductorParser>;

describe('POST /api/v1/sync-local', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if directoryPath is missing', async () => {
    const res = await request(app).post('/api/v1/sync-local').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'directoryPath is required' });
  });

  it('should return parsed local data successfully', async () => {
    const directoryPath = 'C:/projects/repo';
    
    mockedLocalGit.fetchLocalCommits.mockResolvedValue([
      { sha: 'sha1', message: 'msg', author: 'auth', date: 'date' }
    ]);
    
    mockedLocalFiles.readLocalFile.mockImplementation(async (path) => {
      if (path.endsWith('setup_state.json')) return '{}';
      if (path.endsWith('tracks.md')) return '# Tracks';
      if (path.endsWith('plan.md')) return '# Plan';
      return '';
    });

    mockedConductorParser.parseSetupState.mockReturnValue('local setup state');
    mockedConductorParser.parseTracksMd.mockReturnValue({
      tracks: [
        { title: 'Track 1', link: './conductor/tracks/some-track/', status: 'in_progress' }
      ]
    });
    mockedConductorParser.parsePlanMd.mockReturnValue('local plan' as any);

    const res = await request(app)
      .post('/api/v1/sync-local')
      .send({ directoryPath });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      commits: [{ sha: 'sha1', message: 'msg', author: 'auth', date: 'date' }],
      setupState: 'local setup state',
      tracks: {
        tracks: [{ title: 'Track 1', link: './conductor/tracks/some-track/', status: 'in_progress' }]
      },
      plan: 'local plan',
    });
  });

  it('should return 500 if an error occurs', async () => {
    mockedLocalGit.fetchLocalCommits.mockRejectedValue(new Error('Local error'));

    const res = await request(app)
      .post('/api/v1/sync-local')
      .send({ directoryPath: 'C:/invalid' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to process local directory' });
  });
});
