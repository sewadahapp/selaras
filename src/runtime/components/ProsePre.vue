<script setup lang="ts">
import { computed, ref } from 'vue'
import { proseTheme } from '../theme/prose'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
}>()

const theme = useComponentTheme('prose', proseTheme)
const ui = computed(() => theme.value())

// The fallthrough-class target is the <pre> itself, not the wrapper div -
// @nuxtjs/mdc's code-block AST node passes a `class` attr (e.g. "shiki
// shiki-themes github-light github-dark") that Shiki's own injected CSS
// selectors (`pre.shiki code ...`) require landing on <pre> directly to
// actually apply syntax-highlighting colors, not just on an ancestor.
const preProps = useRootProps(() => ui.value.pre, () => undefined)

const copied = ref(false)

async function copy() {
  if (!props.code)
    return
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <div v-bind="resolveSlot(ui.preWrapper, undefined)">
    <div v-if="filename || language || code" v-bind="resolveSlot(ui.preHeader, undefined)">
      <span v-if="filename" v-bind="resolveSlot(ui.preFilename, undefined)">{{ filename }}</span>
      <SBadge v-else-if="language" :label="language" size="sm" variant="outline" />
      <span v-else />
      <SButton
        v-if="code"
        v-bind="resolveSlot(ui.preCopyButton, undefined)"
        size="sm"
        variant="ghost"
        color="neutral"
        :icon="copied ? 'lucide:check' : 'lucide:copy'"
        @click="copy"
      />
    </div>
    <pre v-bind="preProps"><slot /></pre>
  </div>
</template>
