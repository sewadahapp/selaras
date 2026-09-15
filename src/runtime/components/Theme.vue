<script setup lang="ts">
import type { Component } from 'vue'
import type { ThemeDefaults, ThemeUiOverrides } from '../theme-config'
import type { RuntimeTokenOverrides } from '../utils/color-registry'
import { computed, inject, provide, useId, watchEffect } from 'vue'
import { useAppConfig, useHead } from '#imports'
import { generateRuntimeTokenOverrideCss, mergeRuntimeTokenOverrides } from '../utils/color-registry'
import { THEME_INJECTION_KEY } from '../utils/injection-keys'

// Headless by default; `as` gives runtime tokens a DOM boundary.
// Scopes `ui`/`defaults` overrides to
// every descendant, regardless of nesting depth - useComponentTheme and
// useThemeProps (utils/ui.ts) are what actually read this back; this
// component only provides it.
const props = defineProps<ThemeProps>()

export interface ThemeProps {
  /** Component-name-keyed slot-class overrides, same shape as app.config.selaras.ui but scoped to this subtree instead of the whole app - e.g. `{ button: { slots: { base: 'rounded-full' } } }`. */
  ui?: ThemeUiOverrides
  /** Component-name-keyed prop-default overrides - e.g. `{ button: { size: 'lg' } }`. Only respected by components that opt into reading useThemeProps for a given prop (see theming.md's "STheme" section for which ones currently do); an explicit prop on the component itself always wins. */
  defaults?: ThemeDefaults
  /** Runtime role and functional token overrides by mode. Requires a DOM boundary through `as`. */
  tokens?: RuntimeTokenOverrides
  /** Explicit DOM element/component that owns this theme scope. */
  as?: string | Component
  /** Managed semantic mode. Explicit light/dark requires a DOM boundary. */
  mode?: 'inherit' | 'light' | 'dark'
}

// A back-reference, not a merge here - see injection-keys.ts's own
// ThemeContext comment for why the merge happens on the read side
// instead (collectThemeChain in utils/ui.ts), which is what makes
// nesting two STheme components inherit an outer one's unset
// slots/defaults rather than an inner one wholesale replacing it.
const parent = inject(THEME_INJECTION_KEY, undefined)
const appConfig = useAppConfig()
const scopeId = `s${useId()}`
const mode = computed(() => props.mode && props.mode !== 'inherit' ? props.mode : parent?.value.mode ?? 'root')
const inheritedTokens = computed(() => parent?.value.tokens ?? appConfig.selaras?.tokens)
const effectiveTokens = computed(() => props.as
  ? mergeRuntimeTokenOverrides(inheritedTokens.value, props.tokens)
  : inheritedTokens.value)
watchEffect(() => {
  if (!props.as && (props.tokens || (props.mode && props.mode !== 'inherit')))
    throw new Error('STheme tokens and explicit mode require a DOM boundary through the as prop.')
})
provide(THEME_INJECTION_KEY, computed(() => ({
  ui: props.ui,
  defaults: props.defaults,
  scopeId: props.as ? scopeId : parent?.value?.scopeId,
  tokens: effectiveTokens.value,
  mode: mode.value,
  parent: parent?.value,
})))

const scopeSelector = `[data-selaras-theme="${scopeId}"]`
const scopedTokenCss = computed(() => props.as ? generateRuntimeTokenOverrideCss(effectiveTokens.value ?? {}, scopeSelector) : '')
useHead({
  style: [{ key: `selaras-theme-${scopeId}`, textContent: () => scopedTokenCss.value || undefined }],
})
</script>

<template>
  <component :is="as" v-if="as" :data-selaras-theme="scopeId" :data-selaras-mode="mode" :style="mode === 'root' ? undefined : { colorScheme: mode }">
    <slot />
  </component>
  <slot v-else />
</template>
