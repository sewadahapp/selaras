<script setup lang="ts">
import type { ContentTocSlots } from '../theme/content-toc'
import type { UiProp } from '../utils/ui'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { contentTocTheme } from '../theme/content-toc'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

export interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  links: TocLink[]
  title?: string
  /** Internal: set by recursive self-calls, omit when using this component directly. */
  isNested?: boolean
  /** Internal: set by recursive self-calls, omit when using this component directly. */
  activeId?: string
  ui?: UiProp<ContentTocSlots>
}>(), {
  isNested: false,
})

const isRoot = !props.isNested
const localActiveId = ref<string>()
const activeId = computed(() => props.isNested ? props.activeId : localActiveId.value)

function flattenIds(links: TocLink[]): string[] {
  return links.flatMap(link => [link.id, ...(link.children ? flattenIds(link.children) : [])])
}

let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!isRoot)
    return
  const ids = flattenIds(props.links)
  const elements = ids
    .map(id => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null)
  if (!elements.length)
    return

  const visible = new Set<string>()
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting)
        visible.add(entry.target.id)
      else
        visible.delete(entry.target.id)
    }
    const firstVisible = ids.find(id => visible.has(id))
    if (firstVisible)
      localActiveId.value = firstVisible
  }, { rootMargin: '0px 0px -80% 0px' })

  elements.forEach(el => observer!.observe(el))
})

onUnmounted(() => observer?.disconnect())

const theme = useComponentTheme('contentToc', contentTocTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)

// One shared marker (root instance only - even a nested active link is
// tracked by this same rail, see the theme's own comment on why it
// deliberately ignores per-depth indent) that bounces to whichever link is
// active, rather than each link owning a static indicator. Measured via
// real getBoundingClientRect() against the root nav, not derived from DOM
// position/CSS variables, since link height can vary (multi-line text)
// and this has to stay correct regardless.
const navEl = ref<HTMLElement>()
const markerEl = ref<HTMLElement>()
let resizeObserver: ResizeObserver | undefined

function updateMarker() {
  if (!isRoot || !navEl.value || !markerEl.value)
    return
  const activeLink = navEl.value.querySelector<HTMLAnchorElement>('a[data-active="true"]')
  if (!activeLink) {
    markerEl.value.style.opacity = '0'
    return
  }
  const navRect = navEl.value.getBoundingClientRect()
  const linkRect = activeLink.getBoundingClientRect()
  markerEl.value.style.opacity = '1'
  markerEl.value.style.transform = `translateY(${linkRect.top - navRect.top}px)`
  markerEl.value.style.height = `${linkRect.height}px`
}

if (isRoot) {
  watch(activeId, () => nextTick(updateMarker))
  onMounted(() => {
    nextTick(updateMarker)
    resizeObserver = new ResizeObserver(() => updateMarker())
    if (navEl.value)
      resizeObserver.observe(navEl.value)
  })
  onUnmounted(() => resizeObserver?.disconnect())
}

function linkProps(link: TocLink) {
  const active = activeId.value === link.id
  return {
    ...resolveSlot(theme.value({ active }).link, props.ui?.link),
    'data-active': active || undefined,
  }
}
</script>

<template>
  <component :is="isRoot ? 'nav' : 'div'" ref="navEl" v-bind="isRoot ? rootProps : undefined">
    <span v-if="isRoot" ref="markerEl" v-bind="resolveSlot(ui.marker, props.ui?.marker)" />
    <p v-if="isRoot" v-bind="resolveSlot(ui.title, props.ui?.title)">
      <slot name="title">
        {{ title ?? 'On this page' }}
      </slot>
    </p>
    <ul v-bind="resolveSlot(ui.list, props.ui?.list)">
      <li v-for="link in links" :key="link.id" v-bind="resolveSlot(ui.item, props.ui?.item)">
        <a :href="`#${link.id}`" v-bind="linkProps(link)">{{ link.text }}</a>
        <div v-if="link.children?.length" v-bind="resolveSlot(ui.content, props.ui?.content)">
          <!-- Vue's SFC self-recursion resolves by this file's own bare name -
               keep it unprefixed even though the public component is SContentToc. -->
          <ContentToc :links="link.children" is-nested :active-id="activeId" :ui="props.ui" />
        </div>
      </li>
    </ul>
  </component>
</template>
