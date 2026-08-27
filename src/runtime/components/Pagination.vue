<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { PaginationSlots } from '../theme/pagination'
import type { UiProp } from '../utils/ui'
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { paginationTheme } from '../theme/pagination'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'

type PaginationVariants = VariantProps<typeof paginationTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  /** Total item count - paired with itemsPerPage to derive the page count, same shape as Reka's own PaginationRoot. */
  total?: number
  itemsPerPage?: number
  /** Controlled current page (1-indexed). Omit and use defaultPage for uncontrolled usage. */
  page?: number
  defaultPage?: number
  siblingCount?: number
  showEdges?: boolean
  /** Adds jump-to-first/jump-to-last buttons alongside the always-present Prev/Next. */
  showFirstLast?: boolean
  disabled?: boolean
  size?: PaginationVariants['size']
  ui?: UiProp<PaginationSlots>
}>(), {
  total: 0,
  itemsPerPage: 10,
  defaultPage: 1,
  siblingCount: 1,
  showEdges: true,
  showFirstLast: false,
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('pagination', paginationTheme)
const ui = computed(() => theme.value({ size: props.size }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const listProps = computed(() => resolveSlot(ui.value.list, props.ui?.list))
const ellipsisProps = computed(() => resolveSlot(ui.value.ellipsis, props.ui?.ellipsis))

// Mirrors each nav button's chevron under RTL - a plain horizontal flip is
// enough here (unlike Table's expand chevron) since these icons have no
// separate "expanded" toggle state to interact with the mirror transform.
const mirroredIconUi = { leadingIcon: 'rtl:-scale-x-100' }
</script>

<template>
  <PaginationRoot
    :page="page"
    :default-page="defaultPage"
    :total="total"
    :items-per-page="itemsPerPage"
    :sibling-count="siblingCount"
    :show-edges="showEdges"
    :disabled="disabled"
    :aria-label="messages.pagination"
    v-bind="rootProps"
    @update:page="(value) => emit('update:page', value)"
  >
    <template #default="{ page: currentPage }">
      <!--
        No `:disabled` bound on any nested Button below - Reka's own
        PaginationPrev/Next/First/Last/ListItem each already compute their
        own correct disabled value (boundary-aware, and folding in the
        `disabled` prop passed to PaginationRoot above) and pass it down as
        part of the asChild merge. Binding our own `:disabled="disabled"`
        here would add an explicit (if often-undefined) `disabled` key to
        Button's own vnode props - and Reka's asChild merge (see
        reka-ui/src/Primitive/Slot.ts) gives the child's own props priority
        over the primitive's attrs specifically so a consumer CAN override
        them, which here would silently clobber Reka's correct value with
        `undefined` on every page but the disabled boundary.
      -->
      <PaginationFirst v-if="showFirstLast" as-child>
        <Button variant="ghost" color="neutral" :size="size" :icon="icons.chevronsLeft" :aria-label="messages.first" :ui="mirroredIconUi" />
      </PaginationFirst>
      <PaginationPrev as-child>
        <Button variant="ghost" color="neutral" :size="size" :icon="icons.chevronLeft" :aria-label="messages.previous" :ui="mirroredIconUi" />
      </PaginationPrev>

      <PaginationList v-slot="{ items }" v-bind="listProps">
        <template v-for="(item, index) in items" :key="item.type === 'ellipsis' ? `ellipsis-${index}` : item.value">
          <PaginationEllipsis v-if="item.type === 'ellipsis'" v-bind="ellipsisProps">
            &hellip;
          </PaginationEllipsis>
          <PaginationListItem v-else :value="item.value" as-child>
            <Button
              :variant="item.value === currentPage ? 'solid' : 'ghost'"
              :color="item.value === currentPage ? 'primary' : 'neutral'"
              :size="size"
            >
              {{ item.value }}
            </Button>
          </PaginationListItem>
        </template>
      </PaginationList>

      <PaginationNext as-child>
        <Button variant="ghost" color="neutral" :size="size" :icon="icons.chevronRight" :aria-label="messages.next" :ui="mirroredIconUi" />
      </PaginationNext>
      <PaginationLast v-if="showFirstLast" as-child>
        <Button variant="ghost" color="neutral" :size="size" :icon="icons.chevronsRight" :aria-label="messages.last" :ui="mirroredIconUi" />
      </PaginationLast>
    </template>
  </PaginationRoot>
</template>
