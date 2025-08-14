# Vite 代理转发技术文档

## 概述

本文档详细介绍了在基于 Vite 的前端开发环境中，浏览器、Vite 开发服务器和后端服务器之间的请求流程，特别是通过 Vite 的代理功能实现的请求转发过程。

## Vite 代理配置解析

在当前项目中，`vite.config.ts` 文件配置了以下代理规则：

```typescript
server: {
  host: 'dev.ticscreek.top', // 让 Vite 监听这个域名
  port: 5173, // 确保端口号一致
  https: {
    // 使用 mkcert 生成的本地证书
    key: path.resolve(__dirname, 'dev.ticscreek.top-key.pem'),
    cert: path.resolve(__dirname, 'dev.ticscreek.top.pem'),
  },
  proxy: {
    "/api": {
      target: "https://blog.ticscreek.top",
      changeOrigin: true,
      secure: false, // 允许代理到 HTTPS 目标，但忽略证书验证
      cookieDomainRewrite: "dev.ticscreek.top",
      agent: httpProxyAgent,
    },
  },
}
```

这个配置表明：

1. Vite 开发服务器监听 `dev.ticscreek.top` 域名的 `5173` 端口
2. 启用了 HTTPS，使用本地生成的证书
3. 所有以 `/api` 开头的请求将被代理到 `https://blog.ticscreek.top`

## 请求流程详解

### 1. 浏览器到 Vite 开发服务器

```
浏览器 --HTTPS请求--> Vite开发服务器(dev.ticscreek.top:5173)
```

当用户在浏览器中访问应用时，发生以下步骤：

1. 浏览器发起请求到 `https://dev.ticscreek.top:5173`
2. 请求通过 HTTPS 协议传输，使用 Vite 配置的本地证书进行加密
3. Vite 开发服务器接收请求

#### 请求类型区分

- **静态资源请求**：如 HTML、CSS、JavaScript 文件等，由 Vite 直接处理
- **API 请求**：以 `/api` 开头的请求，将触发 Vite 的代理功能
- **HMR (热模块替换) 请求**：由 Vite 内部处理，用于开发时的实时更新

### 2. Vite 代理处理过程

当浏览器发起一个以 `/api` 开头的请求时，Vite 的代理功能被触发：

```
Vite开发服务器 --代理转发--> 后端服务器(https://blog.ticscreek.top)
```

处理流程如下：

1. Vite 识别到请求路径以 `/api` 开头
2. 根据代理配置，Vite 创建一个新的请求到目标服务器 `https://blog.ticscreek.top`
3. 请求头中的 `Host` 被修改为目标服务器的主机名（因为设置了 `changeOrigin: true`）
4. 请求通过配置的 HTTP 代理（`httpProxyAgent`）发送，代理地址为 `http://127.0.0.1:7890`
5. 由于设置了 `secure: false`，Vite 不会验证目标服务器的 HTTPS 证书

### 3. 后端服务器处理

```
后端服务器 --处理请求--> 返回响应 --> Vite开发服务器
```

1. 后端服务器 `https://blog.ticscreek.top` 接收并处理请求
2. 生成响应并返回给 Vite 开发服务器

### 4. Vite 响应处理

```
Vite开发服务器 --转发响应--> 浏览器
```

1. Vite 接收到后端服务器的响应
2. 根据 `cookieDomainRewrite: "dev.ticscreek.top"` 配置，将响应中 Cookie 的域名从 `blog.ticscreek.top` 重写为 `dev.ticscreek.top`
3. Vite 将处理后的响应转发给浏览器

## 完整请求流程图

```
┌─────────┐      HTTPS请求      ┌──────────────┐      HTTP代理      ┌──────────────┐
│         │ -----------------> │              │ -----------------> │              │
│ 浏览器   │                    │ Vite开发服务器 │                    │ 后端服务器    │
│         │ <----------------- │              │ <----------------- │              │
└─────────┘      响应返回       └──────────────┘      响应返回       └──────────────┘
                                      │
                                      │ 使用http-proxy-middleware
                                      │ 处理请求和响应
                                      ▼
                              ┌──────────────────┐
                              │ 代理配置          │
                              │ - 路径重写        │
                              │ - 请求头修改      │
                              │ - Cookie域名重写  │
                              └──────────────────┘
```

## 关键配置参数解析

### 1. `target`

```typescript
target: "https://blog.ticscreek.top"
```

