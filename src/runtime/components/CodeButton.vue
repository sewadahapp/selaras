<script setup lang="ts">
import type { CodeButtonThemeSlots } from '../theme/code-button'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useCodeCopy } from '../composables/use-code-copy'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { codeButtonTheme } from '../theme/code-button'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<CodeButtonProps>()

defineSlots<CodeButtonSlots>()

export interface CodeButtonProps {
  /** Both the displayed text (unless the default slot overrides it) and what actually gets copied. */
  code: string
  ui?: UiProp<CodeButtonThemeSlots>
}

export interface CodeButtonSlots {
  /** Overrides the displayed text - `code` still governs what's copied. */
  default?: () => any
}

const icons = useIcons()

const messages = useMessages()
const { status, copy } = useCodeCopy()
const feedback = computed(() => status.value === 'idle'
  ? undefined
  : status.value === 'copied' ? messages.value.codeCopied : messages.value.codeCopyFailed)

const theme = useComponentTheme('codeButton', codeButtonTheme)
const ui = computed(() => theme.value({ failed: status.value === 'failed' }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
</script>

<template>
  <button
    type="button"
    v-bind="rootProps"
    :aria-label="feedback ?? rootProps['aria-label']"
    :title="feedback ?? rootProps.title"
    @click="copy(code)"
  >
    <slot>{{ code }}</slot>
    <Icon :name="status === 'copied' ? icons.check : status === 'failed' ? icons.danger : icons.copy" v-bind="iconProps" />
  </button>
</template>
