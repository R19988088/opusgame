OPUS 网页版 — 部署说明
========================

目录结构：
  index.html            游戏主体（约 0.3 MB）
  audio/*.mp3           四首内置曲目的音频（按曲目按需加载）
  manifest.webmanifest  PWA 配置
  sw.js                 Service Worker（离线缓存）
  icons/                桌面图标

部署（任选一种，需 HTTPS）：
  1) Cloudflare Pages（推荐，免费、全球 CDN、无需备案）
     - 把整个 web 目录内容上传；构建命令留空，输出目录填 ./
  2) Vercel / Netlify：拖拽整个 web 目录即可
  3) GitHub Pages：把文件推到仓库，Settings → Pages 选择分支
  4) 自己的服务器 / 对象存储 + CDN：把 web 目录设成静态站点根目录
国内用户访问建议用国内对象存储（阿里云 OSS / 腾讯云 COS）+ CDN，并绑定已备案域名。

注意：
  - 必须通过 http(s) 访问；直接双击 index.html（file://）时音频会被浏览器 CORS 拦截。
  - 浏览器要求首次点击后才能出声：进入游戏点「开始演奏」即可。
  - 导入的歌曲与生成的谱面存在浏览器 IndexedDB 里（同域名下持久）。
  - 改了游戏版本后，记得把 sw.js 里的 CACHE 名（opus-v1）改一下，否则旧缓存会被继续使用。
