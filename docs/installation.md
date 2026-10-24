# aimeGeo 下载与安装：Windows 与 Apple Silicon Mac

从[官方下载中心](https://geo.aimmme.com/download/)选择你的系统，下载后解压并按包内说明安装。手动安装不需要 Node.js，也不需要克隆产品源码。本仓库提供教程、提示词和 Skill，不包含 aimeGeo 产品的完整源码。

## 选择安装包

| 电脑 | 当前已核实资源 | 操作 |
| --- | --- | --- |
| Apple 芯片 Mac（arm64） | macOS 正式 ZIP，文件名 `aimegeomac.zip` | 在下载中心选择 macOS |
| Windows | Windows 正式 ZIP，文件名 `aimegeo.zip` | 在下载中心选择 Windows，并查看页面兼容要求 |
| Intel Mac | 暂无已核实的兼容包 | 联系官网支持确认；不要把 arm64 包当作 Intel 版本 |
| Linux | 暂无已核实的安装包 | 使用网页版查看适用功能，需本机自动化的流程先确认支持情况 |

Mac 可在“关于本机”查看芯片；Windows 可在“设置 → 系统 → 系统信息”查看系统与体系结构。不要为匹配示例而下载不适合自己电脑的文件。

## GitHub 平台版本入口

官网与既有下载渠道继续保留；需要从 GitHub 查找对应版本时，按系统打开准确的发行页：

| 系统 | GitHub 版本页 |
| --- | --- |
| macOS Apple Silicon | [Mac 1.0.8 · mac-v1.0.8](https://github.com/huakaikanzhe-web/aimegeo/releases/tag/mac-v1.0.8) |
| Windows | [Windows 1.0.7 · windows-v1.0.7](https://github.com/huakaikanzhe-web/aimegeo/releases/tag/windows-v1.0.7) |

在版本页核对系统、附件和校验清单后下载。两种系统版本分别维护，不使用仓库全局 latest 判断自己应安装哪一版。附件校验值见版本页清单和本仓库 `resources.json` 的 `githubReleasePages`，仅对应列明的附件；也可使用[官方下载中心](https://geo.aimmme.com/download/)或 [Gitee 原发行仓库](https://gitee.com/xxjrq/aimegeo/releases)。

## 安装并登录

1. 从官方下载中心下载对应 ZIP，记录页面显示的系统、版本和下载日期。
2. 解压后阅读包内说明，运行对应安装程序。更新时先正常退出旧版 aimeGeo，再打开新版本，保留已登录的平台浏览器。
3. 打开客户端，确认加载[正式工作台](https://geo.aimmme.com/ag01/)，使用自己的账号登录。
4. 如同时使用网页，网页与客户端登录同一个 aimeGeo 账号。
5. 需要账号同步、自动发布或网页 AI 检测时，保持客户端运行，在目标浏览器中完成 Easy WebBridge 连接。

操作画面见[使用截图索引](screenshot-index.md)。下载来源、包内提示与系统实际弹窗不一致时先核对来源；不要复制网上不明脚本来关闭系统安全机制。

## AI 帮你安装

将[安装提示词](../prompts/setup.md)复制给 Codex、Claude Code 或 WorkBuddy，补充操作系统和芯片型号。Agent 可以帮助选择下载入口、解释安装步骤和检查连接；账号密码、验证码、支付和系统授权由你在官方界面完成。

可选辅助工具需要 Node.js；只打印资源和诊断信息，不会代你运行安装器。先从仓库根目录运行：

```sh
node scripts/aimegeo.mjs info
node scripts/aimegeo.mjs downloads
node scripts/aimegeo.mjs doctor --offline
```

`--offline` 只检查本地条件，不能证明网络、正式站点或下载文件可用。需要下载时运行：

```sh
node scripts/aimegeo.mjs download --target macos-arm64 --output /absolute/path/aimegeomac.zip --source official
# Windows x64 示例；仅在你的系统与下载页面说明匹配时使用
node scripts/aimegeo.mjs download --target windows-x64 --output /absolute/path/aimegeo.zip --source official
```

把示例绝对路径换成你可写入的本机路径。脚本若不支持所选来源或资源不可用，返回官方下载中心选择资源，不猜测镜像链接。仅在有可信来源提供的 SHA-256 时校验：

```sh
node scripts/aimegeo.mjs verify /absolute/path/aimegeomac.zip --sha256 REPLACE_WITH_TRUSTED_SHA256
```

自行计算一个哈希只能建立本地指纹，不能独立证明文件来自官方。

## 第一次连接浏览器

1. 在你准备发文的平台浏览器中安装并启用 Easy WebBridge：打开[Easy WebBridge 公开仓库](https://github.com/xxjrq/easy-webbridge)，按当前 README 的安装说明操作，不照搬过期命令。安装后的连接检查见[正式帮助](https://geo.aimmme.com/docs/publish-flow/)。
2. 在该浏览器登录目标平台，确认扩展显示“已连接，可以使用”。
3. 回到工作台检查顶栏连接状态，必要时重新检测。
4. 进入[账号授权](https://geo.aimmme.com/ag01/geo/publish/self-accounts)，添加平台，读取并选择正确浏览器环境，执行账号同步。
5. 对照平台页面核对昵称、用户名、平台 ID 与头像。

扩展在线、客户端运行、网页账号配对是不同条件。连接失败时见[常见问题](faq.md)，成功后继续[第一次使用](getting-started.md)。
