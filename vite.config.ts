import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.mdx"], // 将MDX文件作为静态资源处理
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
