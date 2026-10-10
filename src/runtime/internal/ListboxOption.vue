<script setup lang="ts">
import type { ListboxThemeSlots } from '../theme/listbox'
import type { ResolvedItemOption } from './combobox-select'
import { ListboxItem, ListboxItemIndicator } from 'reka-ui'
import { computed } from 'vue'
import Icon from '../components/Icon.vue'
import { useIcons } from '../composables/use-icons'

const props = defineProps<{
  option: ResolvedItemOption
  index: number
  selected: boolean
  disabled?: boolean
  checkbox?: boolean
  descriptionKey: string
  color: string
  size?: 'sm' | 'md' | 'lg'
  parts: Record<ListboxThemeSlots, Record<string, unknown>>
}>()
const icons = useIcons()
const record = computed(() => typeof props.option.raw === 'object' ? props.option.raw as Record<string, unknown> : undefined)
const description = computed(() => record.value?.[props.descriptionKey])
const icon = computed(() => typeof record.value?.icon === 'string' ? record.value.icon : undefined)
</script>

<template>
  <ListboxItem :value="option.value" :text-value="option.label" :disabled="disabled || option.disabled" v-bind="parts.item">
    <span v-if="checkbox" aria-hidden="true" :data-state="selected ? 'checked' : 'unchecked'" v-bind="parts.checkbox"><Icon v-if="selected" :name="icons.check" class="size-3" /></span>
    <slot :item="option.raw" :index="index" :selected="selected" :disabled="!!(disabled || option.disabled)">
      <Icon v-if="icon" :name="icon" v-bind="parts.icon" />
      <span v-bind="parts.itemContent">
        <span v-bind="parts.label">{{ option.label }}</span>
        <span v-if="description" v-bind="parts.description">{{ description }}</span>
      </span>
    </slot>
    <ListboxItemIndicator v-if="!checkbox" v-bind="parts.indicator">
      <Icon :name="icons.check" v-bind="parts.icon" />
    </ListboxItemIndicator>
  </ListboxItem>
</template>
