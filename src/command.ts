import { env, window, workspace } from 'vscode'
import { config } from './config'

export async function copyReference() {
  const editor = window.activeTextEditor
  if (!editor) {
    window.showWarningMessage('cc-code-ref: No active editor')
    return
  }

  const file = workspace.asRelativePath(editor.document.uri)
  const refs = editor.selections.map(sel => ({
    file,
    start: sel.isEmpty ? sel.active.line + 1 : sel.start.line + 1,
    end: sel.isEmpty ? sel.active.line + 1 : sel.end.line + 1,
  }))

  const format = config.get<string>('ccCodeRef.format') ?? '@{file} {start}-{end}'
  const text = refs.map(r =>
    format
      .replace('{file}', r.file)
      .replace('{start}', String(r.start))
      .replace('{end}', String(r.end))
      .replace('{selection}', `${r.start}-${r.end}`),
  ).join(' ')

  await env.clipboard.writeText(text)
  window.showInformationMessage(`Copied: ${text}`)
}
