# cc-code-ref

<a href="https://marketplace.visualstudio.com/items?itemName=ni0duann.cc-code-ref" target="__blank"><img src="https://badgen.net/vs-marketplace/v/ni0duann.cc-code-ref?color=333&label=VS%20Code%20Marketplace" alt="Visual Studio Marketplace Version" /></a>
<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23007ACC?style=flat&labelColor=%23229863"  alt="Made with reactive-vscode" /></a>

> Copy code references to Claude Code — use file locations instead of code content to save conversation context.

Select code in VS Code, press `Alt+C`, and a reference like `@src/index.ts 10-20` is copied to your clipboard. Paste it into a Claude Code conversation — CC will read the file automatically, keeping your context clean and token-efficient.

### Usage

1. Select code in the editor (multi-cursor supported)
2. Press `Alt+C` / `Option+C` on Mac (or right-click → **Copy Code Reference for Claude Code**)
3. Paste into Claude Code

Output example: `@src/utils.ts 15-32`

### Why use references instead of pasting code?

When working with Claude Code in the terminal, if you want CC to look at a specific piece of code, you either paste the code directly (which eats into your context) or manually type out the file path and line numbers — both are tedious and wasteful.

This extension bridges the gap: select code in your editor, press `Alt+C`, and you get a precise reference ready to paste into the CC terminal. No manual typing, no context bloat.

The `@file start-end` format lets CC read files on demand — **only the file path uses tokens, not the code itself**. Your conversations stay compact and CC can handle more.

> Based on the author's research into Claude Code's sourcemap mechanism: when you use `@file start-end`, CC does not read the entire file — it resolves the exact line range on demand, which is significantly more token-efficient than pasting raw code.

### Custom Format

| Setting | Description | Default |
|---|---|---|
| `ccCodeRef.format` | Output format. Placeholders: `{prefix}` `{file}` `{start}` `{end}` `{selection}` | `{prefix}{file} {start}-{end}` |
| `ccCodeRef.prefix` | Value substituted for `{prefix}`. Leave empty for none. | `@` |

Changes apply immediately — no restart, no window reload.

- **Command palette**: `cc-code-ref: Set Copy Format…` and `cc-code-ref: Set File Prefix…` open an input box with a live preview of the rendered reference; press `Enter`/OK to apply. `cc-code-ref: Reset Format to Default` restores both.
- **Settings UI**: search `ccCodeRef`.

The notification shown after each copy also carries a **Change Format…** button.

With no selection (cursor only), `{start}`/`{end}` point at the current line and `{selection}` expands to that line's text.

---

## 中文

> 一键复制代码引用到 Claude Code，用文件位置代替代码内容，节省对话上下文。

在 VS Code 中选中代码，按下 `Alt+C`，即可将引用格式（如 `@src/index.ts 10-20`）复制到剪贴板，粘贴到 Claude Code 对话框中。CC 会自动读取对应文件和行号，无需将代码内容塞进对话，大幅节省 token。

### 使用方式

1. 在编辑器中选中一段代码（多光标也支持）
2. 按 `Alt+C`（Mac 上为 `Option+C`，或右键菜单 → **Copy Code Reference for Claude Code**）
3. 粘贴到 Claude Code 对话框即可

输出示例：`@src/utils.ts 15-32`

### 为什么用引用而不是直接粘贴代码？

在 CC 终端中写代码时，想让 CC 参考某段代码，要么直接粘贴代码内容（挤占上下文），要么手动敲出文件路径和行号（又慢又容易出错）。

这个扩展解决了这个问题：在编辑器里选中代码，按 `Alt+C`，立刻得到一段精准的引用格式，直接粘贴到 CC 终端即可。不用手打路径，也不会撑爆上下文。

而 `@file start-end` 格式让 CC 按需读取文件，**只占用文件路径的 token，不占用代码内容的 token**。对话更紧凑，CC 能处理更多内容。

> 基于作者对 Claude Code sourcemap 机制的研究：使用 `@file start-end` 格式时，CC 不会全量读取文件，而是按需解析指定行范围，比直接粘贴代码更节省 token。

### 自定义格式

| 配置项 | 说明 | 默认值 |
|---|---|---|
| `ccCodeRef.format` | 输出格式，占位符：`{prefix}` `{file}` `{start}` `{end}` `{selection}` | `{prefix}{file} {start}-{end}` |
| `ccCodeRef.prefix` | `{prefix}` 的内容，留空则不加前缀 | `@` |

改完立即生效，不需要重启 VS Code，也不需要重载窗口。

- **命令面板**：`cc-code-ref: Set Copy Format…` / `cc-code-ref: Set File Prefix…` 会弹出输入框，边输入边显示实时预览，按回车（确定）即写入并生效；`cc-code-ref: Reset Format to Default` 一键恢复默认。
- **设置界面**：搜索 `ccCodeRef` 修改。

每次复制后的通知里也带了一个 **Change Format…** 按钮，点它可以直接改格式。

没有选区（只有光标）时，`{start}`/`{end}` 指向当前行，`{selection}` 取当前行的内容。

## License

[MIT](./LICENSE.md) License © 2026 [Ni0daunn](https://github.com/Ni0duann)
