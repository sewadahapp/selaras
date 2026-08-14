import type { ComputedRef } from 'vue'
import { tv } from 'tailwind-variants'
import { computed, mergeProps } from 'vue'
import { useAppConfig } from '#imports'

export type UiSlotValue = string | ({ class?: string } & Record<string, unknown>)
export type UiProp<Slots extends string = string> = Partial<Record<Slots, UiSlotValue>>

type SlotFn = (opts?: { class?: unknown }) => string

/**
 * Resolves a single slot's classes/attrs from a `:ui` override.
 * A string override is treated as extra classes (tailwind-merge'd by the slot fn).
 * An object override's `class` is merged the same way, everything else is
 * applied as raw attrs/handlers via `mergeProps` (never tailwind-merged).
 */
export function resolveSlot(slotFn: SlotFn, override?: UiSlotValue) {
  if (typeof override !== 'object' || override === null) {
    return { class: slotFn({ class: override }) }
  }
  const { class: overrideClass, ...attrs } = override
  return mergeProps({ class: slotFn({ class: overrideClass }) }, attrs)
}

/**
 * Merges a component's global `app.config.ui.<key>` override into its base
 * `tv()` theme. Falls back to the base theme untouched when no override exists.
 */
export function useComponentTheme<T extends (...args: any[]) => any>(key: string, base: T): ComputedRef<T> {
  const appConfig = useAppConfig() as { ui?: Record<string, object> }

  return computed(() => {
    const override = appConfig.ui?.[key]
    return override ? (tv({ extend: base as any, ...override }) as unknown as T) : base
  })
}
