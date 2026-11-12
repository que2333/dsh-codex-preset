import assert from 'node:assert/strict'
import test from 'node:test'

import { apply } from '../runtime.js'

function assembly() {
  return {
    sections: [{ name: 'harness:identity', text: 'dsh identity' }],
    tools: [{ name: 'read', description: 'old read description' }],
  }
}

function context() {
  let handler
  return {
    ctx: {
      on(event, registered) {
        assert.equal(event, 'system-prompt/assemble')
        handler = registered
        return () => {
          handler = undefined
        }
      },
    },
    getHandler() {
      assert.equal(typeof handler, 'function')
      return handler
    },
  }
}

test('registers and returns the prompt assembly cleanup', () => {
  const setup = context()
  const dispose = apply(setup.ctx)

  assert.equal(typeof dispose, 'function')
  setup.getHandler()
  dispose()
  assert.throws(() => setup.getHandler())
})

test('transforms the assembly returned by the next handler', async () => {
  const setup = context()
  apply(setup.ctx, { customInstructions: 'Keep answers concise.' })

  const result = await setup.getHandler()(assembly(), {}, async () => assembly())

  assert.equal(result.sections.length, 1)
  assert.equal(result.sections[0].name, 'codex:compat')
  assert.match(result.sections[0].text, /You are Codex/)
  assert.match(result.sections[0].text, /Keep answers concise\./)
  assert.equal(result.tools[0].description.includes('Read a file'), true)
})
