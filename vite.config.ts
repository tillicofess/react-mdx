import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from 'rollup-plugin-visualizer';
import { viteExternalsPlugin } from 'vite-plugin-externals';

export default defineConfig({
  plugins: [react(), tailwindcss(),
  visualizer({
    open: true,
    filename: 'dist/stats.html',
  }),
  viteExternalsPlugin({
    axios: 'axios',
  }),
  ],
  assetsInclude: ["**/*.mdx"], // 将MDX文件作为静态资源处理
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173
  },
  // server: {
  //   host: 'dev.ticscreek.top',
  //   port: 5173, // 确保端口号一致
  //   https: {
  //     // 使用 mkcert 生成的本地证书
  //     key: path.resolve(__dirname, 'dev.ticscreek.top-key.pem'), // 替换为你的私钥文件路径
  //     cert: path.resolve(__dirname, 'dev.ticscreek.top.pem'), // 替换为你的证书文件路径
  //   },
  //   proxy: {
  //     "/api": {
  //       target: "https://blog.ticscreek.top",
  //       changeOrigin: true,
  //       secure: false, // 允许代理到 HTTPS 目标，但忽略证书验证 (因为是生产环境，这里通常设为true，除非有自签名证书)
  //       // cookieDomainRewrite: "dev.ticscreek.top",
  //       agent: httpProxyAgent,
  //     },
  //   },
  // },
  // build: {
  //   sourcemap: true,
  //   outDir: 'dist',
  //   rollupOptions: {
  //     output: {
  //       entryFileNames: `js/[name].[hash].js`,
  //       chunkFileNames: `js/[name].[hash].js`,
  //       assetFileNames: `assets/[name].[hash].[ext]`,
  //     },
  //   },
  // },
  build: {
    rollupOptions: {
      treeshake: true,
    },
  }
});
