import { defineConfig } from "vite";
import path from "path";
import fs from 'fs'
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { HttpsProxyAgent } from "https-proxy-agent";

const httpProxyAgent = new HttpsProxyAgent("http://127.0.0.1:7890");
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))
const version = `v${pkg.version}`

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  {
    name: 'move-sourcemaps-to-versioned-folder',
    closeBundle() {
      const distPath = path.resolve(__dirname, 'dist')
      const jsPath = path.join(distPath, 'js')
      const mapPath = path.join(distPath, `${version}_map`)

      if (!fs.existsSync(mapPath)) {
        fs.mkdirSync(mapPath)
      }

      const files = fs.readdirSync(jsPath)

      files.forEach((file) => {
        if (file.endsWith('.map')) {
          const from = path.join(jsPath, file)
          const to = path.join(mapPath, file) // ✅ 不加版本号前缀
          fs.renameSync(from, to)
        }
      })

      console.log(`✔️ Source maps moved to ${version}_map/`)
    },
  },
  ],
  define: {
    __APP_VERSION__: JSON.stringify(version), // 👈 注入全局常量
  },
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
    rollupOptions: {
      output: {
        entryFileNames: `js/[name].[hash].js`,
        chunkFileNames: `js/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
  },
});
