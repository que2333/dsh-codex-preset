/**
 * The bundle root is intentionally inert. Its patch inserts the preset and
 * loads the prompt transformer through the `./runtime` subpath, which avoids
 * resolving this bundle package again as a child plugin.
 */
export function apply() {}
