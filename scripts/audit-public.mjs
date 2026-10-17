import { readdir, readFile, writeFile, lstat, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const write = process.argv.includes('--write');
const scope = JSON.parse(await readFile(path.join(root, 'PUBLIC-SCOPE.json'), 'utf8'));
const generated = new Set(['PUBLIC-FILES.md', 'public-manifest.json']);
const ignored = new Set(['.git', 'node_modules', 'dist', '.release', '.private', '.DS_Store']);
const errors = [];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

async function walk(folder, prefix = '') {
  const files = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const name = prefix + entry.name;
    if (entry.isSymbolicLink()) { errors.push(`Symlink excluded: ${name}`); continue; }
    if (entry.isDirectory()) files.push(...await walk(path.join(folder, entry.name), `${name}/`));
    else files.push(name);
  }
  return files;
}

const rules = [
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key'],
  [/\bgh[pousr]_[A-Za-z0-9]{30,}\b/, 'GitHub credential'],
  [/\bsk-[A-Za-z0-9_-]{24,}\b/, 'API credential'],
  [/\/Users\/[A-Za-z0-9_.-]+\/(?:develop|\.codex|\.easy-webbridge)\//, 'private machine path'],
  [/(?:localhost|127\.0\.0\.1):(?:3100|8789|18180|43101|5432)\b/, 'private product endpoint'],
  [/https?:\/\/(?:10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?=[:/\s])/, 'private network endpoint']
];

function purpose(file) {
  if (file.startsWith('docs/assets/screenshots/')) return '脱敏基础界面截图';
  if (file.startsWith('docs/assets/')) return '官方产品标识';
  if (file.startsWith('docs/')) return '使用教程与能力说明';
  if (file.startsWith('prompts/')) return '可复制任务提示词';
  if (file.startsWith('skills/')) return 'Agent Skill 与元信息';
  if (file.startsWith('examples/')) return '虚构演示资料';
  if (file.startsWith('scripts/')) return '通用下载、校验与资源维护脚本';
  if (file.startsWith('site')) return '公开文档站模板与配置';
  if (file.startsWith('.github/')) return '只读校验工作流';
  if (file.startsWith('llms') || file === 'product.json' || file === 'resources.json') return '公开产品事实与资料索引';
  return '项目介绍、许可或分发清单';
}

const allowed = [...new Set(scope.files)].sort();
if (allowed.length !== scope.files.length) errors.push('Duplicate entries in public scope.');
for (const file of allowed) if (file.startsWith('/') || file.split('/').some(part => part === '..' || ignored.has(part)) || file.includes('\\') || /(?:^|\/)(?:\.env.*|bridge-token|id_rsa|cookies?.*|credentials.*)$|\.(?:zip|exe|dmg|db|sqlite3?|p12|pem)$/i.test(file)) errors.push(`Forbidden scope path: ${file}`);
for (const file of await walk(root)) if (!allowed.includes(file)) errors.push(`Not on the explicit public whitelist: ${file}`);

const entries = [];
for (const file of allowed) {
  if (generated.has(file)) continue;
  let bytes;
  try { const stat = await lstat(path.join(root, file)); if (!stat.isFile()) throw new Error(); bytes = await readFile(path.join(root, file)); }
  catch { errors.push(`Missing/non-file public entry: ${file}`); continue; }
  if (bytes.length > (file.endsWith('.png') ? 4 * 1024 ** 2 : 1024 ** 2)) errors.push(`Unexpected file size: ${file}`);
  if (file.endsWith('.png')) {
    if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) errors.push(`Invalid PNG: ${file}`);
    for (let offset = 8; offset + 12 <= bytes.length;) {
      const length = bytes.readUInt32BE(offset);
      const type = bytes.toString('ascii', offset + 4, offset + 8);
      if (['tEXt', 'iTXt', 'zTXt'].includes(type)) errors.push(`Review PNG text metadata: ${file}`);
      offset += length + 12;
    }
  } else {
    const text = bytes.toString('utf8');
    for (const [pattern, label] of rules) if (pattern.test(text)) errors.push(`Potential ${label} in ${file}`);
    if (file.endsWith('.md')) for (const match of text.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
      const target = match[1].replace(/^<|>$/g, '').split('#')[0];
      if (!target || /^[a-z]+:|^#/i.test(target)) continue;
      const resolved = path.resolve(root, path.dirname(file), decodeURI(target));
      if (!resolved.startsWith(root)) { errors.push(`Link leaves resource root: ${file}`); continue; }
      try { await access(resolved); } catch { if (!(write && generated.has(path.relative(root, resolved)))) errors.push(`Missing link from ${file}: ${target}`); }
    }
  }
  entries.push({ path: file, bytes: bytes.length, sha256: digest(bytes), purpose: purpose(file) });
}

// The generated website is a second outbound artifact: check its exact contents too.
try {
  await access(path.join(root, 'dist/index.html'));
  const site = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
  const base = new URL(site.siteUrl).pathname;
  const expected = new Set(['index.html', 'style.css', 'robots.txt', 'sitemap.xml', '.nojekyll', 'product.json', 'resources.json', 'llms.txt', 'llms-full.txt', ...site.pages.map(page => `${page.slug}/index.html`), ...allowed.filter(file => file.startsWith('docs/assets/')).map(file => file.slice('docs/'.length))]);
  async function walkBuilt(folder, prefix = '') {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const name = prefix + entry.name;
      if (entry.isSymbolicLink()) { errors.push(`Symlink in built website: ${name}`); continue; }
      if (entry.isDirectory()) await walkBuilt(path.join(folder, entry.name), `${name}/`);
      else {
        if (!expected.has(name)) errors.push(`Non-whitelisted built file: ${name}`);
        const bytes = await readFile(path.join(folder, entry.name));
        if (name.endsWith('.png')) continue;
        const text = bytes.toString('utf8');
        for (const [pattern, label] of rules) if (pattern.test(text)) errors.push(`Potential ${label} in built ${name}`);
        if (name.endsWith('.html')) {
          if ((text.match(/<h1\b/g) || []).length !== 1) errors.push(`Expected one H1 in ${name}`);
          if (!/<title>[^<]+<\/title>/.test(text) || !/<meta name="description" content="[^"]+"/.test(text) || !/<link rel="canonical" href="https:\/\//.test(text)) errors.push(`Missing SEO metadata: ${name}`);
          if (/\{\{[A-Z]+\}\}/.test(text)) errors.push(`Unresolved template: ${name}`);
          for (const match of text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
            try { JSON.parse(match[1]); } catch { errors.push(`Invalid structured data: ${name}`); }
          }
          for (const match of text.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
            if (!match[1].startsWith(base)) continue;
            let target = match[1].slice(base.length).split('#')[0].split('?')[0];
            if (!target || target.endsWith('/')) target += 'index.html';
            if (!expected.has(target)) errors.push(`Broken site link from ${name}: ${match[1]}`);
          }
        }
      }
    }
  }
  await walkBuilt(path.join(root, 'dist'));
  for (const file of expected) { try { await access(path.join(root, 'dist', file)); } catch { errors.push(`Missing built artifact: ${file}`); } }
} catch (error) { if (error.code !== 'ENOENT') throw error; }

