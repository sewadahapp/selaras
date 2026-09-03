<script setup lang="ts">
import type { CodeButtonThemeSlots } from '../theme/code-button'
import type { UiProp } from '../utils/ui'
import { computed, ref } from 'vue'
import { useIcons } from '../composables/use-icons'
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

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

const theme = useComponentTheme('codeButton', codeButtonTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
</script>

<template>
  <button type="button" v-bind="rootProps" @click="copy">
    <slot>{{ code }}</slot>
    <Icon :name="copied ? icons.check : icons.copy" v-bind="iconProps" />
  </button>
</template>
