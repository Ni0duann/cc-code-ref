import type { ConfigKey } from './generated/meta'
import { InputBoxValidationSeverity, window } from 'vscode'
import { config, getSetting, settingTarget } from './config'
import { formatReference } from './format'
import { previewRef } from './reference'

const PLACEHOLDERS = '{prefix} {file} {start} {end} {selection}'

async function promptSetting(
  key: ConfigKey,
  title: string,
  prompt: string,
  preview: (value: string) => string,
) {
  const value = await window.showInputBox({
    title,
    prompt,
    value: getSetting(key),
    validateInput: input => ({
      message: `Preview: ${preview(input)}`,
      severity: InputBoxValidationSeverity.Info,
    }),
  })
  if (value === undefined)
    return
  await config.update(key, value, settingTarget(key))
  window.showInformationMessage(`cc-code-ref: applied — ${preview(value)}`)
}

export async function setFormat() {
  const ref = previewRef()
  const prefix = getSetting('ccCodeRef.prefix')
  await promptSetting(
    'ccCodeRef.format',
    'cc-code-ref: Copy Format',
    `Placeholders: ${PLACEHOLDERS}`,
    value => formatReference(ref, value, prefix),
  )
}

export async function setPrefix() {
  const ref = previewRef()
  const format = getSetting('ccCodeRef.format')
  await promptSetting(
    'ccCodeRef.prefix',
    'cc-code-ref: File Prefix',
    'Replaces {prefix} in the copy format. Leave empty for none.',
    value => formatReference(ref, format, value),
  )
}

export async function resetConfig() {
  await config.update('ccCodeRef.format', undefined, settingTarget('ccCodeRef.format'))
  await config.update('ccCodeRef.prefix', undefined, settingTarget('ccCodeRef.prefix'))
  window.showInformationMessage(`cc-code-ref: reset — ${formatReference(previewRef())}`)
}
