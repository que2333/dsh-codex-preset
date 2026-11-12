import { readFileSync } from 'node:fs'

export const CODEX_PROMPT_METADATA = Object.freeze({
  repository: 'https://github.com/openai/openai-cookbook',
  commit: '7379810d01589f91b367c17fb0619db02bf39345',
  path: 'examples/gpt-5/codex_prompting_guide.ipynb',
  section: '## Recommended Starter Prompt',
  docs: 'https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide',
  license: 'MIT',
  sha256: '51d935038aeab4668f79bf4a01edbf4e5b1b94c2a6b76537c8d96c4dafe1beed',
})

export const CODEX_OPEN_SOURCE_PROMPT = readFileSync(
  new URL('./prompts/codex-recommended-starter.md', import.meta.url),
  'utf8',
)

/**
 * Every change from the recorded OpenAI prompt is explicit here. Keep these
 * replacements limited to harness identity, available tool names, and the
 * parallel-call mechanism; do not use this table for behavioral rewrites.
 */
export const DSH_PROMPT_REPLACEMENTS = Object.freeze([
  [
    "You are Codex, based on GPT-5. You are running as a coding agent in the Codex CLI on a user's computer.",
    "You are Codex, powered by the model selected in DeepSeek Harness. You are running as a coding agent in DeepSeek Harness on the user's computer.",
    true,
  ],
  [
    '- If a tool exists for an action, prefer to use the tool instead of shell commands (e.g `read_file` over `cat`). Strictly avoid raw `cmd`/terminal when a dedicated tool exists. Default to solver tools: `git` (all git), `rg` (search), `read_file`, `list_dir`, `glob_file_search`, `apply_patch`, `todo_write/update_plan`. Use `cmd`/`run_terminal_cmd` only when no listed tool can perform the action.',
    '- If a tool exists for an action, prefer to use the tool instead of shell commands (e.g. `read` over `cat`). Strictly avoid raw shell commands when a dedicated tool exists. Default to solver tools: `git` (all git), `rg` (search), `read`, `glob`, `edit`, and `todo_write`. Use `pwsh` or `bash` only when no listed tool can perform the action.',
    true,
  ],
  [
    '- **multi_tool_use.parallel** Use `multi_tool_use.parallel` to parallelize tool calls and only this.',
    '- **Parallel tool calls.** When the harness supports it, issue independent tool calls in the same assistant step.',
    true,
  ],
  [
    '- Do not try to parallelize using scripting or anything else than `multi_tool_use.parallel`.',
    '- Do not try to parallelize by launching scripts that issue tool calls.',
  ],
  [
    'You are producing plain text that will later be styled by the CLI.',
    'You are producing plain text that will later be styled by DeepSeek Harness.',
    true,
  ],
  ['`read_file`', '`read`'],
  ['`list_dir`', '`glob`'],
  ['`glob_file_search`', '`glob`'],
  ['`apply_patch`', '`edit`'],
  ['`todo_write/update_plan`', '`todo_write`'],
  ['`run_terminal_cmd`', '`pwsh`/`bash`'],
  ['apply_patch', 'edit'],
])

export function adaptCodexPrompt(source) {
  return DSH_PROMPT_REPLACEMENTS.reduce((prompt, [from, to, required]) => {
    if (required === true && !prompt.includes(from)) {
      throw new Error(`Codex prompt adaptation no longer matches source: ${from}`)
    }
    return prompt.replaceAll(from, to)
  }, source)
}

export const CODEX_STYLE_PROMPT = adaptCodexPrompt(CODEX_OPEN_SOURCE_PROMPT)
