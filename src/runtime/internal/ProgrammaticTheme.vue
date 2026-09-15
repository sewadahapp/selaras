<script setup lang="ts">
import type { ThemeContext } from '../utils/injection-keys'
import type { ProgrammaticThemeSnapshot } from '../utils/programmatic-theme'
import { computed, provide, useId } from 'vue'
import { useHead } from '#imports'
import { generateRuntimeTokenOverrideCss } from '../utils/color-registry'
import { THEME_INJECTION_KEY } from '../utils/injection-keys'

const props = defineProps<{
  snapshot: ProgrammaticThemeSnapshot
}>()

const scopeId = `p${useId()}`
const context = computed<ThemeContext>(() => {
  let current: ThemeContext | undefined
  for (const layer of props.snapshot.layers) {
    current = {
      ui: layer.ui,
      defaults: layer.defaults,
      parent: current,
    }
  }
  return {
    ui: current?.ui,
    defaults: current?.defaults,
    parent: current?.parent,
    scopeId,
    tokens: props.snapshot.tokens,
    mode: props.snapshot.mode,
    replaceGlobal: true,
  }
})
provide(THEME_INJECTION_KEY, context)

const css = computed(() => generateRuntimeTokenOverrideCss(
  props.snapshot.tokens ?? {},
  `[data-selaras-theme="${scopeId}"]`,
))
useHead({
  style: [{ key: `selaras-programmatic-theme-${scopeId}`, textContent: () => css.value || undefined }],
})
</script>

<template>
  <slot />
</template>
