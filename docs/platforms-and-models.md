# aimeGeo 平台、AI 工具与引用检测能力

本表按 2026-10-18 的产品目录和实现声明整理，帮助你选择第一条可执行流程。具备自动投稿功能不等于每个账号、客户端版本和平台页面都已实测通过；每次真实投稿以任务回执和平台页面为准。

## 支持无限扩展平台

当前非退役平台目录为 **30 个**（国内 21 个、海外 9 个），全部名称与官方图标见本页下方的完整目录。利用 Easy WebBridge、自定义指令和浏览器自动化，可持续适配新的平台操作与工作流；新增平台需配置和验证，不等于所有目录条目都已具备自动发布能力。

[官网平台目录](https://geo.aimmme.com/platforms/) · [官网帮助文档](https://geo.aimmme.com/docs/)

## 国内发布平台

| 平台 | 当前能力说明 |
| --- | --- |
| CSDN | 图文自动投稿能力已接入；发布后核验平台链接与正文 |
| B站 | 图文与视频自动投稿已接入；分别核验素材与客户端支持 |
| 头条号 | 图文自动投稿能力已接入 |
| 小红书 | 图文与视频自动投稿已接入；以任务回执为准 |
| 百家号 | 仅保存草稿，最终发布需到平台手动完成 |
| 企鹅号 | 图文自动投稿已接入，正式验收待补 |
| 抖音 | 视频自动投稿已接入；图文发布未验收，不列为已可用图文链路 |
| 知乎 | 仅目录声明，自动发布尚不可用 |
| 微博 | 仅目录声明，自动发布尚不可用 |
| 掘金 | 仅目录声明，自动发布尚不可用 |
| 博客园 | 仅目录声明，自动发布尚不可用 |
| 51CTO | 仅目录声明，自动发布尚不可用 |
| 简书 | 仅目录声明，自动发布尚不可用 |
| 思否 | 仅目录声明，自动发布尚不可用 |
| 开源中国 | 仅目录声明，自动发布尚不可用 |
| 腾讯云开发者社区 | 仅目录声明，自动发布尚不可用 |
| 阿里云开发者社区 | 仅目录声明，自动发布尚不可用 |
| 网易 | 保留目录，当前不支持发布 |
| 搜狐 | 保留目录，当前不支持发布 |
| 公众号 | 保留目录，当前不支持发布 |
| Gitee | 账号同步已接入，自动发布尚不可用 |

闲鱼商品发布流程已退役，不属于本教程发布范围。

## 海外平台

| 平台 | 当前能力说明 |
| --- | --- |
| GitHub | 已接入 Gist 发文能力；不是普通仓库发布，暂未开放为图文发布选项 |
| Reddit | 仅目录声明，自动发布尚不可用 |
| LinkedIn 领英 | 仅目录声明，自动发布尚不可用 |
| X（Twitter） | 仅目录声明，自动发布尚不可用 |
| Threads | 仅目录声明，自动发布尚不可用 |
| Discord | 仅目录声明，自动发布尚不可用 |
| Facebook | 仅目录声明，自动发布尚不可用 |
| TikTok | 仅目录声明，自动发布尚不可用 |
| YouTube | 仅目录声明，自动发布尚不可用 |

平台目录、官方品牌图标、账号同步与自动发布是不同能力。不要用“目录平台数量”计算实际可自动发布平台数量，也不要将国内抖音的自动投稿能力视为 TikTok 支持。

## 图文与视频

内容类型在制作时保存，发布继承它。当前视频任务面向抖音、B站、小红书；需要具备相应能力的本机客户端和真实视频素材。旧客户端不具备视频执行能力时，更新前不能执行，系统不会将其改成图文任务。

## AI Agent 与协作工具

产品协作工具目录列出以下 13 个名称：Codex、Claude Code、DeepSeek、豆包、ChatGPT、Gemini、Cursor、Trae、WorkBuddy、Kimi、Qwen Code、ZCode、OpenClaw。

目录表达“用熟悉的 AI 准备内容与工作指令”。新手可用外部 Agent 起稿，再到文章页“添加文章”保存，步骤见[AI 使用方法](ai-assistant.md)。站内自动写作是可选能力，当前使用已可用的本机 Codex 写作环境；未配置时查官方帮助或联系支持，不妨碍手动保存草稿。其他工具可使用本仓库提示词和 Skill，具体本机操作能力取决于工具配置。这里没有承诺 13 个 Agent 均已完成站内自动接入。

## AI 引用检测

| 通道 | 当前状态 | 需要什么 |
| --- | --- | --- |
| 豆包网页 | 可用网页采集通道 | 已登录浏览器、正确环境、联网回答与原生证据 |
| DeepSeek 网页 | 可用网页采集通道 | 已登录浏览器、正确环境、联网回答与原生证据 |
| ChatGPT 网页 | 可用网页采集通道 | 已登录浏览器、正确环境、联网回答与原生证据 |
| OpenAI 联网 API | 需服务端配置 | 对应 API 配置、权限、额度与联网能力 |
| Perplexity 联网 API | 需服务端配置 | 对应 API 配置、权限与额度 |
| Kimi 网页 | 待接入 | 当前不可当作可执行检测通道 |
| Perplexity 网页 | 待接入 | 当前不可当作可执行检测通道 |

宣传目录还展示通义千问、文心一言、纳米 AI、Kimi、智谱清言、腾讯元宝等品牌。展示不等于这些网页检测器已经可执行。选择检测时，以工作台当前可用通道与真实采集结果为准。

网页与 API 是不同入口，同名模型的两类结果也不能混算。一条原生引用只证明某次回答引用了该来源，不能推导出模型训练收录、永久收录或所有用户都能得到同样回答。

## 图片与环境辅助

封面制作介绍包括 Image2、豆包 Seedream、Remotion、多尺寸与多风格。模型调用以实际配置、额度与授权为准；Remotion 用程序和模板渲染图片，不能理解为免费调用所有外部模型。

EasyBR 管理独立浏览器环境、代理 IP 和指纹；Easy WebBridge 操作环境内已登录的真实网页。配置隔离不构成账号不关联或不受平台限制的保证。

本页是能力说明，不是未来路线图。下载和帮助以[官网](https://geo.aimmme.com/)、[下载中心](https://geo.aimmme.com/download/)与[正式帮助](https://geo.aimmme.com/docs/)最新信息为准。

## 完整目录与官方图标

目录用于识别品牌；实际可执行能力见本页各项说明。图标来源记录见[官网素材来源清单](https://geo.aimmme.com/medias/brand-sources.json)。

### 国内平台（21 个）

| 图标 | 名称 |
| --- | --- |
| <img src="https://geo.aimmme.com/img/platforms/csdn.png" alt="CSDN 官方图标" width="36" height="36"> | CSDN |
| <img src="https://geo.aimmme.com/img/platforms/douyin.png" alt="抖音 官方图标" width="36" height="36"> | 抖音 |
| <img src="https://geo.aimmme.com/img/platforms/bilibili.png" alt="B站 官方图标" width="36" height="36"> | B站 |
| <img src="https://geo.aimmme.com/img/platforms/toutiao.png" alt="今日头条 官方图标" width="36" height="36"> | 今日头条 |
| <img src="https://geo.aimmme.com/img/platforms/xiaohongshu.png" alt="小红书 官方图标" width="36" height="36"> | 小红书 |
| <img src="https://geo.aimmme.com/img/platforms/weibo.png" alt="微博 官方图标" width="36" height="36"> | 微博 |
| <img src="https://geo.aimmme.com/img/platforms/zhihu.png" alt="知乎 官方图标" width="36" height="36"> | 知乎 |
| <img src="https://geo.aimmme.com/img/platforms/juejin.png" alt="掘金 官方图标" width="36" height="36"> | 掘金 |
| <img src="https://geo.aimmme.com/img/platforms/baijiahao.png" alt="百家号 官方图标" width="36" height="36"> | 百家号 |
| <img src="https://geo.aimmme.com/img/platforms/cnblogs.png" alt="博客园 官方图标" width="36" height="36"> | 博客园 |
| <img src="https://geo.aimmme.com/img/platforms/51cto.png" alt="51CTO 官方图标" width="36" height="36"> | 51CTO |
| <img src="https://geo.aimmme.com/img/platforms/jianshu.png" alt="简书 官方图标" width="36" height="36"> | 简书 |
| <img src="https://geo.aimmme.com/img/platforms/segmentfault.png" alt="思否 官方图标" width="36" height="36"> | 思否 |
| <img src="https://geo.aimmme.com/img/platforms/oschina.png" alt="开源中国 官方图标" width="36" height="36"> | 开源中国 |
| <img src="https://geo.aimmme.com/img/platforms/tencent_cloud_dev.png" alt="腾讯云开发者社区 官方图标" width="36" height="36"> | 腾讯云开发者社区 |
| <img src="https://geo.aimmme.com/img/platforms/aliyun_dev.png" alt="阿里云开发者社区 官方图标" width="36" height="36"> | 阿里云开发者社区 |
| <img src="https://geo.aimmme.com/img/platforms/qiehao.png" alt="企鹅号 官方图标" width="36" height="36"> | 企鹅号 |
| <img src="https://geo.aimmme.com/img/platforms/netease.png" alt="网易 官方图标" width="36" height="36"> | 网易 |
| <img src="https://geo.aimmme.com/img/platforms/sohu.png" alt="搜狐 官方图标" width="36" height="36"> | 搜狐 |
| <img src="https://geo.aimmme.com/img/platforms/wechat.png" alt="微信公众号 官方图标" width="36" height="36"> | 微信公众号 |
| <img src="https://geo.aimmme.com/img/platforms/gitee.png" alt="Gitee 官方图标" width="36" height="36"> | Gitee |

### 海外平台（9 个）

| 图标 | 名称 |
| --- | --- |
| <img src="https://geo.aimmme.com/img/platforms/github.png" alt="GitHub 官方图标" width="36" height="36"> | GitHub |
| <img src="https://geo.aimmme.com/img/platforms/reddit.png" alt="Reddit 官方图标" width="36" height="36"> | Reddit |
| <img src="https://geo.aimmme.com/img/platforms/linkedin.png" alt="LinkedIn 领英 官方图标" width="36" height="36"> | LinkedIn 领英 |
| <img src="https://geo.aimmme.com/img/platforms/x.png" alt="X（Twitter） 官方图标" width="36" height="36"> | X（Twitter） |
| <img src="https://geo.aimmme.com/img/platforms/threads.png" alt="Threads 官方图标" width="36" height="36"> | Threads |
| <img src="https://geo.aimmme.com/img/platforms/discord.png" alt="Discord 官方图标" width="36" height="36"> | Discord |
| <img src="https://geo.aimmme.com/img/platforms/facebook.png" alt="Facebook 官方图标" width="36" height="36"> | Facebook |
| <img src="https://geo.aimmme.com/img/platforms/tiktok.png" alt="TikTok 官方图标" width="36" height="36"> | TikTok |
| <img src="https://geo.aimmme.com/img/platforms/youtube.png" alt="YouTube 官方图标" width="36" height="36"> | YouTube |

### AI 工具与 Agent（13 个）

| 图标 | 名称 |
| --- | --- |
| <img src="https://geo.aimmme.com/img/agents/codex.png" alt="Codex 官方图标" width="36" height="36"> | Codex |
| <img src="https://geo.aimmme.com/img/agents/claude-code.png" alt="Claude Code 官方图标" width="36" height="36"> | Claude Code |
| <img src="https://geo.aimmme.com/img/agents/deepseek.png" alt="DeepSeek 官方图标" width="36" height="36"> | DeepSeek |
| <img src="https://geo.aimmme.com/img/agents/doubao.png" alt="豆包 官方图标" width="36" height="36"> | 豆包 |
| <img src="https://geo.aimmme.com/img/agents/chatgpt.png" alt="ChatGPT 官方图标" width="36" height="36"> | ChatGPT |
| <img src="https://geo.aimmme.com/img/agents/gemini.png" alt="Gemini 官方图标" width="36" height="36"> | Gemini |
| <img src="https://geo.aimmme.com/img/agents/cursor.png" alt="Cursor 官方图标" width="36" height="36"> | Cursor |
| <img src="https://geo.aimmme.com/img/agents/trae.png" alt="Trae 官方图标" width="36" height="36"> | Trae |
| <img src="https://geo.aimmme.com/img/agents/workbuddy.png" alt="WorkBuddy 官方图标" width="36" height="36"> | WorkBuddy |
| <img src="https://geo.aimmme.com/img/agents/kimi.png" alt="Kimi 官方图标" width="36" height="36"> | Kimi |
| <img src="https://geo.aimmme.com/img/agents/qwen-code.png" alt="Qwen Code 官方图标" width="36" height="36"> | Qwen Code |
| <img src="https://geo.aimmme.com/img/agents/zcode.png" alt="ZCode 官方图标" width="36" height="36"> | ZCode |
| <img src="https://geo.aimmme.com/img/agents/openclaw.png" alt="OpenClaw 官方图标" width="36" height="36"> | OpenClaw |

### 大模型与服务目录（9 个）

| 图标 | 名称 |
| --- | --- |
| <img src="https://geo.aimmme.com/img/models/doubao.png" alt="豆包 官方图标" width="36" height="36"> | 豆包 |
| <img src="https://geo.aimmme.com/img/models/deepseek.png" alt="DeepSeek 官方图标" width="36" height="36"> | DeepSeek |
| <img src="https://geo.aimmme.com/img/models/qianwen.png" alt="通义千问 官方图标" width="36" height="36"> | 通义千问 |
| <img src="https://geo.aimmme.com/img/models/wenxin.png" alt="文心一言 官方图标" width="36" height="36"> | 文心一言 |
| <img src="https://geo.aimmme.com/img/models/nami.png" alt="纳米 AI 官方图标" width="36" height="36"> | 纳米 AI |
| <img src="https://geo.aimmme.com/img/models/kimi.png" alt="Kimi 官方图标" width="36" height="36"> | Kimi |
| <img src="https://geo.aimmme.com/img/models/zhipu.png" alt="智谱清言 官方图标" width="36" height="36"> | 智谱清言 |
| <img src="https://geo.aimmme.com/img/models/yuanbao.png" alt="腾讯元宝 官方图标" width="36" height="36"> | 腾讯元宝 |
| <img src="https://geo.aimmme.com/img/agents/chatgpt.png" alt="ChatGPT 官方图标" width="36" height="36"> | ChatGPT |
