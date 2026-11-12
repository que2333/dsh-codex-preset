# DSH Codex Preset

一个可安装的 DSH 插件。安装后会向 **Agent 预设** 列表新增 `Codex` 预设，不需要手工编辑
`cordis.patch.yml`。

## 设计

插件通过 DSH 官方的 `@deepseek-ai/dsh-agent-preset` 注册一套完整组合：

- 选择编码任务需要的文件、终端、搜索、计划、网页、技能和子代理工具。
- 使用 OpenAI 开源 cookbook 发布的 Codex 推荐起始提示词，并在运行时适配 DSH。
- 保留工作目录、沙箱、审批和 AGENTS.md 等运行时事实。
- 默认保留 MCP 服务说明、文件引用和交付物说明等外部集成段。
- 保留真实工具名称和参数 schema，只改写模型看到的工具描述。
- 不要求模型在每次工具调用前输出一句普通正文进度。

这与直接改写 `dsh-system-prompt` 源码不同，卸载插件或切回其他预设即可恢复。

## 配置

| 配置 | 默认值 | 作用 |
| --- | --- | --- |
| `replacePrompt` | `true` | 替换 DSH 默认行为段；关闭后追加 Codex 段 |
| `rewriteToolDescriptions` | `true` | 用 Codex 风格描述覆盖已知 DSH 工具 |
| `preserveExternalSections` | `true` | 替换时保留 MCP、文件引用和其他外部段 |
| `customInstructions` | 空 | 追加项目或个人补充指令 |

## 工具映射

插件保留 DSH 的真实工具，不会把不存在的 Codex 工具硬塞给模型。提示词和描述会映射到：

`read`、`write`、`edit`、`read_image`、`glob`、`grep`、`bash`、`pwsh`、
`todo_write`、`skill`、`ask_user_question`、`web_search`、`web_fetch`、
`terminal_*`、`job_*`、`present`、Goal、定时任务，以及可用的子代理工具。

## 提示词来源

提示词原文来自 OpenAI 开源仓库 `openai/openai-cookbook`，固定到 commit
`7379810d01589f91b367c17fb0619db02bf39345` 中的
`examples/gpt-5/codex_prompting_guide.ipynb` 的
`## Recommended Starter Prompt` 段，对应 OpenAI 官方
[Codex Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)。

- 原文文件：`prompts/codex-recommended-starter.md`
- 原文 SHA-256：`51d935038aeab4668f79bf4a01edbf4e5b1b94c2a6b76537c8d96c4dafe1beed`
- 来源元数据：`prompts/SOURCE.json`
- 适配规则：`prompt.js` 中逐条列出的固定替换
- 参考实现：`openai/codex` 的 `codex-rs/core/gpt-5.2-codex_prompt.md`

替换仅涉及 DeepSeek Harness 身份、DSH 实际工具名和并行调用方式，不包含未公开的
Codex 内部提示词，也没有把模型自行编造的提示词冒充为 Codex 原文。

## 安装

发布到 GitHub 后，可直接用仓库地址安装：

```text
https://github.com/que2333/dsh-codex-preset
```

安装并重启 DSH 后，在 `设置 -> Agent 预设` 中会出现 `Codex`。新建会话时选择它，
或者把新建任务默认预设改为 `Codex`。

本地开发时可使用 DSH 的本地插件安装入口指向本目录。

## 注意

- 提示词原文逐字保存；实际发送文本只经过上述固定替换。底层模型、工具实现、结果格式和运行环境仍由 DSH 决定，因此效果不等同于 OpenAI 托管模型。
- `Codex` 预设会替换自己的系统提示词段。全局提示词注入插件仍可能在预设外层再次修改提示词。
- 预设不会修改 DSH 安装文件，也不会创建不存在的 Codex 工具。
- 提示词与第三方许可见 `NOTICE`、`prompts/SOURCE.json` 和 `LICENSES/`。

## 开发

```powershell
node --check index.js
node --check runtime.js
node --check transform.js
node --test test/*.test.js
```
