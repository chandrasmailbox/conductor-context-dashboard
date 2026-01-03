import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from './app.js';
import { fetchRepositoryContents, fetchRepositoryFile } from './github.js';
import { identifyConductorFiles, parseSetupState, parseTracksMd, parsePlanMd } from './conductor-parser.js';

jest.mock('./github');
jest.mock('./conductor-parser');

const mockedFetchRepositoryContents = fetchRepositoryContents as jest.Mock;
const mockedFetchRepositoryFile = fetchRepositoryFile as jest.Mock;
const mockedIdentifyConductorFiles = identifyConductorFiles as jest.Mock;
const mockedParseSetupState = parseSetupState as jest.Mock;
const mockedParseTracksMd = parseTracksMd as jest.Mock;
const mockedParsePlanMd = parsePlanMd as jest.Mock;

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
    mockedFetchRepositoryContents.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));

    const res = await request(app)
      .post('/api/v1/verify-phase-2')
      .send({ repoUrl: 'https://github.com/owner/repo' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Failed to process repository' });
  });

  it('should return parsed data for a valid repoUrl', async () => {
    const conductorFiles = [
      { name: 'setup_state.json', path: 'conductor/setup_state.json' },
      { name: 'tracks.md', path: 'conductor/tracks.md' },
      { name: 'plan.md', path: 'conductor/tracks/some-track/plan.md' },
    ];
    mockedIdentifyConductorFiles.mockReturnValue(conductorFiles);

    mockedFetchRepositoryFile.mockImplementation(async (owner, repo, path) => {
      if (path.endsWith('setup_state.json')) return '{}';
      if (path.endsWith('tracks.md')) return '# Tracks';
      if (path.endsWith('plan.md')) return '# Plan';
      return '';
    });
    
    mockedParseSetupState.mockReturnValue('parsed setup state');
    mockedParseTracksMd.mockReturnValue('parsed tracks');
    mockedParsePlanMd.mockReturnValue('parsed plan');

    const res = await request(app)
      .post('/api/v1/verify-phase-2')
      .send({ repoUrl: 'https://github.com/owner/repo' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      setupState: 'parsed setup state',
      tracks: 'parsed tracks',
      plan: 'parsed plan',
    });

    expect(mockedIdentifyConductorFiles).toHaveBeenCalled();
    expect(mockedFetchRepositoryFile).toHaveBeenCalledTimes(3);
    expect(mockedParseSetupState).toHaveBeenCalledWith('{}');
    expect(mockedParseTracksMd).toHaveBeenCalledWith('# Tracks');
    expect(mockedParsePlanMd).toHaveBeenCalledWith('# Plan');
  });
});


describe('GET /hello', () => {
  it('should return "Hello World!"', async () => {
    const res = await request(app).get('/hello');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello World!');
  });
});
