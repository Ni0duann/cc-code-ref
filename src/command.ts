import { env, window } from 'vscode'
import { getSetting } from './config'
import { formatReference } from './format'
import { collectRefs } from './reference'
import { setFormat } from './settings'

const CHANGE_FORMAT = 'Change Format…'

export async function copyReference() {
  const editor = window.activeTextEditor
  if (!editor) {
    window.showWarningMessage('cc-code-ref: No active editor')
    return
  }

  const format = getSetting('ccCodeRef.format')
  const prefix = getSetting('ccCodeRef.prefix')
  const text = collectRefs(editor).map(ref => formatReference(ref, format, prefix)).join(' ')

  await env.clipboard.writeText(text)
  const action = await window.showInformationMessage(`Copied: ${text}`, CHANGE_FORMAT)
  if (action === CHANGE_FORMAT)
    await setFormat()
}
