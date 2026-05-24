import { defineExtension, useCommand } from 'reactive-vscode'
import { copyReference } from './command'

const { activate, deactivate } = defineExtension(() => {
  useCommand('ccCodeRef.copyReference', copyReference)
})

export { activate, deactivate }
