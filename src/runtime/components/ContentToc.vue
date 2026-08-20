<script setup lang="ts">
import type { ContentTocSlots } from '../theme/content-toc'
import type { UiProp } from '../utils/ui'
import { computed, onMounted, onUnmounted, ref } from 'vue'
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

function linkProps(link: TocLink) {
  return resolveSlot(theme.value({ active: activeId.value === link.id }).link, props.ui?.link)
}
</script>

<template>
  <component :is="isRoot ? 'nav' : 'div'" v-bind="isRoot ? rootProps : undefined">
    <p v-if="isRoot && (title || $slots.title)" v-bind="resolveSlot(ui.title, props.ui?.title)">
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