if (!errors.length && write) {
  const document = `# 拟公开文件清单\n\n此清单只覆盖本资源库的新建公开资料；不包含产品业务源码、内部接口、部署信息、真实业务数据、浏览器资料或安装器。每次新增文件须更新显式白名单，再由所有者审阅。文件列表可被审阅，不表示已获得发布批准。\n\n| 文件 | 用途 | 字节数 | SHA-256 前 12 位 |\n| --- | --- | ---: | --- |\n${entries.map(entry => `| [${entry.path}](${entry.path}) | ${entry.purpose} | ${entry.bytes} | \`${entry.sha256.slice(0, 12)}\` |`).join('\n')}\n| [PUBLIC-FILES.md](PUBLIC-FILES.md) | 本清单，由工具生成 | — | 见机器清单 |\n| [public-manifest.json](public-manifest.json) | 完整 SHA-256 与打包白名单；不自哈希 | — | 自引用排除 |\n\n机器清单记录每个文件的完整哈希；分发包只读取这些路径，未知文件不会被自动加入。截图已人工检查，纯文本扫描不能代替图片审阅。\n`;
  await writeFile(path.join(root, 'PUBLIC-FILES.md'), document);
  const bytes = Buffer.from(document);
  entries.push({ path: 'PUBLIC-FILES.md', bytes: bytes.length, sha256: digest(bytes), purpose: purpose('PUBLIC-FILES.md') });
  await writeFile(path.join(root, 'public-manifest.json'), JSON.stringify({ schemaVersion: 1, resourceVersion: '0.1.0', checkedAt: scope.checkedAt, scope: scope.scope, selfHashExcluded: 'public-manifest.json', fileCountIncludingManifest: entries.length + 1, totalPayloadBytes: entries.reduce((sum, entry) => sum + entry.bytes, 0), files: entries.sort((a, b) => a.path.localeCompare(b.path)) }, null, 2) + '\n');
}
if (!write && !errors.length) {
  const manifest = JSON.parse(await readFile(path.join(root, 'public-manifest.json'), 'utf8'));
  const manifestNames = new Set(manifest.files.map(entry => entry.path));
  for (const file of allowed.filter(name => name !== 'public-manifest.json')) if (!manifestNames.has(file)) errors.push(`File absent from manifest: ${file}`);
  for (const entry of manifest.files) {
    if (!allowed.includes(entry.path)) { errors.push(`Unapproved manifest entry: ${entry.path}`); continue; }
    const bytes = await readFile(path.join(root, entry.path));
    if (digest(bytes) !== entry.sha256 || bytes.length !== entry.bytes) errors.push(`Manifest is stale: ${entry.path}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Public whitelist, relative links, file hashes and credential-pattern scan passed (${allowed.length} source files). No publication was performed.`);
