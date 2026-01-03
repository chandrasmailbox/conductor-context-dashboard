import express from 'express';
import { config } from './config.js';
import { fetchRepositoryContents, fetchRepositoryFile } from './github.js';
import { identifyConductorFiles, parseSetupState, parseTracksMd, parsePlanMd } from './conductor-parser.js';

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

    const contents = await fetchRepositoryContents(owner, repo);
    const conductorFiles = identifyConductorFiles(contents);

    const parsedData: any = {};

    for (const file of conductorFiles) {
      const content = await fetchRepositoryFile(owner, repo, file.path);
      if (file.name === 'setup_state.json') {
        parsedData.setupState = parseSetupState(content);
      } else if (file.name === 'tracks.md') {
        parsedData.tracks = parseTracksMd(content);
      } else if (file.name === 'plan.md') {
        parsedData.plan = parsePlanMd(content);
      }
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
