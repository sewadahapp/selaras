<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { THEME_INJECTION_KEY } from '../utils/injection-keys'

// Headless - no DOM element of its own, purely a provide/inject scoping
// boundary (see ModalRenderer/ToastProvider-style "no own markup"
// precedent elsewhere in this library). Scopes `ui`/`props` overrides to
// every descendant, regardless of nesting depth - useComponentTheme and
// useThemeProps (utils/ui.ts) are what actually read this back; this
// component only provides it.
const props = defineProps<ThemeProps>()

export interface ThemeProps {
  /** Component-name-keyed slot-class overrides, same shape as app.config.ui but scoped to this subtree instead of the whole app - e.g. `{ button: { slots: { base: 'rounded-full' } } }`. */
  ui?: Partial<Record<string, object>>
  /** Component-name-keyed prop-default overrides - e.g. `{ button: { size: 'lg' } }`. Only respected by components that opt into reading useThemeProps for a given prop (see theming.md's "STheme" section for which ones currently do); an explicit prop on the component itself always wins. */
  props?: Partial<Record<string, Record<string, unknown>>>
}

// A back-reference, not a merge here - see injection-keys.ts's own
// ThemeContext comment for why the merge happens on the read side
// instead (collectThemeChain in utils/ui.ts), which is what makes
// nesting two STheme components inherit an outer one's unset
// slots/props rather than an inner one wholesale replacing it.
const parent = inject(THEME_INJECTION_KEY, undefined)
provide(THEME_INJECTION_KEY, computed(() => ({
  ui: props.ui,
  props: props.props,
  parent: parent?.value,
})))
</script>

<template>
  <slot />
</template>
