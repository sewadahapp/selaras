<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { TabsThemeSlots } from '../theme/tabs'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { tabsTheme } from '../theme/tabs'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

type TabsVariants = VariantProps<typeof tabsTheme>

export interface TabItem {
  label: string
  value?: string
  disabled?: boolean
  icon?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TabsProps>(), {
  unmountOnHide: true,
  orientation: 'horizontal',
})

const emit = defineEmits<TabsEmits>()

export interface TabsProps {
  items: TabItem[]
  variant?: TabsVariants['variant']
  defaultValue?: string
  modelValue?: string
  /** Direction of the tab list and its keyboard navigation. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** Unmount inactive panels. Set to false to preserve their content and local state. @default true */
  unmountOnHide?: boolean
  /** Enables horizontal scrolling and overflow controls when the tabs do not fit. */
  scrollable?: boolean
  /** The active tab's text and underline accent. @default 'primary' */
  color?: ColorRole
  ui?: UiProp<TabsThemeSlots>
}

export interface TabsEmits {
  'update:modelValue': [value: string]
}

const theme = useComponentTheme('tabs', tabsTheme)
const icons = useIcons()
const messages = useMessages()
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? 'primary', 'primary'))
const horizontalScrollable = computed(() => props.scrollable && props.orientation === 'horizontal')
const ui = computed(() => theme.value({ variant: props.variant, color: effectiveColor.value as TabsVariants['color'], orientation: props.orientation, scrollable: horizontalScrollable.value }))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const scrollRootProps = computed(() => resolveSlot(ui.value.scrollRoot, props.ui?.scrollRoot))
const scrollViewportProps = computed(() => resolveSlot(ui.value.scrollViewport, props.ui?.scrollViewport))
const scrollButtonProps = computed(() => resolveSlot(ui.value.scrollButton, props.ui?.scrollButton))
const scrollIconProps = computed(() => resolveSlot(ui.value.scrollIcon, props.ui?.scrollIcon))
const listProps = computed(() => resolveSlot(ui.value.list, props.ui?.list))
const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const contentProps = computed(() => resolveSlot(ui.value.content, props.ui?.content))

const scrollRootEl = ref<HTMLElement>()
const scrollViewportEl = ref<HTMLElement>()
const hasOverflow = ref(false)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const leftButtonProps = computed(() => ({
  'type': 'button' as const,
  'disabled': !canScrollLeft.value,
  'aria-label': messages.value.scrollTabsLeft,
  'onClick': scrollLeft,
}))
const rightButtonProps = computed(() => ({
  'type': 'button' as const,
  'disabled': !canScrollRight.value,
  'aria-label': messages.value.scrollTabsRight,
  'onClick': scrollRight,
}))
let resizeObserver: ResizeObserver | undefined

function tabList() {
  return scrollViewportEl.value?.querySelector<HTMLElement>('[role="tablist"]')
}

function updateScrollState() {
  const root = scrollRootEl.value
  const viewport = scrollViewportEl.value
  const list = tabList()
  if (!horizontalScrollable.value || !root || !viewport || !list) {
    hasOverflow.value = false
    canScrollLeft.value = false
    canScrollRight.value = false
    return
  }

  // Compare against the full available width so the chevrons disappear as
  // soon as all tabs fit without them; measuring the reduced viewport would
  // leave controls visible after they are no longer needed.
  hasOverflow.value = list.scrollWidth > root.clientWidth + 1
  const listRect = list.getBoundingClientRect()
  const viewportRect = viewport.getBoundingClientRect()
  canScrollLeft.value = hasOverflow.value && listRect.left < viewportRect.left - 1
  canScrollRight.value = hasOverflow.value && listRect.right > viewportRect.right + 1
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth'
}

function scrollTabs(direction: -1 | 1) {
  const viewport = scrollViewportEl.value
  if (!viewport)
    return
  viewport.scrollBy({ left: direction * viewport.clientWidth * 0.8, behavior: scrollBehavior() })
}

function scrollLeft() {
  scrollTabs(-1)
}

function scrollRight() {
  scrollTabs(1)
}

