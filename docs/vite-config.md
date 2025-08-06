# Vite 配置文档

本文档详细介绍了项目中 `vite.config.ts` 的配置及其作用，适合初学者了解项目的构建和开发环境设置。

## 基本概述

`vite.config.ts` 是 Vite 构建工具的配置文件，用于定义项目的构建、开发服务器和插件等相关设置。

## 主要配置项解析

### 插件配置

```typescript
plugins: [react(), tailwindcss(),
  {
    name: 'move-sourcemaps-to-versioned-folder',
    // ...
  }
]
```

- **react()**: 添加 React 支持，处理 JSX 转换
- **tailwindcss()**: 集成 Tailwind CSS 框架
- **自定义插件**: 用于在构建完成后将源映射文件移动到版本化文件夹

### 全局常量定义

```typescript
define: {
  __APP_VERSION__: JSON.stringify(version),
}
```

这里定义了一个全局常量 `__APP_VERSION__`，它包含了从 package.json 中读取的版本号，可以在应用代码中直接使用。

### 资源处理

```typescript
assetsInclude: ["**/*.mdx"]
```

将 MDX 文件作为静态资源处理，这对于基于 MDX 的内容非常重要。

### 路径别名

```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}
```

设置了路径别名，使得可以使用 `@` 符号来引用 `src` 目录下的文件，简化导入路径。

### 开发服务器配置

```typescript
server: {
  host: 'dev.ticscreek.top',
  port: 5173,
  https: {
    key: path.resolve(__dirname, 'dev.ticscreek.top-key.pem'),
    cert: path.resolve(__dirname, 'dev.ticscreek.top.pem'),
  },
  proxy: {
    "/api": {
      target: "https://blog.ticscreek.top",
      changeOrigin: true,
      secure: false,
      cookieDomainRewrite: "dev.ticscreek.top",
      agent: httpProxyAgent,
    },
  },
}
```

- **host**: 设置开发服务器监听的域名
- **port**: 设置开发服务器端口
- **https**: 配置 HTTPS 证书，用于本地开发环境的 HTTPS 支持
- **proxy**: 设置 API 代理，将 `/api` 开头的请求转发到生产环境，便于本地开发时使用真实 API

### 构建配置

```typescript
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
}
```

- **sourcemap**: 生成源映射文件，便于调试
- **outDir**: 指定构建输出目录
- **rollupOptions.output**: 配置输出文件的命名规则，添加哈希值用于缓存破坏

## 特殊功能

### 源映射文件处理

项目中包含一个自定义插件，用于在构建完成后将源映射文件移动到特定的版本化文件夹：

```typescript
{
  name: 'move-sourcemaps-to-versioned-folder',
  closeBundle() {
    // 将源映射文件移动到版本化文件夹的逻辑
  },
}
```

这有助于管理不同版本的源映射文件，便于线上调试。

### HTTP 代理配置

```typescript
const httpProxyAgent = new HttpsProxyAgent("http://127.0.0.1:7890");
```

配置了 HTTP 代理，用于在某些网络环境下访问外部资源。

## 初学者使用指南

1. **开发环境启动**: 运行 `npm run dev` 或 `yarn dev` 启动开发服务器
2. **构建生产版本**: 运行 `npm run build` 或 `yarn build` 生成生产环境代码
3. **自定义配置**: 如需修改配置，请参考 [Vite 官方文档](https://vitejs.dev/config/)

## 常见问题

1. **路径别名不生效**: 确保在 `tsconfig.json` 中也配置了相应的路径别名
2. **HTTPS 证书问题**: 本地开发需要生成并信任自签名证书
3. **代理配置**: 如遇到跨域问题，检查代理配置是否正确

通过理解这些配置，你可以更好地掌握项目的构建过程和开发环境设置。