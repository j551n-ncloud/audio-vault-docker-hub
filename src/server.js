
import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for our frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from our mounted volumes
app.use('/downloads', express.static('/app/downloads'));
app.use('/audio', express.static('/audio'));
app.use('/youtube', express.static('/youtube'));
app.use('/playlists', express.static('/playlists'));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../dist')));

// Endpoint to execute spotdl commands
app.post('/download', express.json(), (req, res) => {
  const { command } = req.body;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true, output: stdout });
  });
});

// API endpoint for eyeD3 metadata operations
app.post('/metadata', express.json(), (req, res) => {
  const { command } = req.body;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true, output: stdout });
  });
});

// Define static routes for React app pages
const reactRoutes = [
  '/metadata',
  '/downloads',
  '/dashboard',
  '/library',
  '/upload',
  '/settings'
];

// Set up each route to serve the React app
reactRoutes.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
});

// Catch-all route handler for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
