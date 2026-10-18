import { readFile, writeFile, mkdir, rm, lstat, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = fileURLToPath(new URL('../', import.meta.url));
const rootReal = await realpath(root);
const scope = JSON.parse(await readFile(path.join(root, 'PUBLIC-SCOPE.json'), 'utf8'));
const publicFiles = new Set(scope.files);
async function readPublic(file, encoding) {
  if (!publicFiles.has(file) || file.startsWith('/') || file.split('/').includes('..')) throw new Error(`Source is not on the public whitelist: ${file}`);
  const absolute = path.join(root, file);
  if ((await realpath(absolute)) !== path.join(rootReal, file) || !(await lstat(absolute)).isFile()) throw new Error(`Non-regular public source: ${file}`);
  return readFile(absolute, encoding);
}
const config = JSON.parse(await readPublic('site.config.json', 'utf8'));
const baseUrl = new URL(config.siteUrl);
const base = baseUrl.pathname.endsWith('/') ? baseUrl.pathname : `${baseUrl.pathname}/`;
const output = path.join(root, 'dist');
const template = await readPublic('site/template.html', 'utf8');
const home = await readPublic('site/home.html', 'utf8');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const plain = value => value.replace(/<[^>]*>/g, '').replaceAll('&amp;', '&').replaceAll('&gt;', '>').replaceAll('&lt;', '<');
const stripFrontMatter = value => value.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
const pageMap = new Map(config.pages.map(page => [page.source, `${base}${page.slug}/`]));
const repoRaw = `${config.repository}/blob/main/`;

function rewriteLink(value, source) {
  if (!value || /^(?:https?:|mailto:|tel:|data:|#|\/)/i.test(value)) return value;
  const [target, fragment] = value.split('#');
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(source), decodeURI(target)));
  const suffix = fragment ? `#${fragment}` : '';
  if (pageMap.has(resolved)) return pageMap.get(resolved) + suffix;
  if (resolved.startsWith('docs/assets/')) return `${base}assets/${resolved.slice('docs/assets/'.length)}` + suffix;
  if (['resources.json', 'product.json', 'llms.txt', 'llms-full.txt'].includes(resolved)) return base + resolved + suffix;
  return repoRaw + resolved + suffix;
}

function markdownHtml(markdown, source) {
  return marked.parse(stripFrontMatter(markdown)).replace(/\b(href|src)="([^"]*)"/g, (_, attr, value) => `${attr}="${escape(rewriteLink(value.replaceAll('&amp;', '&'), source))}"`);
}

