import z from '@deepseek-ai/schemastery'

import { CODEX_STYLE_PROMPT } from './prompt.js'
import { TOOL_DESCRIPTIONS } from './tool-descriptions.js'
import { transformAssembly } from './transform.js'

export const name = 'codex-compat'
export const inject = ['systemPrompt']

export const Config = z.object({
  replacePrompt: z.boolean().default(true),
  rewriteToolDescriptions: z.boolean().default(true),
  preserveExternalSections: z.boolean().default(true),
  customInstructions: z.string().default(''),
})

const DEFAULTS = {
  replacePrompt: true,
  rewriteToolDescriptions: true,
  preserveExternalSections: true,
  customInstructions: '',
}

function buildPrompt(customInstructions) {
  const extra = String(customInstructions ?? '').trim()
  if (extra.length === 0) return CODEX_STYLE_PROMPT
  return `${CODEX_STYLE_PROMPT}\n\n# User-Configured Additions\n\n${extra}`
}

/**
 * Rewrites the prompt assembly immediately before DSH sends a model request.
 * Real DSH tool schemas and execution stay untouched; this only changes the
 * model-facing instructions and the descriptions attached to those schemas.
 */
export function apply(ctx, config = {}) {
  const resolved = { ...DEFAULTS, ...config }
  const prompt = buildPrompt(resolved.customInstructions)

  return ctx.on('system-prompt/assemble', async (assembly, _context, next) => {
    const current = typeof next === 'function' ? await next() : assembly
    return transformAssembly(current, {
      prompt,
      replacePrompt: resolved.replacePrompt,
      rewriteToolDescriptions: resolved.rewriteToolDescriptions,
      preserveExternalSections: resolved.preserveExternalSections,
      toolDescriptions: TOOL_DESCRIPTIONS,
    })
  })
}