function scrollActiveIntoView(behavior: ScrollBehavior = 'auto') {
  if (!horizontalScrollable.value)
    return
  const viewport = scrollViewportEl.value
  const active = tabList()?.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
  if (!viewport || !active)
    return
  const viewportRect = viewport.getBoundingClientRect()
  const activeRect = active.getBoundingClientRect()
  const delta = activeRect.left < viewportRect.left
    ? activeRect.left - viewportRect.left
    : activeRect.right > viewportRect.right ? activeRect.right - viewportRect.right : 0
  if (delta)
    viewport.scrollBy({ left: delta, behavior })
}

async function onValueChange(value: string) {
  emit('update:modelValue', value)
  await nextTick()
  scrollActiveIntoView(scrollBehavior())
}

function onResize() {
  updateScrollState()
  scrollActiveIntoView()
}

onMounted(async () => {
  await nextTick()
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(onResize)
    for (const element of [scrollRootEl.value, scrollViewportEl.value, tabList()]) {
      if (element)
        resizeObserver.observe(element)
    }
  }
  window.addEventListener('resize', onResize)
  onResize()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', onResize)
})

watch(() => props.modelValue, async () => {
  await nextTick()
  scrollActiveIntoView()
})

watch(horizontalScrollable, async () => {
  await nextTick()
  onResize()
})

function itemValue(item: TabItem, index: number) {
  return item.value ?? String(index)
}
</script>

<template>
  <TabsRoot
    :default-value="defaultValue"
    :model-value="modelValue"
    :orientation="orientation"
    :unmount-on-hide="unmountOnHide"
    :data-selaras-color="effectiveColor"
    v-bind="rootProps"
    @update:model-value="(value) => onValueChange(value as string)"
  >
    <div ref="scrollRootEl" v-bind="scrollRootProps">
      <slot
        v-if="horizontalScrollable && hasOverflow"
        name="scroll-left"
        :button-props="leftButtonProps"
        :scroll="scrollLeft"
        :disabled="leftButtonProps.disabled"
        :aria-label="leftButtonProps['aria-label']"
      >
        <Button variant="ghost" color="neutral" size="sm" square :ui="{ base: scrollButtonProps }" v-bind="leftButtonProps">
          <template #icon="{ class: iconClass }">
            <slot name="scroll-left-icon" :class="[iconClass, scrollIconProps.class]">
              <Icon :name="icons.chevronLeft" aria-hidden="true" v-bind="scrollIconProps" :class="iconClass" />
            </slot>
          </template>
        </Button>
      </slot>
      <div ref="scrollViewportEl" v-bind="scrollViewportProps" @scroll="updateScrollState">
        <TabsList v-bind="listProps">
          <TabsTrigger
            v-for="(item, index) in items"
            :key="itemValue(item, index)"
            :value="itemValue(item, index)"
            :disabled="item.disabled"
            v-bind="triggerProps"
          >
            <Icon v-if="item.icon" :name="item.icon" v-bind="iconProps" />
            <slot name="label" :item="item" :index="index">
              {{ item.label }}
            </slot>
          </TabsTrigger>
          <TabsIndicator aria-hidden="true" v-bind="indicatorProps" />
        </TabsList>
      </div>
      <slot
        v-if="horizontalScrollable && hasOverflow"
        name="scroll-right"
        :button-props="rightButtonProps"
        :scroll="scrollRight"
        :disabled="rightButtonProps.disabled"
        :aria-label="rightButtonProps['aria-label']"
      >
        <Button variant="ghost" color="neutral" size="sm" square :ui="{ base: scrollButtonProps }" v-bind="rightButtonProps">
          <template #icon="{ class: iconClass }">
            <slot name="scroll-right-icon" :class="[iconClass, scrollIconProps.class]">
              <Icon :name="icons.chevronRight" aria-hidden="true" v-bind="scrollIconProps" :class="iconClass" />
            </slot>
          </template>
        </Button>
      </slot>
    </div>
    <TabsContent
      v-for="(item, index) in items"
      :key="itemValue(item, index)"
      :value="itemValue(item, index)"
      v-bind="contentProps"
    >
      <slot :name="itemValue(item, index)" />
    </TabsContent>
  </TabsRoot>
</template>
