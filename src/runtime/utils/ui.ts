import type { ComputedRef } from 'vue'
import { tv } from 'tailwind-variants'
import { computed, mergeProps, useAttrs } from 'vue'
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
 * Vue always merges a parent's fallthrough `class` onto a single-root
 * component's root element via raw string concatenation - completely
 * separate from (and unaware of) the tailwind-merge resolveSlot does. That
 * means a plain `class="w-40"` on a component whose root slot has `w-full`
 * can silently lose depending on Tailwind's generated CSS order, not source
 * order - defeating the whole point of the :ui system.
 *
 * A component styling its root/base slot via resolveSlot should instead set
 * `inheritAttrs: false`, fold the fallthrough class into that slot's :ui
 * override with `withFallthroughClass` so it goes through tailwind-merge too,
 * and bind `attrsWithoutClass` (not raw $attrs) alongside it so every other
 * fallthrough attr still passes through untouched.
 */
export function useRootFallthrough() {
  const attrs = useAttrs()
  const fallthroughClass = computed(() => typeof attrs.class === 'string' ? attrs.class : undefined)
  const attrsWithoutClass = computed(() => {
    const { class: _class, ...rest } = attrs
    return rest
  })
  return { fallthroughClass, attrsWithoutClass }
}

/** Folds a fallthrough class into a slot's `:ui` override, ahead of resolveSlot. */
export function withFallthroughClass(fallthroughClass: string | undefined, override?: UiSlotValue): UiSlotValue | undefined {
  if (typeof override === 'object' && override !== null) {
    return { ...override, class: [fallthroughClass, override.class].filter(Boolean).join(' ') || undefined }
  }
  return [fallthroughClass, override].filter(Boolean).join(' ') || undefined
}

/**
 * Combines resolveSlot with useRootFallthrough for a component's root/base
 * slot in one call - requires `defineOptions({ inheritAttrs: false })` on the
 * component. Bind the result with a single `v-bind` (Vue's template compiler
 * rejects two bare v-bind spreads on the same element).
 */
export function useRootProps(slotFn: () => SlotFn, override: () => UiSlotValue | undefined) {
  const { fallthroughClass, attrsWithoutClass } = useRootFallthrough()
  return computed(() => mergeProps(
    attrsWithoutClass.value,
    resolveSlot(slotFn(), withFallthroughClass(fallthroughClass.value, override())),
  ))
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
