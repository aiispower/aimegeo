#!/usr/bin/env node
import { createReadStream } from 'node:fs';
import { access, mkdir, open, link, unlink, readFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const PROMPTS = { setup: 'setup.md', content: 'content.md', publish: 'publish.md', citations: 'citations.md' };
const HELP = `aimeGeo public resource helper (Node.js 20+)

  info [--json]                      Show public product entry points
  downloads [--json]                 List official client resources
  doctor [--offline]                 Inspect OS/Node; optionally check public pages
  prompt setup|content|publish|citations
  download --target macos-arm64|windows-x64 --output FILE [--source official|overseas|github] [--sha256 HASH]
  verify FILE --sha256 HASH

Downloads never overwrite an existing file or run an installer.
GitHub mirrors are usable only when resources.json explicitly lists a published source.`;

export function parseOptions(args, allowed, booleans = []) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (!key.startsWith('--') || !allowed.includes(key)) throw new Error(`Unknown option: ${key}`);
    if (key in result) throw new Error(`Duplicate option: ${key}`);
    if (booleans.includes(key)) result[key] = true;
    else {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${key}`);
      result[key] = value;
    }
  }
  return result;
}

export function selectDownload(resources, target, source = 'official') {
  const resource = resources.downloads.find(item => item.id === target);
  if (!resource) throw new Error('Choose an available target explicitly: macos-arm64 or windows-x64.');
  if (!['official', 'overseas', 'github'].includes(source)) throw new Error('Unknown download source.');
  const url = resource.sources[source];
  if (!url) throw new Error(`No published ${source} mirror is recorded; use an official source.`);
  if (new URL(url).protocol !== 'https:') throw new Error('Download sources must use HTTPS.');
  return { ...resource, url, source };
}

function validateHash(hash) {
  if (hash != null && !/^[a-f\d]{64}$/i.test(hash)) throw new Error('SHA-256 must contain exactly 64 hexadecimal characters.');
}

export async function hashFile(filename) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(filename)) hash.update(chunk);
  return hash.digest('hex');
}

export async function verifyFile(filename, expected) {
  validateHash(expected);
  if (!expected) throw new Error('Supply a trusted expected SHA-256 value.');
  const actual = await hashFile(filename);
  if (actual !== expected.toLowerCase()) throw new Error(`SHA-256 mismatch; actual: ${actual}`);
  return { sha256: actual, verified: true };
}

export async function downloadFile({ url, output, expectedSha256, maxBytes = 2 * 1024 ** 3, allowHttpForTest = false }) {
  validateHash(expectedSha256);
  const protocol = new URL(url).protocol;
  if (protocol !== 'https:' && !(allowHttpForTest && protocol === 'http:')) throw new Error('HTTPS is required.');
  const destination = path.resolve(output);
  try { await access(destination); throw new Error('Output already exists; choose another filename.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(path.dirname(destination), { recursive: true });
  const temporary = path.join(path.dirname(destination), `.${path.basename(destination)}.${randomUUID()}.part`);
  let handle;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10 * 60 * 1000) });
    if (!response.ok || !response.body) throw new Error(`Download failed: HTTP ${response.status}`);
    if (!allowHttpForTest && new URL(response.url).protocol !== 'https:') throw new Error('Refusing a non-HTTPS redirect.');
    if (/html|json|text\//i.test(response.headers.get('content-type') || '')) throw new Error('Server returned a page instead of a ZIP.');
    if (Number(response.headers.get('content-length')) > maxBytes) throw new Error('Download exceeds the size limit.');
    handle = await open(temporary, 'wx', 0o600);
    const hash = createHash('sha256');
    let first = Buffer.alloc(0);
    let bytes = 0;
    for await (const chunk of response.body) {
      const buffer = Buffer.from(chunk);
      bytes += buffer.length;
      if (bytes > maxBytes) throw new Error('Download exceeds the size limit.');
      if (first.length < 4) first = Buffer.concat([first, buffer]).subarray(0, 4);
      hash.update(buffer);
      await handle.writeFile(buffer);
    }
    const signature = first.toString('hex');
    if (!['504b0304', '504b0506', '504b0708'].includes(signature)) throw new Error('Downloaded content is not a ZIP archive.');
    const sha256 = hash.digest('hex');
    if (expectedSha256 && sha256 !== expectedSha256.toLowerCase()) throw new Error(`SHA-256 mismatch; actual: ${sha256}`);
    await handle.close(); handle = null;
    await link(temporary, destination);
    return { file: destination, bytes, sha256, comparedWithTrustedHash: Boolean(expectedSha256), installerExecuted: false };
  } finally {
    if (handle) await handle.close();
    await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
}

async function main(args) {
  if (!args.length || ['help', '--help', '-h'].includes(args[0])) { console.log(HELP); return; }
  const [command, ...rest] = args;
  const resources = JSON.parse(await readFile(path.join(ROOT, 'resources.json'), 'utf8'));
  if (command === 'info' || command === 'downloads') {
    const options = parseOptions(rest, ['--json'], ['--json']);
    const value = command === 'info' ? { product: resources.product, homepage: resources.homepage, workspace: resources.workspace, downloadCenter: resources.downloadCenter, help: resources.help, scope: 'Open usage resources; no private application source or installers.' } : { checkedAt: resources.checkedAt, downloads: resources.downloads, note: resources.verificationNote };
    console.log(options['--json'] ? JSON.stringify(value, null, 2) : Object.entries(value).map(([key, val]) => `${key}: ${typeof val === 'object' ? JSON.stringify(val, null, 2) : val}`).join('\n'));
    return;
  }
  if (command === 'doctor') {
    const options = parseOptions(rest, ['--offline'], ['--offline']);
    const target = process.platform === 'darwin' && process.arch === 'arm64' ? 'macos-arm64' : process.platform === 'win32' && process.arch === 'x64' ? 'windows-x64' : null;
    const result = { node: process.versions.node, supportedNode: Number(process.versions.node.split('.')[0]) >= 20, os: process.platform, architecture: process.arch, availableClientTarget: target, note: target ? 'Choose the same target on the official download page.' : 'No verified client package for this OS/architecture is recorded. Consult official help.', accountDataRead: false, installerExecuted: false };
    if (!options['--offline']) result.publicPages = await Promise.all([resources.homepage, resources.downloadCenter, resources.help].map(async url => {
      try { const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(8000) }); return { url, status: response.status, reachable: response.ok }; }
      catch { return { url, reachable: false }; }
    }));
    console.log(JSON.stringify(result, null, 2));
    if (!result.supportedNode) process.exitCode = 1;
    return;
  }
  if (command === 'prompt') {
    if (rest.length !== 1 || !PROMPTS[rest[0]]) throw new Error('Choose prompt setup, content, publish or citations.');
    console.log(await readFile(path.join(ROOT, 'prompts', PROMPTS[rest[0]]), 'utf8')); return;
  }
  if (command === 'download') {
    const options = parseOptions(rest, ['--target', '--output', '--source', '--sha256']);
    if (!options['--target'] || !options['--output']) throw new Error('Explicit --target and --output are required.');
    const resource = selectDownload(resources, options['--target'], options['--source']);
    console.log(JSON.stringify(await downloadFile({ url: resource.url, output: options['--output'], expectedSha256: options['--sha256'] || resource.sha256 }), null, 2));
    console.log('Download only. Follow docs/installation.md to inspect the archive and install the client.'); return;
  }
  if (command === 'verify') {
    if (!rest[0] || rest[0].startsWith('--')) throw new Error('Supply a file path.');
    const options = parseOptions(rest.slice(1), ['--sha256']);
    console.log(JSON.stringify(await verifyFile(rest[0], options['--sha256']), null, 2)); return;
  }
  throw new Error(`Unknown command: ${command}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => { console.error(`Error: ${error.message}`); process.exitCode = 1; });
}
