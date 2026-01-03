import express from 'express';
import { config } from './config.js';
import { fetchRepositoryFile, fetchRecentCommits } from './github.js';
import { parseSetupState, parseTracksMd, parsePlanMd } from './conductor-parser.js';

const app = express();
const port = config.PORT;

app.use(express.json()); // Add this line to enable JSON body parsing

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.post('/api/v1/verify-phase-2', async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: 'repoUrl is required' });
  }

  try {
    const url = new URL(repoUrl);
    const pathParts = url.pathname.split('/').filter(part => part);
    if (pathParts.length < 2) {
      return res.status(400).json({ error: 'Invalid repoUrl format' });
    }
    const owner = pathParts[0];
    const repo = pathParts[1];

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Invalid repoUrl format' });
    }

    // Fetch commits
    const commits = await fetchRecentCommits(owner, repo);

    const parsedData: any = {
      commits: (commits || []).map(c => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author.name,
        date: c.commit.author.date,
      }))
    };

    // 1. Fetch setup_state.json (optional but recommended)
    try {
      const setupStateContent = await fetchRepositoryFile(owner, repo, 'conductor/setup_state.json');
      parsedData.setupState = parseSetupState(setupStateContent);
    } catch (e) {
      console.warn('setup_state.json not found or invalid', e);
    }

    // 2. Fetch tracks.md
    try {
      const tracksContent = await fetchRepositoryFile(owner, repo, 'conductor/tracks.md');
      const parsedTracks = parseTracksMd(tracksContent);
      parsedData.tracks = parsedTracks;

      // 3. Find active track and fetch plan
      // Prioritize 'in_progress', otherwise take the first one
      if (parsedTracks && parsedTracks.tracks && parsedTracks.tracks.length > 0) {
        const activeTrack = parsedTracks.tracks.find(t => t.status === 'in_progress') || parsedTracks.tracks[0];

        if (activeTrack) {
          // Resolve path: remove leading ./ and trailing /
          let trackPath = activeTrack.link.replace(/^\.\//, '').replace(/\/$/, '');
          
          // Append plan.md
          const planPath = `${trackPath}/plan.md`;
          
          const planContent = await fetchRepositoryFile(owner, repo, planPath);
          parsedData.plan = parsePlanMd(planContent);
        }
      }
    } catch (e) {
      console.error('Failed to fetch tracks or plan:', e);
      // We might still return what we have (commits)
    }

    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error in /api/v1/verify-phase-2:', error);
    res.status(500).json({ error: 'Failed to process repository' });
  }
});


app.get('/hello', (req, res) => {
  res.status(200).send('Hello World!');
});

// For testing purposes, export the app
export default app;

// Optionally, start the server if not in a test environment
if (config.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
