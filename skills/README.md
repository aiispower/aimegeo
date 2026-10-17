# aimeGeo Agent Skills

这三个 Skill 是可复用的任务说明，不是产品源码、账号配置或模型驱动。可让熟悉的 AI 先读取对应 `SKILL.md`，也可按 AI 工具自己的说明加入技能目录。没有通用的“一条命令安装到所有 Agent”。

| Skill | 什么时候用 | 主要输出 |
| --- | --- | --- |
| [aimegeo-setup](aimegeo-setup/SKILL.md) | 下载、安装、更新、首次连接 | 匹配的官方资源、安装与连接步骤、当前检查结果 |
| [aimegeo-content](aimegeo-content/SKILL.md) | 从网站、产品或项目制作一篇内容 | 资料摘要、标题、正文、标签、封面建议与保存检查 |
| [aimegeo-publish-monitor](aimegeo-publish-monitor/SKILL.md) | 发布图文/视频、检查 AI 提及与引用 | 发布条件检查、实际结果摘要、引用观测与复测安排 |

## 直接使用

```text
请读取本仓库的 skills/aimegeo-setup/SKILL.md，按其中的输入要求和步骤协助我安装并开始使用 aimeGeo。若当前工具无法操作浏览器或本机，请给我对应的手动步骤，并说明哪些动作尚未执行。
```

每个目录含标准 `SKILL.md`、资源包说明 `manifest.yaml` 和可选 `agents/openai.yaml` 展示元信息，不设置默认模型。若只复制一个 Skill 文件夹，文档相对链接可能不存在；此时使用 Skill 中提供的官方帮助链接，或保留整个资源仓库。更多说明见 [AI 助手指南](../docs/ai-assistant.md)。