function render(body, page) {
  const canonical = new URL(page.slug ? `${page.slug}/` : './', baseUrl).href;
  const lang = page.lang || 'zh-CN';
  const alternates = !page.slug || page.slug === 'en' ? `<link rel="alternate" hreflang="zh-CN" href="${escape(baseUrl.href)}">\n<link rel="alternate" hreflang="en" href="${escape(new URL('en/', baseUrl).href)}">\n<link rel="alternate" hreflang="x-default" href="${escape(baseUrl.href)}">` : '';
  const schema = [{ '@context': 'https://schema.org', '@type': page.slug ? 'TechArticle' : 'WebPage', headline: page.title, description: page.description, url: canonical, inLanguage: lang, dateModified: config.updatedAt, publisher: { '@type': 'Organization', name: 'aimeGeo 使用资源' } }];
  if (!page.slug) {
    schema.push({ '@context': 'https://schema.org', '@type': 'SoftwareSourceCode', name: 'aimeGeo usage resources', description: 'Open usage guides, prompts, Agent Skills and generic helper scripts; not the private product source.', codeRepository: config.repository, license: 'https://spdx.org/licenses/MIT.html', programmingLanguage: 'JavaScript' });
    const faq = [...home.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map(match => ({ '@type': 'Question', name: plain(match[1]), acceptedAnswer: { '@type': 'Answer', text: plain(match[2]) } }));
    if (faq.length) schema.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq });
  }
  const vars = { LANG: lang, TITLE: escape(page.title), DESCRIPTION: escape(page.description), CANONICAL: escape(canonical), SOCIALIMAGE: escape(new URL('assets/promotion/01-dialogue-geo.png', baseUrl).href), ALTERNATES: alternates, JSONLD: `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`, BASE: base, BODY: body };
  return template.replace(/\{\{([A-Z]+)\}\}/g, (match, name) => vars[name] ?? match).replaceAll('{{BASE}}', base);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const asset of scope.files.filter(file => file.startsWith('docs/assets/'))) {
  const target = path.join(output, 'assets', asset.slice('docs/assets/'.length));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, await readPublic(asset));
}
await writeFile(path.join(output, 'style.css'), await readPublic('site/style.css'));
await writeFile(path.join(output, 'index.html'), render(home.replaceAll('{{BASE}}', base), { title: 'aimeGeo 使用资源｜自研免费 GEO 系统 · 下载与 AI 指南', description: config.description }));
const full = ['# aimeGeo 使用资源', `Updated: ${config.updatedAt}`, `Official product: https://geo.aimmme.com/`, 'Scope: public usage resources; no private product source or account data.'];
for (const page of config.pages) {
  if (!/^[a-z0-9/-]+$/.test(page.slug) || page.slug.includes('..')) throw new Error('Invalid page slug.');
  if (page.source.startsWith('/') || page.source.includes('\\') || page.source.split('/').includes('..') || !page.source.endsWith('.md')) throw new Error('Invalid public source path.');
  const markdown = await readPublic(page.source, 'utf8');
  const destination = path.join(output, page.slug);
  await mkdir(destination, { recursive: true });
  const body = `<article class="doc-article"><p class="doc-meta">${page.lang === 'en' ? 'Updated' : '资料核对'} ${config.updatedAt}</p>${markdownHtml(markdown, page.source)}</article>`;
  await writeFile(path.join(destination, 'index.html'), render(body, page));
  if (!page.lang) full.push(`\n\n---\n\nSource: ${new URL(`${page.slug}/`, baseUrl).href}\n\n${stripFrontMatter(markdown)}`);
}
const llms = `# aimeGeo\n\n> aimeGeo 自研免费 GEO 系统的公开使用资源。做 GEO，也做自媒体：和熟悉的 AI 对话，推进选题、创作、配图和多平台发布，按需检测 AI 引用。此资料库不包含产品私有源码。\n\n- 官网：https://geo.aimmme.com/\n- 客户端下载：https://geo.aimmme.com/download/\n- 正式工作台：https://geo.aimmme.com/ag01/\n- 官方帮助：https://geo.aimmme.com/docs/\n\n## Guides and Agent resources\n\n${config.pages.map(page => `- [${page.title}](${new URL(`${page.slug}/`, baseUrl).href}): ${page.description}`).join('\n')}\n\n## Machine-readable context\n\n- [Product facts](${new URL('product.json', baseUrl).href})\n- [Download sources](${new URL('resources.json', baseUrl).href})\n- [Full guide text](${new URL('llms-full.txt', baseUrl).href})\n\n## Boundaries\n\n30 个平台目录（国内 21、海外 9），13 个工具、9 个模型目录；支持无限扩展平台，目录不等于已验证自动发布或已配置检测。aimeGeo 系统免费，外部模型、图片服务与代理按所用服务计费。产品官网为 geo.aimmme.com，本资源文档站用于教程与资源。客户端、EasyBR 和 Easy WebBridge 作用不同。发布、公开、搜索收录和 AI 引用分别记录。本文件是可选资料索引，不是排名或引用保证。\n`;
await writeFile(path.join(root, 'llms.txt'), llms);
await writeFile(path.join(root, 'llms-full.txt'), full.join('\n'));
for (const file of ['resources.json', 'product.json', 'llms.txt', 'llms-full.txt']) await writeFile(path.join(output, file), await readPublic(file));
const urls = [baseUrl.href, ...config.pages.map(page => new URL(`${page.slug}/`, baseUrl).href)];
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${escape(url)}</loc><lastmod>${config.updatedAt}</lastmod></url>`).join('')}</urlset>\n`);
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', baseUrl).href}\n`);
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Built ${urls.length} crawlable HTML pages, sitemap, robots and optional agent indexes in dist/.`);
