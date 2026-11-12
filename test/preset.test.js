import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const preset = readFileSync(
  new URL('../cordis.patch.yml', import.meta.url),
  'utf8',
)

test('does not mount the incompatible list_agents subpath plugin', () => {
  assert.doesNotMatch(
    preset,
    /@deepseek-ai\/dsh-tool-subagent-control\/list-agents/,
  )
})

test('keeps the compatible subagent control and delegation tools', () => {
  assert.match(preset, /id: tool-subagent-control/)
  assert.match(preset, /id: tool-subagent\b/)
  assert.match(preset, /id: tool-subagent-fork/)
  assert.match(preset, /id: tool-workflow/)
})
