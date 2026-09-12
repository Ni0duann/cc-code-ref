import type { CodeRef } from '../src/format'
import { describe, expect, it } from 'vitest'
import { DEFAULT_FORMAT, DEFAULT_PREFIX, formatReference, lineRange } from '../src/format'

const ref: CodeRef = {
  file: 'src/utils.ts',
  start: 15,
  end: 32,
  selection: 'export function add(a: number, b: number) {\n  return a + b\n}',
}

describe('formatReference', () => {
  it('renders the default format', () => {
    expect(DEFAULT_FORMAT).toBe('{prefix}{file} {start}-{end}')
    expect(DEFAULT_PREFIX).toBe('@')
    expect(formatReference(ref)).toBe('@src/utils.ts 15-32')
  })

  it('expands {selection} to the selected code', () => {
    expect(formatReference(ref, '// {file}:{start}-{end}\n{selection}'))
      .toBe(`// src/utils.ts:15-32\n${ref.selection}`)
  })

  it('replaces every occurrence of a placeholder', () => {
    expect(formatReference(ref, '{start}-{end} (from line {start})')).toBe('15-32 (from line 15)')
  })

  it('keeps `$` patterns in the selection literal', () => {
    const selection = '$& $1 $\' $$'
    expect(formatReference({ ...ref, selection }, '{selection}')).toBe(selection)
  })

  it('returns a format without placeholders untouched', () => {
    expect(formatReference(ref, 'nothing to expand')).toBe('nothing to expand')
  })

  it('leaves unknown placeholders alone', () => {
    expect(formatReference(ref, '{file} {symbol}')).toBe('src/utils.ts {symbol}')
  })

  it('supports an empty selection', () => {
    expect(formatReference({ ...ref, selection: '' }, '{file}:{start}-{end} {selection}'))
      .toBe('src/utils.ts:15-32 ')
  })
})

describe('{prefix}', () => {
  it('substitutes a custom prefix', () => {
    expect(formatReference(ref, DEFAULT_FORMAT, '#')).toBe('#src/utils.ts 15-32')
    expect(formatReference(ref, '{prefix}{file}:{start}', '> ')).toBe('> src/utils.ts:15')
  })

  it('drops the symbol when the prefix is empty', () => {
    expect(formatReference(ref, DEFAULT_FORMAT, '')).toBe('src/utils.ts 15-32')
  })

  it('replaces every occurrence of {prefix}', () => {
    expect(formatReference(ref, '{prefix}{file}{prefix}', '@')).toBe('@src/utils.ts@')
  })

  it('is ignored by formats that do not use it', () => {
    expect(formatReference(ref, '@{file} {start}-{end}', '#')).toBe('@src/utils.ts 15-32')
  })
})

describe('lineRange', () => {
  it('converts 0-based bounds into an inclusive 1-based range', () => {
    expect(lineRange(14, 31, 12)).toEqual({ start: 15, end: 32 })
  })

  it('collapses a cursor into a single line', () => {
    expect(lineRange(14, 14, 0)).toEqual({ start: 15, end: 15 })
    expect(lineRange(14, 14, 8)).toEqual({ start: 15, end: 15 })
  })

  it('excludes a following line the selection only touches at column 0', () => {
    expect(lineRange(14, 32, 0)).toEqual({ start: 15, end: 32 })
  })

  it('includes a following line the selection extends into', () => {
    expect(lineRange(14, 32, 1)).toEqual({ start: 15, end: 33 })
  })
})
