# 用 Codex、Claude Code 或 WorkBuddy 辅助使用 aimeGeo

把这个仓库交给熟悉的 AI 助手，可以让它帮你选下载资源、读教程、整理项目资料、生成任务草稿和解释检测结果。助手是否能直接操作本机或浏览器，取决于你实际安装的工具与授权，复制提示词本身不会建立连接。

## 先选一种用法

| 方式 | 适合什么 | 入口 |
| --- | --- | --- |
| 直接复制提示词 | 已在使用 Codex、Claude Code 或 WorkBuddy | [安装](../prompts/setup.md)、[制作内容](../prompts/content.md)、[发布](../prompts/publish.md)、[检测引用](../prompts/citations.md) |
| 加载 Skill | Agent 支持读取本地 Skill | [安装](../skills/aimegeo-setup/SKILL.md)、[内容](../skills/aimegeo-content/SKILL.md)、[发布与监测](../skills/aimegeo-publish-monitor/SKILL.md) |
| 手动操作 | 希望先看清业务步骤 | [入门教程](getting-started.md) |

复制提示词后替换方括号字段。只有网址也能开始整理资料；资料不够时让 Agent 列缺项，不让它猜测价格、效果和案例。

## 示例：交给 Agent 的第一句话

```text
请按这个仓库的 docs/installation.md 帮我安装 aimeGeo。
电脑是 [Windows / Apple Silicon Mac]，芯片是 [型号]。
先解释将下载的资源及来源，下载到我指定的文件夹。
不要自动运行安装器；安装后按 docs/getting-started.md 帮我完成第一篇内容。
```

如果没有克隆仓库，可以先访问[官网](https://geo.aimmme.com/)与[正式帮助](https://geo.aimmme.com/docs/)，把官网或下载页地址交给 Agent。需要本地文件时从本公开仓库获取，不把产品私有源码、服务器配置或凭据发给它。

## Skill 怎么用

三个 Skill 都使用标准目录结构：`SKILL.md` 是执行说明，`manifest.yaml` 是分发元信息，`agents/openai.yaml` 是助手界面提示。它们不指定默认模型，也不安装后台服务。

1. 下载对应 Skill 目录，或获取整个仓库。
2. 按你所用 Agent 的当前文档，选择“加载本地 Skill”或放入它支持的 Skill 目录；不同产品的安装位置不同，不通用地执行某条系统安装命令。
3. 也可以直接把 `SKILL.md` 文件交给 Agent，要求它先阅读并按步骤执行。
4. 分发时保留完整仓库结构；单独复制 Skill 时，按下方依赖表一并提供参考文件，或让 Agent 使用文件内的官方帮助链接。

| Skill | 触发场景 | 参考材料 |
| --- | --- | --- |
| `aimegeo-setup` | 下载、安装、首次登录、连接检查 | `docs/installation.md`、`docs/faq.md`、`prompts/setup.md` |
| `aimegeo-content` | 网站/项目转资料、选题、文章草稿 | `docs/workflow.md`、`docs/platforms-and-models.md`、`prompts/content.md`、`examples/` |
| `aimegeo-publish-monitor` | 同步账号、发布核验、引用检测 | `docs/workflow.md`、`docs/platforms-and-models.md`、`prompts/publish.md`、`prompts/citations.md` |

## 工具目录与站内自动写作有什么区别

产品展示的协作工具包括 Codex、Claude Code、DeepSeek、豆包、ChatGPT、Gemini、Cursor、Trae、WorkBuddy、Kimi、Qwen Code、ZCode 和 OpenClaw。你可用熟悉的工具准备指令、资料和草稿；具体工具能力以其实际版本为准。

新手优先让外部 Agent 按[内容提示词](../prompts/content.md)生成草稿，再打开[文章](https://geo.aimmme.com/ag01/geo/writing/articles)，点击“添加文章”，填标题、摘要、分类和 Markdown 正文，添加图片后点击“创建”。重新打开已保存文章核对结果。这个流程无需站内自动写作配置。

站内自动写作是可选能力，当前使用已可用的本机 Codex 写作环境；尚未配置时查[官方帮助](https://geo.aimmme.com/docs/)或联系支持，不在公共教程中要求私有配置脚本。13 个协作工具图标不代表同等站内自动执行能力。

## 什么可以交给 AI

AI 可以读公开文档、比较操作系统资源、归纳资料、准备标题与正文、检查缺失字段、解释任务状态，并在已有工具与明确授权下协助操作。

账号密码、验证码、密钥和支付信息留在对应官方界面或安全配置中，不写进提示词、截图和公开 issue。准备发布任务与实际对外投稿分开理解：先核对账号、内容、平台及用户发布意图，再执行对外操作。

AI 的结论附证据：下载用来源与文件；安装用实际启动；发布用平台回执；引用用原始回答和原生来源。缺少证据就写待核验。参见[能力清单](platforms-and-models.md)与[FAQ](faq.md)。
