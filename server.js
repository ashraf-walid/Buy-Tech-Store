import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure binding to all interfaces for container environments
process.env.HOSTNAME = '0.0.0.0';
// Set default port if not provided
if (!process.env.PORT) {
  process.env.PORT = '8080';
}

const port = parseInt(process.env.PORT, 10);
const dev = process.env.NODE_ENV !== 'production';

// Check if standalone build exists - DISABLED
// We explicitly disable the standalone server path here because running it from the project root 
// (without copying public/static folders into .next/standalone) causes asset resolution failures 
// (404s for images and parsing errors for CSS).
// Since the full node_modules and project structure are available, we defaults to the custom server.

console.log(`Using Next.js server on ${process.env.HOSTNAME}:${port}...`);
const app = next({ dev, hostname: process.env.HOSTNAME, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, getHostname(), (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${getHostname()}:${port}`);
  });
});

function getHostname() {
  return process.env.HOSTNAME || '0.0.0.0';
}

