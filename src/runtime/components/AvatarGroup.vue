<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { AvatarGroupSlots } from '../theme/avatar-group'
import type { UiProp } from '../utils/ui'
import { computed, provide, useSlots } from 'vue'
import { avatarGroupTheme } from '../theme/avatar-group'
import { AVATAR_SIZE_INJECTION_KEY } from '../utils/injection-keys'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type AvatarGroupVariants = VariantProps<typeof avatarGroupTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  /** Maximum number of avatars to show. Extra avatars collapse into a "+N" count indicator. */
  max?: number
  size?: AvatarGroupVariants['size']
  ui?: UiProp<AvatarGroupSlots>
}>()

const slots = useSlots()
const theme = useComponentTheme('avatarGroup', avatarGroupTheme)

const ui = computed(() => theme.value({
  size: props.size,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)

// Propagate size to child SAvatar components via provide/inject, so
// consumers don't have to repeat `size` on every avatar. Individual
// avatars that set their own `size` prop still take precedence (the
// inject is only a fallback).
provide(AVATAR_SIZE_INJECTION_KEY, computed(() => props.size))

const slotChildren = computed(() => slots.default?.() ?? [])

const visibleChildren = computed(() => {
  if (!props.max || slotChildren.value.length <= props.max)
    return slotChildren.value
  return slotChildren.value.slice(0, props.max)
})

const overflowCount = computed(() => {
  if (!props.max || slotChildren.value.length <= props.max)
    return 0
  return slotChildren.value.length - props.max
})
</script>

<template>
  <div v-bind="rootProps">
    <span v-if="overflowCount" v-bind="resolveSlot(ui.count, props.ui?.count)">+{{ overflowCount }}</span>
    <span v-for="(child, i) in visibleChildren" :key="i" v-bind="resolveSlot(ui.item, props.ui?.item)">
      <component :is="child" />
    </span>
  </div>
</template>
