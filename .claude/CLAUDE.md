# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指引。

## 项目概述

一个基于 TypeScript 和 `reactive-vscode` 框架构建的 VS Code 扩展。遵循 antfu 的项目约定 —— 使用 pnpm 管理依赖、tsdown 打包、Vitest 测试、`@antfu/eslint-config` 进行代码检查。

## 常用命令

| 用途 | 命令 |
|------|------|
| 安装依赖 | `pnpm install`（或通过 @antfu/ni 使用 `nci`） |
| 构建 | `pnpm build` |
| 开发（监听模式） | `pnpm dev` |
| 代码检查 | `pnpm lint` |
| 类型检查 | `pnpm typecheck` |
| 运行测试 | `pnpm test` |
| 运行单个测试文件 | `pnpm test -- test/index.test.ts` |
| 重新生成元数据 | `pnpm update` |
| 打包 .vsix | `pnpm ext:package` |
| 发布 | `pnpm ext:publish` |

CI 流水线会执行 lint、typecheck 和跨平台测试（ubuntu/windows/macos）。测试前需要先执行构建（`pnpm build`），因为 `vscode-ext-gen` 需要先生成元数据才能运行测试。

## 架构

**入口文件**：`src/index.ts` —— 使用 `reactive-vscode` 的 `defineExtension` 导出 `activate`/`deactivate` 生命周期函数。

**源文件**：
- `src/index.ts` —— 扩展生命周期（activate/deactivate）
- `src/config.ts` —— 扩展配置，引用 `src/generated/meta.ts` 中自动生成的元数据
- `src/utils.ts` —— 通过 `defineLogger` 提供的日志工具

**代码生成**：`src/generated/` 已被 gitignore。执行 `pnpm update`（或 `pnpm build`，会作为前置钩子自动触发）会运行 `vscode-ext-gen`，从 `package.json` 的 contributes/configuration 元数据生成 `src/generated/meta.ts`，提供类型安全的配置访问器和扩展显示名称。

**构建**：tsdown 将 `src/index.ts` 打包为 CJS 格式输出到 `dist/`，`vscode` 模块始终外部化。配置位于 `tsdown.config.ts`。

## 关键约定

- `vscode` 模块始终外部化（不会被打包）。
- `@types/vscode` 通过 `taze.config.ts` 排除在依赖更新之外 —— 应保持与 `engines.vscode` 版本一致。
- ESLint 是唯一的格式化工具（Prettier 已在 `.vscode/settings.json` 中禁用）。
- 使用 `@antfu/eslint-config` 扁平配置，无自定义规则覆盖。
- 扩展同时发布到 VS Code Marketplace 和 Open VSX Registry。

## 发布流程

`pnpm release` 运行 `bumpp` 进行交互式版本升级。推送 `v*` 标签会触发 release GitHub Action，使用 `VSCE_PAT` 和 `OVSX_PAT` 密钥打包并发布到两个注册中心。
