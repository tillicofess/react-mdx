import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { HttpsProxyAgent } from "https-proxy-agent";

const httpProxyAgent = new HttpsProxyAgent("http://127.0.0.1:7890"); // 你的外部代理地址
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.mdx"], // 将MDX文件作为静态资源处理
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: 'dev.ticscreek.top', // 让 Vite 监听这个域名
    port: 5173, // 确保端口号一致
    https: {
      // 使用 mkcert 生成的本地证书
      key: path.resolve(__dirname, 'dev.ticscreek.top-key.pem'), // 替换为你的私钥文件路径
      cert: path.resolve(__dirname, 'dev.ticscreek.top.pem'), // 替换为你的证书文件路径
    },
    proxy: {
      "/api": {
        target: "https://blog.ticscreek.top",
        changeOrigin: true,
        secure: false, // 允许代理到 HTTPS 目标，但忽略证书验证 (因为是生产环境，这里通常设为true，除非有自签名证书)
        cookieDomainRewrite: "dev.ticscreek.top",
        agent: httpProxyAgent,
      },
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
  }
});
