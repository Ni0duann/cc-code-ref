import type { TextEditor } from 'vscode'
import type { CodeRef } from './format'
import { window, workspace } from 'vscode'
import { lineRange } from './format'

/** Stand-in for the settings preview when no editor is open. */
const SAMPLE_REF: CodeRef = {
  file: 'src/utils.ts',
  start: 15,
  end: 32,
  selection: 'export function add(a: number, b: number) {',
}

export function collectRefs(editor: TextEditor): CodeRef[] {
  const { document } = editor
  const file = workspace.asRelativePath(document.uri)
  return editor.selections.map((sel) => {
    return {
      file,
      ...lineRange(sel.start.line, sel.end.line, sel.end.character),
      selection: sel.isEmpty ? document.lineAt(sel.start.line).text : document.getText(sel),
    }
  })
}

export function previewRef(): CodeRef {
  const editor = window.activeTextEditor
  return editor ? collectRefs(editor)[0] ?? SAMPLE_REF : SAMPLE_REF
}
