<script setup lang="ts">
import { computed } from 'vue'
import { useCodeCopy } from '../composables/use-code-copy'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { proseTheme } from '../theme/prose'
import { resolveFileIcon } from '../utils/file-icons'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ProsePreProps>(), {
  showHeader: true,
})

export interface ProsePreProps {
  code?: string
  language?: string
  filename?: string
  /** Overrides the file-type icon resolved from `filename`/`language`. */
  icon?: string
  /** Renders the metadata and copy row above the code. @default true */
  showHeader?: boolean
  highlights?: number[]
  meta?: string
}

const icons = useIcons()
const messages = useMessages()
const fileIcon = computed(() => props.icon ?? resolveFileIcon(props.language, props.filename))
const theme = useComponentTheme('prose', proseTheme)
const ui = computed(() => theme.value())

// The fallthrough-class target is the <pre> itself, not the wrapper div -
// @nuxtjs/mdc's code-block AST node passes a `class` attr (e.g. "shiki
// shiki-themes github-light github-dark") that Shiki's own injected CSS
// selectors (`pre.shiki code ...`) require landing on <pre> directly to
// actually apply syntax-highlighting colors, not just on an ancestor.
const preProps = useRootProps(() => ui.value.pre, () => undefined)

const { status, copy } = useCodeCopy()
const copyLabel = computed(() => status.value === 'idle'
  ? messages.value.copyCode
  : status.value === 'copied' ? messages.value.codeCopied : messages.value.codeCopyFailed)
</script>

<template>
  <div v-bind="resolveSlot(ui.preWrapper, undefined)">
    <div v-if="showHeader && (filename || language || code)" v-bind="resolveSlot(ui.preHeader, undefined)">
      <span v-bind="resolveSlot(ui.preLabel, undefined)">
        <Icon v-if="fileIcon" :name="fileIcon" v-bind="resolveSlot(ui.preIcon, undefined)" />
        <span v-if="filename" :title="filename" v-bind="resolveSlot(ui.preFilename, undefined)">{{ filename }}</span>
        <span v-else-if="language" v-bind="resolveSlot(ui.preLanguage, undefined)">{{ language }}</span>
      </span>
      <Button
        v-if="code"
        v-bind="resolveSlot(ui.preCopyButton, undefined)"
        size="sm"
        square
        variant="ghost"
        :color="status === 'copied' ? 'success' : status === 'failed' ? 'danger' : 'neutral'"
        :icon="status === 'copied' ? icons.check : status === 'failed' ? icons.danger : icons.copy"
        :aria-label="copyLabel"
        :title="copyLabel"
        @click="copy(code)"
      />
    </div>
    <pre v-bind="preProps"><slot /></pre>
  </div>
</template>
