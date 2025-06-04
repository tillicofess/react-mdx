# 环境配置说明

本项目支持开发环境和生产环境的自动识别，并根据不同环境使用不同的 API 配置策略。

## 环境识别

项目使用 Vite 的内置环境变量进行环境识别：

- `import.meta.env.DEV` - 开发环境
- `import.meta.env.PROD` - 生产环境
- `import.meta.env.MODE` - 当前模式（development/production）

## API 配置策略

### 开发环境 (Development)

- **baseURL**: `/api`
- **策略**: 使用 Vite 代理转发
- **优势**:
  - 避免跨域问题
  - Cookie 自动处理
  - 支持热重载
  - 详细的调试日志

### 生产环境 (Production)

- **baseURL**: `https://ticscreek.top/test`
- **策略**: 直接使用完整域名
- **优势**:
  - 直接访问生产服务器
  - 更长的超时时间
  - 简化的日志输出
  - 更好的性能

## 配置文件结构

```
src/
├── config/
│   └── env.ts          # 环境配置文件
├── lib/
│   └── axios.ts        # HTTP 客户端配置
└── firebase/
    └── auth.ts         # 认证相关 API
```

## 使用方法

### 1. 基本 HTTP 请求

```typescript
import { http } from "@/lib/axios";

// GET 请求
const response = await http.get("/sso/me");

// POST 请求
const result = await http.post("/sso/set-cookie", { token });
```

### 2. 统一响应格式

```typescript
import { api } from "@/lib/axios";

// 返回统一格式的数据
const result = await api.get<UserData>("/sso/me");
if (result.code === 200) {
  console.log(result.data);
}
```

### 3. 环境判断

```typescript
import { isDevelopment, isProduction } from "@/config/env";

if (isDevelopment) {
  console.log("开发环境特有逻辑");
}

if (isProduction) {
  console.log("生产环境特有逻辑");
}
```

## 代理配置 (仅开发环境)

在 `vite.config.ts` 中配置的代理规则：

```typescript
proxy: {
  "/api": {
    target: "https://ticscreek.top",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^/api/, "/test"),
    cookieDomainRewrite: "localhost",
  },
}
```

## 环境变量

项目支持以下环境变量（在 `.env` 文件中配置）：

```bash
# Firebase 配置
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... 其他 Firebase 配置
```

## 调试信息

### 开发环境

- ✅ 详细的请求/响应日志
- ✅ 环境信息打印
- ✅ 错误详情显示

### 生产环境

- ❌ 最小化日志输出
- ❌ 隐藏调试信息
- ✅ 仅显示关键错误

## 部署注意事项

1. **生产环境部署**：

   - 确保服务器支持 CORS
   - 配置正确的 Cookie 域名
   - 检查 HTTPS 证书

2. **开发环境调试**：
   - 确保代理配置正确
   - 检查网络连接
   - 查看浏览器控制台日志

## 故障排除

### 常见问题

1. **Cookie 无法设置**

   - 检查 `withCredentials` 配置
   - 确认服务器 CORS 设置
   - 验证域名配置

2. **代理请求失败**

   - 检查 `vite.config.ts` 代理配置
   - 确认目标服务器可访问
   - 查看网络代理设置

3. **环境识别错误**
   - 检查构建命令
   - 确认 Vite 环境变量
   - 查看控制台环境信息

### 调试命令

```bash
# 开发环境
npm run dev

# 生产环境构建
npm run build

# 预览生产构建
npm run preview
```
