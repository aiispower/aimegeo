# 通用辅助命令

`aimegeo.mjs` 是本资源仓库的通用下载与提示词助手，不包含产品内部接口或业务实现。仅需 Node.js 20+，运行它不必 `npm install`。

| 命令 | 用途 |
| --- | --- |
| `node scripts/aimegeo.mjs info --json` | 列出官网、正式工作台、下载与帮助入口 |
| `node scripts/aimegeo.mjs downloads --json` | 列出已登记的客户端目标与官方镜像 |
| `node scripts/aimegeo.mjs doctor --offline` | 只读取操作系统、架构和 Node 版本 |
| `node scripts/aimegeo.mjs doctor` | 另检查公开官网、下载、帮助页是否可访问 |
| `node scripts/aimegeo.mjs prompt setup` | 输出安装提示词；另可选 `content`、`publish`、`citations` |
| `node scripts/aimegeo.mjs download --target macos-arm64 --output ./downloads/aimegeomac.zip` | 下载选定目标，不覆盖已有文件、不运行安装器 |
| `node scripts/aimegeo.mjs verify ./downloads/aimegeomac.zip --sha256 <可信校验值>` | 比较本地文件与可信 SHA-256 |

`download` 的 `--source` 可选 `official`、`overseas`；只有清单登记了已发布镜像时，`github` 才可用。当前资源包不含安装器，也未登记 GitHub 安装器镜像。不要因为 GitHub 源不可用就猜测地址。

下载会拒绝 HTTP 来源、网页响应、非 ZIP 内容和校验不符的文件，失败后清理临时文件。文件头检查只确认 ZIP 形态，不替代完整解压检查、发布方签名或独立可信校验。

`resources.json` 的固定链接可能指向更新后的版本。未提供发布方校验值时，只输出本地 SHA-256，不声称已完成发布方校验。校验无误后按 [安装指南](../docs/installation.md) 操作。

## 资源维护与检查

```sh
npm ci
npm test
npm run build
npm run preview
npm run manifest
npm run audit:public
npm run package:review
```

`npm ci` 仅为维护者安装文档生成器；产品用户无需这一步。`manifest` 会刷新逐文件白名单、大小和校验值；新增文件仍需所有者审阅。`package:review` 只打包白名单内容，不包含 `node_modules`、构建产物、Git 历史或本机文件。脚本不执行 GitHub 创建、推送或发布。

`preview` 仅在本机监听静态文档预览，按命令输出地址打开；使用完按 Ctrl+C 退出。它只提供 `dist/` 的公开文档，不读取产品服务、账号或工作目录中的其他文件。文档站部署需另外明确选择发布位置，本资源没有自动部署任务。

当前只提供 GitHub 文档入口，未部署独立 Pages 文档站。`npm run build` / `preview` 保留本地预览，`llms.txt` 与正文索引链接指向实际 GitHub 文件；配置中的 example.invalid 仅为本地预览占位，不是访问入口。安装器版本页见[安装指南](../docs/installation.md)。
