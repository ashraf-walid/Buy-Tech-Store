import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

// Check if standalone build exists
const standalonePath = path.join(__dirname, '.next/standalone/server.js');

if (fs.existsSync(standalonePath)) {
  console.log('Using standalone server...');
  // Use dynamic import for the standalone server, converting path to URL for cross-platform compatibility
  await import(pathToFileURL(standalonePath).href);
} else {
  console.log('Using Next.js server...');
  const app = next({ dev });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
}
