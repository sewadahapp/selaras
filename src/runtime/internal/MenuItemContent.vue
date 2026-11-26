<script setup lang="ts">
import type { MenuItemOptions } from '../utils/menu-items'
import Icon from '../components/Icon.vue'
import ShortcutHint from './ShortcutHint.vue'

defineProps<{
  item: MenuItemOptions
  iconProps: Record<string, unknown>
}>()
</script>

<template>
  <Icon v-if="item.icon" :name="item.icon" v-bind="iconProps" />
  <slot>
    {{ item.label }}
    <ShortcutHint :shortcut="item.shortcut" />
  </slot>
</template>
