import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { downloadFile, parseOptions, selectDownload, verifyFile } from './aimegeo.mjs';

const archive = Buffer.from('504b03041400000064656d6f', 'hex');
const expected = createHash('sha256').update(archive).digest('hex');

test('requires an explicit known target, published source and valid options', () => {
  const resources = { downloads: [{ id: 'macos-arm64', sources: { official: 'https://example.com/client.zip' } }] };
  assert.throws(() => selectDownload(resources, 'linux'), /available target/);
  assert.throws(() => selectDownload(resources, 'macos-arm64', 'github'), /No published/);
  assert.throws(() => parseOptions(['--output'], ['--output']), /Missing/);
  assert.throws(() => parseOptions(['--output', 'a', '--output', 'b'], ['--output']), /Duplicate/);
  assert.throws(() => parseOptions(['--execute'], ['--output']), /Unknown/);
});

test('downloads bytes without executing and verifies a trusted hash', async t => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'aimegeo-helper-'));
  const server = createServer((request, response) => {
    if (request.url === '/html') { response.setHeader('content-type', 'text/html'); response.end('<html>login</html>'); }
    else if (request.url === '/invalid') { response.setHeader('content-type', 'application/zip'); response.end('not an archive'); }
    else { response.setHeader('content-type', 'application/zip'); response.end(archive); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(dir, { recursive: true, force: true }); });
  const url = `http://127.0.0.1:${server.address().port}`;
  const output = path.join(dir, 'client.zip');
  const result = await downloadFile({ url, output, expectedSha256: expected, allowHttpForTest: true });
  assert.deepEqual(await readFile(output), archive);
  assert.equal(result.installerExecuted, false);
  assert.equal(result.sha256, expected);
  assert.equal((await verifyFile(output, expected)).verified, true);
  await assert.rejects(verifyFile(output, '0'.repeat(64)), /mismatch/);

  await t.test('preserves an existing destination', async () => {
    await assert.rejects(downloadFile({ url, output, allowHttpForTest: true }), /already exists/);
    assert.deepEqual(await readFile(output), archive);
  });
  await t.test('rejects a page or invalid archive and removes partial files', async () => {
    for (const route of ['html', 'invalid']) {
      await assert.rejects(downloadFile({ url: `${url}/${route}`, output: path.join(dir, `${route}.zip`), allowHttpForTest: true }), /page instead|not a ZIP/);
    }
    assert.deepEqual(await readdir(dir), ['client.zip']);
  });
  await t.test('rejects checksum and byte-limit failures without leaving output', async () => {
    await assert.rejects(downloadFile({ url, output: path.join(dir, 'mismatch.zip'), expectedSha256: '0'.repeat(64), allowHttpForTest: true }), /mismatch/);
    await assert.rejects(downloadFile({ url, output: path.join(dir, 'too-large.zip'), maxBytes: 4, allowHttpForTest: true }), /size limit/);
    assert.deepEqual(await readdir(dir), ['client.zip']);
  });
});

test('rejects untrusted HTTP outside local test fixtures', async () => {
  await assert.rejects(downloadFile({ url: 'http://example.com/file.zip', output: 'unused.zip' }), /HTTPS/);
});
