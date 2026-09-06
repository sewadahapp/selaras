<script setup lang="ts">
import type { ResolvedOption, SelectItems, SelectOption } from '../composables/use-combobox-select'
import {
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxViewport,
  ComboboxVirtualizer,
} from 'reka-ui'
import Icon from '../components/Icon.vue'
import { isOptionGroup } from '../composables/use-combobox-select'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'

defineOptions({ inheritAttrs: false })

defineProps<ComboboxSelectBodyProps>()

const emit = defineEmits<ComboboxSelectBodyEmits>()

// Everything ComboboxSelectBase.vue's own popover used to render inside
// <ComboboxContent> (search box, empty state, item list) - split out so
// the exact same markup, closing over ComboboxRoot's own injected
// context, can be instantiated once inside the desktop floating popover
// and once inside the mobile Modal's own content slot, without
// duplicating the list/virtualizer/group rendering between them. Deliberately
// excludes ComboboxContent/ComboboxArrow themselves and their
// side-offset/arrow chrome - those are desktop-anchoring-only concerns
// that stay in ComboboxSelectBase.vue's own two branches.
export interface ComboboxSelectBodyProps {
  searchable?: boolean
  creatable?: boolean
  searchText: string
  displayValue: (value: unknown) => string
  items: SelectItems
  flatOptions: ResolvedOption[]
  virtualizeConfig: { estimateSize: number, overscan: number } | null
  virtualizedOptions: ResolvedOption[]
  toOption: (entry: SelectOption) => ResolvedOption
  groupOptions: (group: { items: SelectOption[] }) => ResolvedOption[]
  onSearchKeydown: (event: KeyboardEvent) => void
  onSearchBlur: () => void
  searchWrapperProps?: Record<string, unknown>
  searchInputProps?: Record<string, unknown>
  viewportProps?: Record<string, unknown>
  emptyProps?: Record<string, unknown>
  groupProps?: Record<string, unknown>
  itemProps?: Record<string, unknown>
  itemIndicatorProps?: Record<string, unknown>
}

export interface ComboboxSelectBodyEmits {
  'update:searchText': [value: string]
}

const icons = useIcons()
const messages = useMessages()
</script>

<template>
  <slot name="header" />

  <div v-if="searchable && !creatable" v-bind="searchWrapperProps">
    <slot name="filter-icon">
      <Icon :name="icons.search" class="size-4 text-[var(--ui-text-muted)]" />
    </slot>
    <ComboboxInput
      :model-value="searchText"
      :display-value="displayValue"
      :placeholder="messages.search"
      v-bind="searchInputProps"
      @update:model-value="(value) => emit('update:searchText', String(value ?? ''))"
      @keydown="onSearchKeydown"
      @blur="onSearchBlur"
    />
  </div>

  <div v-if="flatOptions.length === 0" v-bind="emptyProps">
    <slot name="empty">
      {{ messages.noOptions }}
    </slot>
  </div>
  <ComboboxViewport v-else v-bind="viewportProps">
    <ComboboxEmpty v-bind="emptyProps">
      <slot name="empty-filter">
        {{ messages.noResultsFound }}
      </slot>
    </ComboboxEmpty>

    <!--
      @tanstack/vue-virtual measures real DOM/scroll state, so it can't
      render identically during SSR - forcing it through anyway causes a
      hydration mismatch that (confirmed empirically) breaks click
      interactivity page-wide, not just on this component. Client-only
      sidesteps it; the popover is closed at SSR time anyway, so there's
      nothing meaningful to show real users in the fallback.
    -->
    <ClientOnly v-if="virtualizeConfig">
      <ComboboxVirtualizer
        v-slot="{ option, virtualItem }"
        :options="virtualizedOptions"
        :estimate-size="virtualizeConfig.estimateSize"
        :overscan="virtualizeConfig.overscan"
      >
        <ComboboxItem
          :key="String(virtualItem.key)"
          :value="option.value"
          :disabled="option.disabled"
          :style="{ position: 'absolute', top: 0, left: 0, right: 0, transform: `translateY(${virtualItem.start}px)`, height: `${virtualItem.size}px` }"
          v-bind="itemProps"
        >
          <slot name="item" :item="option.raw">
            {{ option.label }}
          </slot>
          <ComboboxItemIndicator v-bind="itemIndicatorProps">
            <Icon :name="icons.check" class="size-4" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxVirtualizer>
    </ClientOnly>

    <template v-else>
      <template v-for="(entry, index) in items" :key="index">
        <ComboboxGroup v-if="isOptionGroup(entry)">
          <ComboboxLabel v-bind="groupProps">
            <slot name="group" :group="entry">
              {{ entry.label }}
            </slot>
          </ComboboxLabel>
          <ComboboxItem
            v-for="option in groupOptions(entry)"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
            v-bind="itemProps"
          >
            <slot name="item" :item="option.raw">
              {{ option.label }}
            </slot>
            <ComboboxItemIndicator v-bind="itemIndicatorProps">
              <Icon :name="icons.check" class="size-4" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxGroup>
        <ComboboxItem
          v-else
          :value="toOption(entry).value"
          :disabled="toOption(entry).disabled"
          v-bind="itemProps"
        >
          <slot name="item" :item="entry">
            {{ toOption(entry).label }}
          </slot>
          <ComboboxItemIndicator v-bind="itemIndicatorProps">
            <Icon :name="icons.check" class="size-4" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </template>
    </template>
  </ComboboxViewport>

  <slot name="footer" />
</template>
