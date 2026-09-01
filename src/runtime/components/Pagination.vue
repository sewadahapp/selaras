<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { buttonTheme } from '../theme/button'
import type { PaginationThemeSlots } from '../theme/pagination'
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
import { computed, resolveComponent } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { paginationTheme } from '../theme/pagination'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'

type PaginationVariants = VariantProps<typeof paginationTheme>
type ButtonVariants = VariantProps<typeof buttonTheme>

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
  /** Set `false` to hide Previous/Next entirely, for a bare page-number-only strip. */
  showControls?: boolean
  /** Maps a page number to a route/href, rendering every control as a real link (progressive enhancement - clicking still drives the page change through Reka's own handling, same as a plain button). */
  to?: (page: number) => string
  disabled?: boolean
  size?: PaginationVariants['size']
  /** Inactive controls (First/Prev/Next/Last and non-current page numbers). */
  color?: ButtonVariants['color']
  variant?: ButtonVariants['variant']
  /** The current page's own button. */
  activeColor?: ButtonVariants['color']
  activeVariant?: ButtonVariants['variant']
  ui?: UiProp<PaginationThemeSlots>
}>(), {
  total: 0,
  itemsPerPage: 10,
  defaultPage: 1,
  siblingCount: 1,
  showEdges: true,
  showFirstLast: false,
  showControls: true,
  color: 'neutral',
  variant: 'ghost',
  activeColor: 'primary',
  activeVariant: 'solid',
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

// resolveComponent (not a bare `as="NuxtLink"` string) matches the pattern
// Button.md's own docs already establish for link rendering - Reka's
// Primitive ends up calling Vue's `h()` directly with whatever `as` is, and
// `h()` doesn't resolve a plain string against the global component
// registry the way a compiled template's `<component :is="...">` would.
const NuxtLink = resolveComponent('NuxtLink')

function linkProps(page: number) {
  return props.to ? { as: NuxtLink, to: props.to(page) } : {}
}
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
    <template #default="{ page: currentPage, pageCount }">
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
        <Button :variant="variant" :color="color" :size="size" :icon="icons.chevronsLeft" :aria-label="messages.first" :ui="mirroredIconUi" v-bind="linkProps(1)" />
      </PaginationFirst>
      <PaginationPrev v-if="showControls" as-child>
        <Button :variant="variant" :color="color" :size="size" :icon="icons.chevronLeft" :aria-label="messages.previous" :ui="mirroredIconUi" v-bind="linkProps(currentPage - 1)" />
      </PaginationPrev>

      <PaginationList v-slot="{ items }" v-bind="listProps">
        <template v-for="(item, index) in items" :key="item.type === 'ellipsis' ? `ellipsis-${index}` : item.value">
          <PaginationEllipsis v-if="item.type === 'ellipsis'" v-bind="ellipsisProps">
            &hellip;
          </PaginationEllipsis>
          <PaginationListItem v-else :value="item.value" as-child>
            <Button
              :variant="item.value === currentPage ? activeVariant : variant"
              :color="item.value === currentPage ? activeColor : color"
              :size="size"
              square
              v-bind="linkProps(item.value)"
            >
              {{ item.value }}
            </Button>
          </PaginationListItem>
        </template>
      </PaginationList>

      <PaginationNext v-if="showControls" as-child>
        <Button :variant="variant" :color="color" :size="size" :icon="icons.chevronRight" :aria-label="messages.next" :ui="mirroredIconUi" v-bind="linkProps(currentPage + 1)" />
      </PaginationNext>
      <PaginationLast v-if="showFirstLast" as-child>
        <Button :variant="variant" :color="color" :size="size" :icon="icons.chevronsRight" :aria-label="messages.last" :ui="mirroredIconUi" v-bind="linkProps(pageCount)" />
      </PaginationLast>
    </template>
  </PaginationRoot>
</template>
