import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const base = new URL(config.siteUrl).pathname;
const directory = path.join(root, 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname === '/') { response.writeHead(302, { Location: base }); response.end(); return; }
    if (!url.pathname.startsWith(base)) throw new Error();
    let filename = path.resolve(directory, decodeURIComponent(url.pathname.slice(base.length)));
    if (filename !== directory && !filename.startsWith(directory + path.sep)) throw new Error();
    if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
    const bytes = await readFile(filename);
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(bytes);
  } catch { response.writeHead(404, { 'Content-Type': 'text/plain' }); response.end('Not found. Build the documentation first with npm run build.'); }
});
server.listen(3197, '127.0.0.1', () => console.log(`Public documentation preview: http://127.0.0.1:3197${base}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
