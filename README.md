# aimeGeo：AI 内容制作、多平台发布与 GEO 引用检测

[English](README.en.md) · [使用文档](https://xxjrq.github.io/aimegeo/) · [资源包与 Skills 下载](https://github.com/xxjrq/aimegeo/releases/latest) · [Gitee 镜像](https://gitee.com/xxjrq/aimegeo)

[官网](https://geo.aimmme.com/) · [客户端下载](https://geo.aimmme.com/download/) · [正式工作台](https://geo.aimmme.com/ag01/) · [官方帮助](https://geo.aimmme.com/docs/)

**把网站、产品或项目交给熟悉的 AI，串起“制作内容 → 自动发布 → 检测引用”。** aimeGeo 是面向内容创作者、独立开发者和品牌团队的 GEO 内容工作台；它将资料、写作、封面、平台账号、发布记录和 AI 引用观测放在一条可回看的工作流里。

本仓库开源的是 **使用教程、Agent Skills、提示词、演示资料与通用辅助脚本**。产品客户端从官方下载中心获取；本仓库不包含 aimeGeo 服务端、客户端业务源码或用户数据。

![aimeGeo 产品宣传界面：内容制作、自动发布、检测引用三步流程](docs/assets/screenshots/01-promotion.png)

## 第一次使用，从这里开始

| 你要做什么 | 打开这份资料 |
| --- | --- |
| 让 AI 帮我下载、安装 | [AI 安装提示词](prompts/setup.md) · [安装指南](docs/installation.md) |
| 不看代码，先跑通一个项目 | [新手上手指南](docs/getting-started.md) |
| 了解三个业务阶段 | [完整使用流程](docs/workflow.md) |
| 给 Codex / Claude Code / WorkBuddy 使用 | [AI 助手指南](docs/ai-assistant.md) · [Skills](skills/README.md) |
| 看真实界面 | [截图与操作说明](docs/screenshot-index.md) |
| 核对平台、模型与当前限制 | [平台和模型能力表](docs/platforms-and-models.md) |
| 连接或操作遇到问题 | [常见问题](docs/faq.md) |

### 直接复制给你的 AI

```text
请按 aimeGeo 的安装与上手指南协助我。
先识别我的操作系统，从 https://geo.aimmme.com/download/ 选择对应官方资源；
帮我完成下载、安装和本人账号连接，再以我提供的网站、产品或项目建立一份内容任务。
先制作并检查一篇图文，再按我指定的账号和平台处理发布，最后查看 AI 提及与引用。
不要把产品目录中的所有平台当成已经验证的自动发布能力，也不要上传我的账号配置或客户资料。
```

在此仓库下载后，也可让 AI 先读取 [skills/aimegeo-setup/SKILL.md](skills/aimegeo-setup/SKILL.md)。**普通用户手动安装客户端不需要 Node.js。**

## 三步完成内容工作流，EasyBR 强力辅助

1. **制作内容**：输入网站、产品或项目，整理事实资料和读者需求；让 AI 生成选题、标题、说明、标签、封面方案和正文。支持把自定义指令复制给熟悉的 AI；自动写作需满足产品当前的运行条件。
2. **自动发布**：准备图文或视频，选择已连接的平台账号，检查素材与平台要求，再执行任务；在发布记录里分清草稿、已提交、审核中和已公开。
3. **检测引用**：围绕固定问题和公开内容链接观察 AI 品牌提及与原生引用，留存回答、来源和检测历史。发布完成不等于已经收录。

**EasyBR 环境隔离**是多账号辅助：每个账号可以使用独立浏览器环境，并按需设置代理 IP 与浏览器指纹。Easy WebBridge 连接已登录的真实浏览器，承担页面操作；它与 aimeGeo 客户端分别解决不同问题。

封面方式包括 Image2、豆包 Seedream、Remotion；可按内容选择尺寸和风格。具体可用方式与外部服务配置以当前产品为准。

## 下载什么，安装什么

- **aimeGeo 客户端**：[官方下载中心](https://geo.aimmme.com/download/)，Windows 与 macOS Apple Silicon 分别选择对应 ZIP。
- **EasyBR（多账号环境隔离，可选）**：[官网下载](https://www.ebrower.com/down.html)；它不替代 aimeGeo 客户端。
- **Easy WebBridge**：[公开仓库](https://github.com/xxjrq/easy-webbridge)。使用已集成 Bridge 的 EasyBR 环境时，按该版本帮助操作；使用其他浏览器时按 Bridge 官方说明连接。
- **本仓库资源**：教程、Skills、提示词与演示文件；不含安装器。当前未核实 Intel Mac / Linux 的 aimeGeo 成品包，先查官方下载页。

镜像地址和来源记录见 [resources.json](resources.json)。固定下载地址可能更新，不在本仓库猜测客户端版本或承诺所有镜像永远一致。

## 可选命令：让 AI 检查环境、列下载、校验文件

这些命令只需要 Node.js 20+，没有运行时依赖。它们不登录账号、不读取 Cookie、不自动运行安装器。

```sh
node scripts/aimegeo.mjs info
node scripts/aimegeo.mjs downloads
node scripts/aimegeo.mjs doctor --offline
node scripts/aimegeo.mjs prompt setup
```

指定目标和保存位置后下载；已有同名文件不会被覆盖：

```sh
node scripts/aimegeo.mjs download --target macos-arm64 --source official --output ./downloads/aimegeomac.zip
node scripts/aimegeo.mjs download --target windows-x64 --source official --output ./downloads/aimegeo.zip
```

文件校验：

```sh
node scripts/aimegeo.mjs verify ./downloads/aimegeomac.zip --sha256 REPLACE_WITH_TRUSTED_SHA256
```

下载命令输出的本地 SHA-256 可用于传输一致性比较；只有与可信发布方提供的值相符，才构成独立校验。命令详情见 [辅助脚本说明](scripts/README.md)。

## 能力说明

- Codex、Claude Code、DeepSeek、豆包、ChatGPT、Gemini、Cursor、Trae、WorkBuddy、Kimi、Qwen Code、ZCode、OpenClaw 是宣传与协作工具目录；图标展示不表示每个工具都有内置自动执行驱动。
- 具体发布平台与内容类型，按 [能力表](docs/platforms-and-models.md) 和当前安装版本选择。CSDN 为国内平台，GitHub 为海外平台；目录收录不代表已完成逐平台实发验收。
- 当前网页引用检测覆盖豆包、DeepSeek、ChatGPT；OpenAI / Perplexity 联网 API 需要配置。
- 系统按当前宣传免费使用；外部模型、图片生成、代理或第三方工具可能另有费用。

## SEO / GEO 友好的开放资料

本项目提供中英文介绍、问题导向教程、明确的能力边界、来源链接、FAQ，以及 [llms.txt](llms.txt) 和 [product.json](product.json)。文档站构建会生成可抓取 HTML、规范链接、结构化数据和站点地图。它们帮助人和 Agent 理解资料，不代表搜索排名、被推荐或引用效果保证。

## 许可与贡献

原创教程、提示词和通用脚本采用 [MIT](LICENSE)；产品软件、商标、官方图标与截图适用范围见 [NOTICE.md](NOTICE.md)。提交建议前请读 [CONTRIBUTING.md](CONTRIBUTING.md)。逐文件公开范围见 [PUBLIC-FILES.md](PUBLIC-FILES.md)。

资料核对日期：2026-10-17。产品页面、客户端下载与功能会更新，以官方说明和实际页面为准。
