import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from client/dist
app.use(express.static(join(__dirname, '..', 'client', 'dist')));

// Token endpoint for Vocal Bridge
app.get('/api/voice-token', async (req, res) => {
  const apiKey = process.env.VOCAL_BRIDGE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'VOCAL_BRIDGE_API_KEY not configured' });
  }

  try {
    const response = await fetch('https://vocalbridgeai.com/api/v1/token', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ participant_name: 'User' })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vocal Bridge API error:', response.status, errorText);
      return res.status(response.status).json({ error: 'Failed to get token from Vocal Bridge' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
