export interface CodeRef {
  file: string
  start: number
  end: number
  selection: string
}

export const DEFAULT_FORMAT = '{prefix}{file} {start}-{end}'
export const DEFAULT_PREFIX = '@'

const PLACEHOLDER = /\{(prefix|file|start|end|selection)\}/g

/** Turns 0-based VS Code selection bounds into an inclusive 1-based line range. */
export function lineRange(startLine: number, endLine: number, endCharacter: number) {
  return {
    start: startLine + 1,
    // Ending at column 0 of a later line means that line is not part of the selection.
    end: endCharacter === 0 && endLine > startLine ? endLine : endLine + 1,
  }
}

export function formatReference(
  ref: CodeRef,
  format: string = DEFAULT_FORMAT,
  prefix: string = DEFAULT_PREFIX,
): string {
  const values: Record<string, string> = {
    prefix,
    file: ref.file,
    start: String(ref.start),
    end: String(ref.end),
    selection: ref.selection,
  }
  // A replacer function, so `$&` and friends inside the selection stay literal.
  return format.replace(PLACEHOLDER, (_, key: string) => values[key])
}
