# FlowBlocks PWA 使用说明

## iPhone 安装方式

1. 用 Safari 打开部署后的 HTTPS 链接。
2. 点击 Safari 底部分享按钮。
3. 选择“添加到主屏幕”。
4. 回到桌面，点击 FlowBlocks 图标打开。

## 重要限制

- iPhone PWA 首次安装必须通过 Safari 打开 HTTPS 链接。
- 安装后可以像 App 一样从桌面打开。
- 离线能力依赖浏览器缓存：首次打开并加载完成后，后续离线打开会更稳定。
- iOS Web App 不能直接调用系统勿扰模式；正式原生 App 才能接系统能力。

## 部署建议

如果 Vercel 访问不稳定，可以把 `npm run build` 生成的 `dist` 文件夹部署到国内 HTTPS 静态托管：

- 阿里云 OSS 静态网站
- 腾讯云 COS 静态网站
- Cloudflare Pages
- 自己的 HTTPS 服务器
