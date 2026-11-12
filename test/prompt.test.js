import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  CODEX_OPEN_SOURCE_PROMPT,
  CODEX_PROMPT_METADATA,
  CODEX_STYLE_PROMPT,
  DSH_PROMPT_REPLACEMENTS,
  adaptCodexPrompt,
} from '../prompt.js'

test('vendored prompt exactly matches its recorded SHA-256', () => {
  const hash = createHash('sha256')
    .update(CODEX_OPEN_SOURCE_PROMPT)
    .digest('hex')

  assert.equal(hash, CODEX_PROMPT_METADATA.sha256)
})

test('source metadata matches the runtime prompt metadata', () => {
  const source = JSON.parse(
    readFileSync(new URL('../prompts/SOURCE.json', import.meta.url), 'utf8'),
  )

  assert.equal(source.prompt.repository, CODEX_PROMPT_METADATA.repository)
  assert.equal(source.prompt.commit, CODEX_PROMPT_METADATA.commit)
  assert.equal(source.prompt.path, CODEX_PROMPT_METADATA.path)
  assert.equal(source.prompt.section, CODEX_PROMPT_METADATA.section)
  assert.equal(source.prompt.docs, CODEX_PROMPT_METADATA.docs)
  assert.equal(source.prompt.license, CODEX_PROMPT_METADATA.license)
  assert.equal(source.prompt.sha256, CODEX_PROMPT_METADATA.sha256)
})

test('OpenAI source still has the original Codex identity', () => {
  assert.match(
    CODEX_OPEN_SOURCE_PROMPT,
    /^You are Codex, based on GPT-5\. You are running as a coding agent in the Codex CLI/,
  )
})

test('adaptation only changes the documented DSH-facing strings', () => {
  const adapted = adaptCodexPrompt(CODEX_OPEN_SOURCE_PROMPT)

  assert.equal(adapted, CODEX_STYLE_PROMPT)
  assert.equal(DSH_PROMPT_REPLACEMENTS.length, 12)
  assert.match(adapted, /^You are Codex, powered by the model selected in DeepSeek Harness/)
  assert.match(adapted, /Default to solver tools: `git` \(all git\), `rg` \(search\), `read`, `glob`, `edit`, and `todo_write`/)
  assert.match(adapted, /Parallel tool calls/)
  assert.doesNotMatch(adapted, /Codex CLI/)
  assert.doesNotMatch(adapted, /`read_file`|`list_dir`|`glob_file_search`|`todo_write\/update_plan`/)
  assert.doesNotMatch(adapted, /apply_patch/)
  assert.doesNotMatch(adapted, /multi_tool_use\.parallel/)
})
