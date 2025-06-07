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
    proxy: {
      "/api": {
        target: "https://ticscreek.top",
        changeOrigin: true,
        secure: true, // 本地开发使用 HTTP
        cookieDomainRewrite: "localhost", // 重写 cookie 的 domain 为 localhost
        rewrite: (path) => path.replace(/^\/api/, "/test"), // 根据实际接口路径调整
        // configure: (proxy) => {
        //   proxy.on("proxyRes", (proxyRes, req, res) => {
        //     const cookies = proxyRes.headers["set-cookie"];
        //     if (cookies) {
        //       // 打印 set-cookie 头
        //       console.log("Set-Cookie from backend:", cookies);
        //     }
        //   });
        // },
        agent: httpProxyAgent,
      },
    },
  },
});
