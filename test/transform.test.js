import assert from 'node:assert/strict'
import test from 'node:test'

import { transformAssembly } from '../transform.js'

const PROMPT = 'codex prompt'
const TOOL_DESCRIPTIONS = {
  read: 'codex read description',
}

function assembly() {
  return {
    sections: [
      { name: 'harness:identity', text: 'dsh identity' },
      { name: 'tool:read', text: 'dsh read guidance' },
      { name: 'mcp:fetch', text: 'MCP fetch instructions' },
      { name: 'context:file-reference', text: 'file reference rules' },
    ],
    contexts: [{ name: 'working-directory', text: '/workspace' }],
    tools: [
      { name: 'read', description: 'old read description', parameters: {} },
      { name: 'custom_tool', description: 'keep me', parameters: {} },
    ],
    variables: { cwd: '/workspace' },
  }
}

function config(overrides = {}) {
  return {
    prompt: PROMPT,
    replacePrompt: true,
    rewriteToolDescriptions: true,
    preserveExternalSections: false,
    toolDescriptions: TOOL_DESCRIPTIONS,
    ...overrides,
  }
}

test('replaces core prompt sections and preserves runtime data', () => {
  const input = assembly()
  const output = transformAssembly(input, config())

  assert.deepEqual(output.sections, [
    { name: 'codex:compat', text: PROMPT, interpolate: false },
  ])
  assert.deepEqual(output.contexts, input.contexts)
  assert.deepEqual(output.variables, input.variables)
})

test('can append the Codex section without dropping DSH guidance', () => {
  const input = assembly()
  const output = transformAssembly(input, config({ replacePrompt: false }))

  assert.equal(output.sections.length, input.sections.length + 1)
  assert.deepEqual(output.sections.slice(0, -1), input.sections)
  assert.equal(output.sections.at(-1).name, 'codex:compat')
})

test('can preserve external sections when replacing the core prompt', () => {
  const output = transformAssembly(
    assembly(),
    config({ preserveExternalSections: true }),
  )

  assert.deepEqual(
    output.sections.map((section) => section.name),
    ['codex:compat', 'mcp:fetch', 'context:file-reference'],
  )
})

test('rewrites known tool descriptions and leaves unknown tools intact', () => {
  const output = transformAssembly(assembly(), config())

  assert.equal(output.tools[0].description, 'codex read description')
  assert.equal(output.tools[1].description, 'keep me')
})

test('does not mutate the original assembly', () => {
  const input = assembly()
  const before = structuredClone(input)

  transformAssembly(input, config())

  assert.deepEqual(input, before)
})
