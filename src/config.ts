import type * as Meta from './generated/meta'
import { defineConfig } from 'reactive-vscode'
import { ConfigurationTarget } from 'vscode'
import { DEFAULT_FORMAT, DEFAULT_PREFIX } from './format'

export const config = defineConfig<Meta.ConfigKeyTypeMap>(null)

const DEFAULTS: Record<Meta.ConfigKey, string> = {
  'ccCodeRef.format': DEFAULT_FORMAT,
  'ccCodeRef.prefix': DEFAULT_PREFIX,
}

export function getSetting(key: Meta.ConfigKey): string {
  return config.get(key, DEFAULTS[key])
}

/**
 * Writes land in the scope that currently shadows the value, so confirming a
 * prompt is never silently overridden by a workspace-level setting.
 */
export function settingTarget(key: Meta.ConfigKey): ConfigurationTarget {
  return config.inspect(key)?.workspaceValue === undefined
    ? ConfigurationTarget.Global
    : ConfigurationTarget.Workspace
}
