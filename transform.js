const EXTERNAL_SECTION_PATTERNS = [
  /^dsh-purge/,
  /^mcp(?::|-|\/)/,
  /^context:file-reference$/,
  /^ui:deliverable-file-references$/,
]

function isExternalSection(section) {
  const name = String(section?.name ?? '')
  return EXTERNAL_SECTION_PATTERNS.some((pattern) => pattern.test(name))
}

function rewriteTools(tools, descriptions) {
  if (!Array.isArray(tools)) return tools
  return tools.map((tool) => {
    const description = descriptions[tool?.name]
    if (typeof description !== 'string') return tool
    return { ...tool, description }
  })
}

/**
 * Produce a new assembly without mutating the object owned by DSH or another
 * plugin. Contexts and variables are deliberately preserved because they carry
 * workspace, sandbox, approval, and skill facts that the model still needs.
 */
export function transformAssembly(assembly, config) {
  if (assembly === null || typeof assembly !== 'object') return assembly

  const sections = Array.isArray(assembly.sections) ? assembly.sections : []
  const codexSection = {
    name: 'codex:compat',
    text: config.prompt,
    interpolate: false,
  }

  let nextSections
  if (config.replacePrompt === false) {
    nextSections = [...sections, codexSection]
  } else {
    const preserved = config.preserveExternalSections
      ? sections.filter(isExternalSection)
      : []
    nextSections = [codexSection, ...preserved]
  }

  return {
    ...assembly,
    sections: nextSections,
    tools: config.rewriteToolDescriptions === false
      ? assembly.tools
      : rewriteTools(assembly.tools, config.toolDescriptions),
  }
}
