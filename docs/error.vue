<script setup lang="ts">
import type { NuxtError } from '#app'
import { degungThemeUi } from './utils/degung-theme-ui'

defineProps<{ error: NuxtError }>()
const preset = useDocsThemePreset()
const activeUi = computed(() => preset.value === 'degung' ? degungThemeUi : undefined)
</script>

<template>
  <SApp>
    <STheme :ui="activeUi">
      <DocsErrorPage :error="error" />
    </STheme>
  </SApp>
</template>
