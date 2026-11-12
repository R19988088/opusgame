# Windows 桌面外壳（Electron）

这里是 OPUS Windows 便携版的 Electron 主进程、预加载脚本和图标。游戏本体源码在仓库的 [`web/`](../web/) 目录。

打包后的 `OPUS.html`（约 12 MB 的单文件游戏，内嵌音频）没有提交到本仓库，避免与 `web/` 重复。发布用的完整 Windows 压缩包请到 [Releases](https://github.com/ZHFred/opusgame/releases/latest) 下载。

## 运行时行为

- 自定义协议 `opus://app` 加载本地页面，保证 localStorage / IndexedDB 存档可用
- 单实例锁；隐藏菜单栏
- 用户数据目录设为 `OPUS.exe` 旁边的 `data/`（导入歌曲、最高分、编辑后的谱面都在这里）
- 右下角悬浮「全屏」按钮（会自动淡出），或按 `F11`；`F12` 打开开发者工具

## 本地开发 / 再打包（简要）

1. 安装 [Node.js](https://nodejs.org/) 与 Electron（例如在本目录执行 `npm install --save-dev electron@33`）。
2. 把游戏页面放到本目录并命名为 `OPUS.html`。可以从已发布的 Windows 包的 `resources/app/OPUS.html` 取出，或自行把 `web/` 打成单文件后放到这里。`main.js` 默认加载 `opus://app/OPUS.html`。
3. 开发调试：`npx electron .`
4. 发布包可用 `electron-packager` 或 `electron-builder` 打成 Windows x64 便携目录，再把整个文件夹打成 zip。不要把用户的 `data/` 文件夹打进去，也不要提交签名密钥。

> `package.json` 里的 `version` 字段目前仍是 `5.1.0`，对应外壳初始化时的版本号；游戏内容以发布标签 **v5.7** 为准。
