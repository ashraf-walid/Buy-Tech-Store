const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const port = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

// Check if standalone build exists
const standalonePath = path.join(__dirname, '.next/standalone/server.js');
if (fs.existsSync(standalonePath)) {
  console.log('Using standalone server...');
  require(standalonePath);
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