import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Add this line to enable JSON body parsing

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

// For testing purposes, export the app
export default app;

// Optionally, start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
