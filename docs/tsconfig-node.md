# TypeScript Node 配置文档 (tsconfig.node.json)

本文档详细介绍了项目中 `tsconfig.node.json` 的配置及其作用，适合初学者了解 TypeScript 在 Node.js 环境中的配置。

## 基本概述

`tsconfig.node.json` 是专门为 Node.js 环境配置的 TypeScript 设置文件，主要用于处理项目构建脚本、Vite 配置等运行在 Node.js 环境中的代码。

## 主要配置项解析

### 编译器选项 (compilerOptions)

#### 基础配置

```json
{
  "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
  "target": "ES2022",
  "lib": ["ES2023"],
  "module": "ESNext",
  "skipLibCheck": true
}
```

- **tsBuildInfoFile**: 指定增量编译信息文件的位置，加速后续编译
- **target**: 指定编译后的 JavaScript 版本为 ES2022，比应用配置更新，因为 Node.js 环境通常支持更新的 JavaScript 特性
- **lib**: 仅包含 ES2023 标准库，不包含 DOM 相关 API，因为 Node.js 环境不需要浏览器 API
- **module**: 使用 ESNext 模块系统
- **skipLibCheck**: 跳过对声明文件（.d.ts）的类型检查，提高编译速度

#### 模块解析配置

```json
{
  "moduleResolution": "bundler",
  "allowImportingTsExtensions": true,
  "verbatimModuleSyntax": true,
  "moduleDetection": "force",
  "noEmit": true
}
```

- **moduleResolution**: 使用 "bundler" 模式解析模块，适用于 Vite 等现代打包工具
- **allowImportingTsExtensions**: 允许在导入语句中使用 .ts 扩展名
- **verbatimModuleSyntax**: 保留模块语法的原始形式
- **moduleDetection**: 强制将所有文件视为模块
- **noEmit**: 不生成输出文件，由 Vite 等工具负责转译

#### 类型检查配置

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "erasableSyntaxOnly": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedSideEffectImports": true
}
```

- **strict**: 启用所有严格类型检查选项
- **noUnusedLocals**: 报告未使用的局部变量错误
- **noUnusedParameters**: 报告未使用的函数参数错误
- **erasableSyntaxOnly**: 仅检查可擦除的语法
- **noFallthroughCasesInSwitch**: 防止 switch 语句中的 case 贯穿
- **noUncheckedSideEffectImports**: 检查导入的副作用

### 包含文件

```json
{
  "include": ["vite.config.ts"]
}
```

这里指定了 TypeScript 编译器应该处理的文件：
- **vite.config.ts**: Vite 构建工具的配置文件

## 与其他配置文件的区别

### 与 tsconfig.app.json 的区别

1. **目标环境**: 
   - `tsconfig.node.json`: 针对 Node.js 环境
   - `tsconfig.app.json`: 针对浏览器环境

2. **库支持**:
   - `tsconfig.node.json`: 只包含 ES2023 标准库
   - `tsconfig.app.json`: 包含 DOM 和 DOM.Iterable 等浏览器 API

3. **目标 JavaScript 版本**:
   - `tsconfig.node.json`: ES2022
   - `tsconfig.app.json`: ES2020

4. **包含文件**:
   - `tsconfig.node.json`: 只包含 vite.config.ts
   - `tsconfig.app.json`: 包含 src 和 scripts 目录

## 初学者使用指南

### 何时使用 tsconfig.node.json

当你需要编写或修改以下类型的文件时，应该考虑 `tsconfig.node.json` 的配置：

1. **构建配置**: 如 `vite.config.ts`
2. **构建脚本**: 如自定义的构建或部署脚本
3. **Node.js 工具**: 如自定义的开发工具或脚本

### 常见配置修改

1. **添加更多文件**: 如果有其他 Node.js 脚本，可以扩展 `include` 数组

```json
{
  "include": ["vite.config.ts", "scripts/*.ts"]
}
```

2. **调整 Node.js 版本兼容性**: 如果需要支持特定版本的 Node.js，可以调整 `target` 和 `lib`

```json
{
  "target": "ES2020",
  "lib": ["ES2020"]
}
```

## 常见问题

1. **找不到模块**: 确保 Node.js 类型定义已安装 (`@types/node`)
2. **ESM 与 CommonJS 兼容性**: 如果遇到模块系统兼容性问题，可能需要调整 `module` 设置
3. **类型错误**: Node.js API 的类型可能与实际使用不符，可能需要添加类型断言或安装更新的类型定义

## 最佳实践

1. **保持配置简洁**: 只包含必要的 Node.js 环境文件
2. **与应用配置分离**: 避免在 `tsconfig.node.json` 中包含浏览器应用代码
3. **定期更新**: 随着 Node.js 和 TypeScript 的更新，定期检查和更新配置

通过理解这些配置，你可以更好地管理项目中的 Node.js 相关代码，确保类型安全和开发体验。