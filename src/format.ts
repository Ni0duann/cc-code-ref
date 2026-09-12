export interface CodeRef {
  file: string
  start: number
  end: number
  selection: string
}

export const DEFAULT_FORMAT = '@{file} {start}-{end}'

const PLACEHOLDER = /\{(file|start|end|selection)\}/g

/** Turns 0-based VS Code selection bounds into an inclusive 1-based line range. */
export function lineRange(startLine: number, endLine: number, endCharacter: number) {
  return {
    start: startLine + 1,
    // Ending at column 0 of a later line means that line is not part of the selection.
    end: endCharacter === 0 && endLine > startLine ? endLine : endLine + 1,
  }
}

export function formatReference(ref: CodeRef, format: string = DEFAULT_FORMAT): string {
  // A replacer function, so `$&` and friends inside the selection stay literal.
  return format.replace(PLACEHOLDER, (placeholder, key: keyof CodeRef) =>
    key === 'start' || key === 'end' ? String(ref[key]) : ref[key])
}
