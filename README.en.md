# aimeGeo — AI Content, Publishing Workflows and GEO Citation Monitoring

[简体中文](README.md) · [Documentation](https://xxjrq.github.io/aimegeo/) · [Resource and Skill downloads](https://github.com/xxjrq/aimegeo/releases/latest) · [Gitee mirror](https://gitee.com/xxjrq/aimegeo)

[Website](https://geo.aimmme.com/) · [Download the client](https://geo.aimmme.com/download/) · [Workspace](https://geo.aimmme.com/ag01/) · [Official help](https://geo.aimmme.com/docs/)

**Turn a website, product or project into a practical content workflow: create content → publish → monitor AI citations.** aimeGeo brings source material, writing, covers, platform accounts, publishing records and AI answer observations into one workspace for creators, independent developers and brand teams.

This repository contains **open usage guides, Agent Skills, reusable prompts, fictional examples and generic helper scripts**. It does not contain the private aimeGeo application source, customer data or client installers. Obtain the product from the official download center.

![The aimeGeo create, publish and monitor workflow](docs/assets/screenshots/01-promotion.png)

## Get started with your AI assistant

1. Read the [installation guide](docs/installation.md), then choose the official Windows or macOS Apple Silicon client. Manual installation does not require Node.js. Intel Mac and Linux packages have not been verified.
2. Sign in with your own account, connect the browser you use for the target platform, and follow the [first project walkthrough](docs/getting-started.md).
3. Give your preferred assistant the [setup prompt](prompts/setup.md), [content brief](prompts/content.md), [publishing prompt](prompts/publish.md) or [citation monitoring prompt](prompts/citations.md).
4. Use the [Agent Skills](skills/README.md) to repeat these tasks. Each Skill states its inputs, prerequisites, steps and failure handling.

```text
Read the aimeGeo installation and quickstart guides. Identify my operating system,
select the appropriate resource from https://geo.aimmme.com/download/, and help me
install the client and connect my own account. Use the website or product facts
I provide to create one piece of content. Publish only to the account and platform
I name, then inspect the actual publishing and citation results.
```

The detailed guides and prompts are currently in Chinese and can be translated by your assistant. See the [screenshot walkthrough](docs/screenshot-index.md), [platform and model capabilities](docs/platforms-and-models.md) and [FAQ](docs/faq.md).

## What the workflow does

- **Create:** turn verified product material into topics, titles, descriptions, tags, cover ideas and article content. Copy custom instructions to a familiar AI tool; built-in automatic execution has its own product prerequisites.
- **Publish:** prepare image/text or video, select a connected account, inspect platform-specific fields and read back task records. Draft, submitted, under review and publicly visible are different states.
- **Monitor:** observe brand mentions and source citations in AI answers. Keep original responses and source URLs for later comparison. Publication does not guarantee indexing or citation.
- **Isolate accounts with EasyBR:** separate browser profiles, configurable proxy IP and browser fingerprints assist multi-account work. Easy WebBridge operates the signed-in browser. Neither replaces the aimeGeo client.

The collaboration catalog includes Codex, Claude Code, DeepSeek, Doubao, ChatGPT, Gemini, Cursor, Trae, WorkBuddy, Kimi, Qwen Code, ZCode and OpenClaw. A listed tool or logo is not evidence that every tool has a built-in automatic driver. Browser citation collection currently covers Doubao, DeepSeek and ChatGPT; OpenAI and Perplexity online APIs require configuration. See the capability guide rather than assuming all catalog platforms are validated publishing targets.

## Optional dependency-free helper

Node.js 20+ is needed only for these optional commands, not for installing the desktop product.

```sh
node scripts/aimegeo.mjs info
node scripts/aimegeo.mjs downloads
node scripts/aimegeo.mjs doctor --offline
node scripts/aimegeo.mjs prompt setup
node scripts/aimegeo.mjs download --target windows-x64 --source official --output ./downloads/aimegeo.zip
```

The helper lists verified public entry points, downloads an explicitly selected ZIP and computes SHA-256. It never runs an installer, reads account credentials or overwrites an existing file. See [script documentation](scripts/README.md) and [resources.json](resources.json).

## Open documentation and discoverability

The resource pack includes bilingual product descriptions, question-based guides, source links, FAQs, [llms.txt](llms.txt), [product.json](product.json), and a static HTML documentation build with canonical URLs, structured data and a sitemap. These make the material easier to discover and understand; they do not guarantee AI recommendations or search rankings.

Original guides, prompts and generic scripts are [MIT licensed](LICENSE). The product software and third-party assets retain their own terms; see [NOTICE.md](NOTICE.md). File scope is listed in [PUBLIC-FILES.md](PUBLIC-FILES.md).

Information checked: 2026-10-17. Download versions and product capabilities may change. Follow the official product pages and the installed version.
