# React MDX Runtime Compiler

🚀 一个基于 React + TypeScript + Vite 的 MDX 运行时编译和渲染项目

## 🎉 灵感来源
本项目灵感来自 ncdai/chanhdai.com，将mdx改为SPA的运行时渲染。

## ✨ 功能特性

- 🔥 **运行时 MDX 编译** - 动态编译和渲染 MDX 内容
- 📝 **Frontmatter 支持** - 解析和显示 MDX 文件的元数据
- 🎨 **自定义组件样式** - 为 MDX 元素提供美观的样式
- 🌈 **代码语法高亮** - 使用 rehype-pretty-code 实现代码高亮
- 📱 **响应式设计** - 适配不同屏幕尺寸
- 🔄 **文件切换** - 支持在多个 MDX 文件之间切换
- ⚡ **热更新** - Vite 提供的快速开发体验

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **MDX 处理**: @mdx-js/mdx + @mdx-js/react
- **代码高亮**: rehype-pretty-code
- **样式方案**: Tailwind CSS + 内联样式
- **UI 组件**: Radix UI + Lucide React

## 📁 项目结构

```
src/
├── components/           # React 组件
│   ├── MDXRenderer.tsx      # MDX 内容渲染器
│   ├── MDXFileSelector.tsx  # MDX 文件选择器
│   ├── MdxComponents.tsx    # MDX 自定义组件
│   └── ui/                  # UI 基础组件
├── utils/               # 工具函数
│   └── mdxLoader.ts        # MDX 文件加载器
├── mdx/                 # MDX 内容文件
│   └── content/
│       ├── welcome.mdx     # 欢迎页面
│       └── example.mdx     # 示例页面
├── lib/                 # 库文件
│   └── utils.ts            # 通用工具函数
└── App.tsx              # 主应用组件
```

## 🔧 核心组件功能

### Components

#### `MDXRenderer.tsx`
- **功能**: MDX 内容的运行时编译和渲染
- **特性**: 
  - 使用 `@mdx-js/mdx` 的 `evaluate` 方法编译 MDX
  - 集成 `rehype-pretty-code` 实现代码高亮
  - 提供加载状态和错误处理
  - 支持自定义组件映射

#### `MDXFileSelector.tsx`
- **功能**: 提供 MDX 文件选择界面
- **特性**:
  - 支持多文件切换
  - 美观的按钮样式
  - 当前选中状态指示

#### `MdxComponents.tsx`
- **功能**: 定义 MDX 元素的自定义样式
- **包含组件**:
  - 标题组件 (h1, h2, h3) - 带有颜色和间距
  - 段落组件 (p) - 优化行高和间距
  - 链接组件 (a) - 自动添加外链属性
  - 代码组件 (code, figure) - 集成语法高亮

### Utils

#### `mdxLoader.ts`
- **功能**: MDX 文件加载和 Frontmatter 解析
- **主要方法**:
  - `loadMDXFile()` - 使用 Vite 动态导入加载 MDX 文件
  - `parseFrontmatter()` - 解析 YAML frontmatter 元数据
- **特性**:
  - 支持多文件路径映射
  - 错误处理和验证
  - 返回分离的元数据和内容

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📝 使用说明

1. **添加新的 MDX 文件**:
   - 在 `src/mdx/content/` 目录下创建新的 `.mdx` 文件
   - 在 `MDXFileSelector.tsx` 中添加文件路径
   - 在 `mdxLoader.ts` 中添加对应的导入逻辑

2. **自定义样式**:
   - 修改 `MdxComponents.tsx` 中的组件样式
   - 添加新的自定义组件映射

3. **配置代码高亮**:
   - 在 `MDXRenderer.tsx` 中修改 `rehype-pretty-code` 配置
   - 更换主题或添加新的语言支持

## 📄 MDX 文件格式

MDX 文件支持 YAML frontmatter 和标准 Markdown 语法：

```mdx
---
title: 文章标题
description: 文章描述
author: 作者
createdAt: 2024-01-15
tags: [React, MDX]
---

# 标题

这是一个段落。

```tsx
// 代码块示例
function Hello() {
  return <div>Hello World!</div>
}
```
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
