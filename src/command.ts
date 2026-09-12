import type { CodeRef } from './format'
import { env, window, workspace } from 'vscode'
import { config } from './config'
import { DEFAULT_FORMAT, formatReference, lineRange } from './format'

export async function copyReference() {
  const editor = window.activeTextEditor
  if (!editor) {
    window.showWarningMessage('cc-code-ref: No active editor')
    return
  }

  const { document } = editor
  const file = workspace.asRelativePath(document.uri)
  const refs: CodeRef[] = editor.selections.map((sel) => {
    return {
      file,
      ...lineRange(sel.start.line, sel.end.line, sel.end.character),
      selection: sel.isEmpty ? document.lineAt(sel.start.line).text : document.getText(sel),
    }
  })

  const format = config.get('ccCodeRef.format', DEFAULT_FORMAT)
  const text = refs.map(ref => formatReference(ref, format)).join(' ')

  await env.clipboard.writeText(text)
  window.showInformationMessage(`Copied: ${text}`)
}
