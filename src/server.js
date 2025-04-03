
import express from 'express';
import { exec } from 'child_process';
import path from 'path';

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
