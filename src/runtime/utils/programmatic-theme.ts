import type { ThemeConfiguration, ThemeDefaults, ThemeUiOverrides } from '../theme-config'
import type { RuntimeTokenOverrides } from './color-registry'
import type { ThemeContext } from './injection-keys'
import { hasInjectionContext, inject, toRaw } from 'vue'
import { useAppConfig } from '#imports'
import { THEME_INJECTION_KEY } from './injection-keys'

export interface ProgrammaticThemeLayer {
  ui?: ThemeUiOverrides
  defaults?: ThemeDefaults
}

/** @internal */
export interface ProgrammaticThemeSnapshot {
  layers: ProgrammaticThemeLayer[]
  tokens?: RuntimeTokenOverrides
  mode: 'root' | 'light' | 'dark'
}

function cloneSnapshotValue<T>(value: T, seen = new WeakMap<object, unknown>()): T {
  if (value === null || typeof value !== 'object')
    return value

  const raw = toRaw(value as object)
  const existing = seen.get(raw)
  if (existing)
    return existing as T

  if (Array.isArray(raw)) {
    const result: unknown[] = []
    seen.set(raw, result)
    for (const item of raw)
      result.push(cloneSnapshotValue(item, seen))
    return result as T
  }

  const prototype = Object.getPrototypeOf(raw)
  if (prototype !== Object.prototype && prototype !== null)
    return raw as T

  const result: Record<PropertyKey, unknown> = {}
  seen.set(raw, result)
  for (const key of Reflect.ownKeys(raw))
    result[key] = cloneSnapshotValue((raw as Record<PropertyKey, unknown>)[key], seen)
  return result as T
}

function contextChain(context: ThemeContext | undefined): ThemeContext[] {
  const chain: ThemeContext[] = []
  for (let current = context; current; current = current.parent)
    chain.unshift(current)
  return chain
}

/**
 * Captures injection access during setup, then snapshots its current effective
 * presentation when an imperative operation is actually queued.
 */
export function useProgrammaticThemeSnapshot() {
  const appConfig = useAppConfig() as { selaras?: ThemeConfiguration }
  const injected = hasInjectionContext() ? inject(THEME_INJECTION_KEY, undefined) : undefined

  return function snapshotProgrammaticTheme(): ProgrammaticThemeSnapshot {
    const current = injected?.value
    const layers: ProgrammaticThemeLayer[] = []
    if (!current?.replaceGlobal && (appConfig.selaras?.ui || appConfig.selaras?.defaults)) {
      layers.push(cloneSnapshotValue({
        ui: appConfig.selaras.ui,
        defaults: appConfig.selaras.defaults,
      }))
    }
    for (const context of contextChain(current)) {
      if (context.ui || context.defaults) {
        layers.push(cloneSnapshotValue({
          ui: context.ui,
          defaults: context.defaults,
        }))
      }
    }

    return {
      layers,
      tokens: cloneSnapshotValue(current?.tokens ?? appConfig.selaras?.tokens),
      mode: current?.mode ?? 'root',
    }
  }
}
