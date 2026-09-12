import { defineExtension, useCommand } from 'reactive-vscode'
import { copyReference } from './command'
import { resetConfig, setFormat, setPrefix } from './settings'

const { activate, deactivate } = defineExtension(() => {
  useCommand('ccCodeRef.copyReference', copyReference)
  useCommand('ccCodeRef.setFormat', setFormat)
  useCommand('ccCodeRef.setPrefix', setPrefix)
  useCommand('ccCodeRef.resetConfig', resetConfig)
})

export { activate, deactivate }
