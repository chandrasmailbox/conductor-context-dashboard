import express from 'express';
import { config } from './config';

const app = express();
const port = config.PORT;

app.use(express.json()); // Add this line to enable JSON body parsing

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
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