指定代理的目标服务器地址，所有匹配的请求将被转发到这个地址。

### 2. `changeOrigin`

```typescript
changeOrigin: true
```

当设置为 `true` 时，代理会自动修改请求头中的 `Host` 字段为目标服务器的主机名。这对于某些验证请求来源的后端服务非常重要。

### 3. `secure`

```typescript
secure: false
```

当设置为 `false` 时，代理在连接到使用 HTTPS 的目标服务器时不会验证 SSL 证书。这在开发环境中很有用，特别是当目标服务器使用自签名证书时。

### 4. `cookieDomainRewrite`

```typescript
cookieDomainRewrite: "dev.ticscreek.top"
```

重写响应中 `Set-Cookie` 头的域名。在这个配置中，后端服务器返回的 Cookie 中如果设置了域名为 `blog.ticscreek.top`，会被重写为 `dev.ticscreek.top`，确保浏览器能正确存储和发送 Cookie。

### 5. `agent`

```typescript
agent: httpProxyAgent
```

使用指定的代理代理 HTTP 请求。在这个配置中，使用了 `HttpsProxyAgent` 创建的代理，指向 `http://127.0.0.1:7890`。这通常用于在某些网络环境下（如公司内网或特定国家/地区）访问外部资源。

## 常见问题与解决方案

### 1. 跨域问题

**问题**：即使配置了代理，仍然遇到跨域错误。

**解决方案**：
- 确保所有 API 请求都以 `/api` 开头
- 检查后端服务器是否设置了额外的 CORS 限制
- 验证 `changeOrigin` 设置为 `true`

### 2. Cookie 问题

**问题**：登录状态无法保持，Cookie 似乎没有正确传递。

**解决方案**：
- 确保 `cookieDomainRewrite` 配置正确
- 检查后端服务器设置的 Cookie 是否包含 `SameSite` 和 `Secure` 属性
- 验证浏览器是否接受第三方 Cookie

### 3. HTTPS 证书问题

**问题**：浏览器显示证书错误或拒绝连接。

**解决方案**：
- 使用 `mkcert` 等工具生成并安装本地受信任的证书
- 确保证书文件路径在 Vite 配置中正确设置
- 在开发环境中，可以考虑在浏览器中手动信任自签名证书

### 4. 代理性能问题

**问题**：通过代理的请求响应速度慢。

**解决方案**：
- 检查 HTTP 代理 (`http://127.0.0.1:7890`) 的性能和稳定性
- 考虑在不需要时移除 `agent` 配置
- 对于频繁请求的 API，考虑实现前端缓存策略

## 最佳实践

1. **路径规范**：确保所有需要代理的 API 请求都遵循一致的路径前缀（如 `/api`）

2. **环境分离**：为不同环境（开发、测试、生产）创建不同的代理配置

   ```typescript
   // 根据环境变量选择不同的代理目标
   proxy: {
     "/api": {
       target: process.env.NODE_ENV === 'development' 
         ? "https://dev-api.example.com" 
         : "https://api.example.com",
       // 其他配置...
     }
   }
   ```

3. **请求路径重写**：使用 `rewrite` 功能可以在转发前修改请求路径

   ```typescript
   proxy: {
     "/api": {
       target: "https://api.example.com",
       rewrite: (path) => path.replace(/^\/api/, ''),
       // 其他配置...
     }
   }
   ```

4. **调试代理问题**：启用日志记录以便调试

   ```typescript
   proxy: {
     "/api": {
       // 其他配置...
       configure: (proxy, options) => {
         proxy.on('error', (err, req, res) => {
           console.log('代理错误:', err);
         });
         proxy.on('proxyReq', (proxyReq, req, res) => {
           console.log('发送代理请求:', req.url);
         });
         proxy.on('proxyRes', (proxyRes, req, res) => {
           console.log('收到代理响应:', proxyRes.statusCode);
         });
       }
     }
   }
   ```

## 总结

Vite 的代理功能为前端开发提供了强大的能力，使开发者能够在本地开发环境中无缝连接到远程 API。通过正确配置代理，可以解决跨域问题、简化开发流程，并提供更接近生产环境的开发体验。

本文档详细解释了 Vite、浏览器和后端服务器之间的请求流程，以及如何配置和优化这一过程。通过理解这些概念，开发者可以更有效地解决开发过程中遇到的网络相关问题。