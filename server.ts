import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { autoGenerateStoryFromUrl } from './src/utils/aiGenerator';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Automatic Story Generation from URL or Raw Text
  app.post('/api/generate-story', async (req, res) => {
    try {
      const { url, rawText } = req.body;
      if (!url && !rawText) {
        return res.status(400).json({ error: 'Link veya metin girilmelidir.' });
      }

      const generatedStory = await autoGenerateStoryFromUrl(url, rawText);
      return res.json({ success: true, story: generatedStory });
    } catch (error: any) {
      console.error('Error generating story:', error);
      return res.status(500).json({ 
        error: error.message || 'Failed to auto-generate story' 
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
