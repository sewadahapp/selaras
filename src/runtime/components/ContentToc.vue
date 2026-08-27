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

interface RailSegment {
  top: number
  height: number
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  links: TocLink[]
  title?: string
  /** Internal: set by recursive self-calls, omit when using this component directly. */
  isNested?: boolean
  /** Internal: set by recursive self-calls, omit when using this component directly. */
  activeIds?: Set<string>
  ui?: UiProp<ContentTocSlots>
}>(), {
  isNested: false,
})

const isRoot = !props.isNested
const localActiveIds = ref<Set<string>>(new Set())
const activeIds = computed(() => props.isNested ? (props.activeIds ?? new Set<string>()) : localActiveIds.value)

function flattenIds(links: TocLink[]): string[] {
  return links.flatMap(link => [link.id, ...(link.children ? flattenIds(link.children) : [])])
}

// A heading is "active" while any part of its content range (from its own
// position down to the next heading's, or to the end of the document for
// the last one) overlaps a band near the top of the viewport - not just
// while the heading ELEMENT itself sits in a fixed trigger zone. Two
// things fall out of that for free: short adjacent sections can be active
// together (their ranges both overlap the band at once), and the very
// last section's range always extends to the end of the document, so it's
// guaranteed to eventually become active however short its own content is
// - the previous element-only IntersectionObserver version had no range
// past the last heading, so a short final section's heading could scroll
// out of the trigger zone with nothing left to replace it, and the
// indicator would go dark for the rest of the page.
const TRIGGER_BAND_RATIO = 0.25

let tocIds: string[] = []
let tocElements: HTMLElement[] = []
let ticking = false

function updateActiveIds() {
  if (!tocElements.length)
    return
  const viewTop = window.scrollY
  const docBottom = document.documentElement.scrollHeight
  // The trigger band is normally just the top slice of the viewport - but
  // once scrolled as far as the page allows, there's no more "later"
  // scroll position left to bring a lower-sitting last heading into that
  // slice, so the band opens up to the true bottom of the document
  // instead. Without this, a last section whose own heading happens to
  // sit in the lower part of the final viewport frame (not unlikely - it
  // depends on exactly how much content is left below it) could still
  // never activate, just from a smaller margin than before.
  const atMaxScroll = viewTop + window.innerHeight >= docBottom - 1
  const viewBottom = atMaxScroll ? docBottom : viewTop + window.innerHeight * TRIGGER_BAND_RATIO

  const active = new Set<string>()
  for (let i = 0; i < tocElements.length; i++) {
    const top = tocElements[i]!.getBoundingClientRect().top + window.scrollY
    const bottom = i + 1 < tocElements.length
      ? tocElements[i + 1]!.getBoundingClientRect().top + window.scrollY
      : docBottom
    if (bottom > viewTop && top < viewBottom)
      active.add(tocIds[i]!)
  }
  localActiveIds.value = active
}

function onScrollOrResize() {
  if (ticking)
    return
  ticking = true
  requestAnimationFrame(() => {
    updateActiveIds()
    ticking = false
  })
}

onMounted(() => {
  if (!isRoot)
    return
  tocIds = flattenIds(props.links)
  tocElements = tocIds
    .map(id => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null)
  if (!tocElements.length)
    return

  updateActiveIds()
  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScrollOrResize)
  window.removeEventListener('resize', onScrollOrResize)
})

const theme = useComponentTheme('contentToc', contentTocTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)

// The rail: one continuous zigzag "wire" SVG path connecting every heading
// (root instance only - nested recursive calls just render their own <ul>,
// see the template), applied as a CSS mask rather than painted directly -
// see the theme's own comments on railTrack/railSegments for why. Ported
// from the reference's own geometry (github.com/BayBreezy/docd's
// DocsTocRail.vue/DocsZigZagRail.vue) rather than re-derived, since the
// curve constants below were already tuned there.
const RAIL_WIDTH = 20
const RAIL_X_OUTER = 1
const RAIL_X_INNER_MAX = RAIL_WIDTH - 1
const RAIL_CURVE_SPAN = 8

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function buildRailSegments(links: HTMLElement[]): RailSegment[] {
  const segments: RailSegment[] = []
  let rangeStart = -1
  let rangeEnd = -1

  const pushRange = () => {
    if (rangeStart === -1 || rangeEnd === -1)
      return
    const startEl = links[rangeStart]!
    const endEl = links[rangeEnd]!
    const top = Math.max(0, startEl.offsetTop)
    const bottom = endEl.offsetTop + endEl.offsetHeight
    segments.push({ top, height: Math.max(0, bottom - top) })
    rangeStart = -1
    rangeEnd = -1
  }

  links.forEach((link, index) => {
    if (link.getAttribute('data-active') !== 'true') {
      pushRange()
      return
    }
    if (rangeStart === -1)
      rangeStart = index
    rangeEnd = index
  })
  pushRange()

  return segments
}

// Each heading's own vertical midpoint, connected top-to-bottom - depth
// changes bend the path inward/outward (via a short bezier curve, not a
// hard corner) rather than jumping straight across.
function buildRailPath(links: HTMLElement[], height: number): string {
  const items = links.map((node) => {
    const top = Math.round(node.offsetTop)
    const h = Math.round(node.offsetHeight || 0)
    return { y: top + Math.round(h / 2), depth: Number(node.dataset.depth ?? '0') }
  })

  const depths = items.map(item => item.depth)
  const baseDepth = Math.min(...depths)
  const maxDepth = Math.max(...depths)
  const levels = Math.max(1, maxDepth - baseDepth)
  const indentStep = (RAIL_X_INNER_MAX - RAIL_X_OUTER) / levels

  const xForDepth = (depth: number) => {
    const index = Math.max(0, depth - baseDepth)
    const x = RAIL_X_OUTER + index * indentStep
    return Math.round(clamp(x, RAIL_X_OUTER, RAIL_X_INNER_MAX))
  }

  let x = xForDepth(items[0]?.depth ?? baseDepth)
  let yPrev = 0
  let d = `M ${x} 0`

  for (const item of items) {
    const y = clamp(item.y, 0, height)
    const xNext = xForDepth(item.depth)

    if (xNext === x) {
      if (y > yPrev)
        d += ` L ${x} ${y}`
      yPrev = Math.max(yPrev, y)
      continue
    }

    const y0 = clamp(y - RAIL_CURVE_SPAN, yPrev, height)
    const midY = (y0 + y) / 2
    if (y0 > yPrev)
      d += ` L ${x} ${y0}`
    d += ` C ${x} ${midY} ${xNext} ${midY} ${xNext} ${y}`

    x = xNext
    yPrev = y
  }

  if (height > yPrev)
    d += ` L ${x} ${height}`

  return d
}

function buildRailMaskUrl(pathD: string, height: number): string {
  const h = Math.max(1, Math.round(height))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${RAIL_WIDTH} ${h}"><path d="${pathD}" stroke="black" stroke-width="1" fill="none"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const railWrapEl = ref<HTMLElement>()
const railHeight = ref(0)
const railPathD = ref('')
const railSegments = ref<RailSegment[]>([])
let railResizeObserver: ResizeObserver | undefined

function measureRail() {
  if (!isRoot || !railWrapEl.value)
    return
  const links = Array.from(railWrapEl.value.querySelectorAll<HTMLElement>('[data-toc-link="true"]'))
  if (!links.length) {
    railHeight.value = 0
    railPathD.value = ''
    railSegments.value = []
    return
  }
  const last = links[links.length - 1]!
  railHeight.value = Math.ceil(last.offsetTop + last.offsetHeight)
  railPathD.value = buildRailPath(links, railHeight.value)
  railSegments.value = buildRailSegments(links)
}

const railMaskStyle = computed(() => {
  const url = railPathD.value ? buildRailMaskUrl(railPathD.value, railHeight.value) : 'none'
  return {
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
  }
})

if (isRoot) {
  watch(activeIds, () => nextTick(measureRail))
  onMounted(() => {
    nextTick(measureRail)
    railResizeObserver = new ResizeObserver(() => measureRail())
    if (railWrapEl.value)
      railResizeObserver.observe(railWrapEl.value)
  })
  onUnmounted(() => railResizeObserver?.disconnect())
}

function linkProps(link: TocLink) {
  const active = activeIds.value.has(link.id)
  return {
    ...resolveSlot(theme.value({ active }).link, props.ui?.link),
    'data-toc-link': 'true',
    'data-depth': link.depth,
    'data-active': active || undefined,
  }
}
</script>

<template>
  <component :is="isRoot ? 'nav' : 'div'" v-bind="isRoot ? rootProps : undefined">
    <p v-if="isRoot" v-bind="resolveSlot(ui.title, props.ui?.title)">
      <slot name="title">
        {{ title ?? 'On this page' }}
      </slot>
    </p>

    <div v-if="isRoot" ref="railWrapEl" v-bind="resolveSlot(ui.railWrap, props.ui?.railWrap)">
      <div
        v-if="railHeight > 0"
        v-bind="resolveSlot(ui.railContainer, props.ui?.railContainer)"
        :style="{ width: `${RAIL_WIDTH}px`, height: `${railHeight}px` }"
      >
        <div v-bind="resolveSlot(ui.railTrack, props.ui?.railTrack)" :style="railMaskStyle" />
        <div v-bind="resolveSlot(ui.railSegments, props.ui?.railSegments)" :style="railMaskStyle">
          <div
            v-for="(segment, index) in railSegments"
            :key="index"
            v-bind="resolveSlot(ui.railSegment, props.ui?.railSegment)"
            :style="{ top: `${segment.top}px`, height: `${segment.height}px` }"
          />
        </div>
      </div>

      <ul v-bind="resolveSlot(ui.list, props.ui?.list)">
        <li v-for="link in links" :key="link.id" v-bind="resolveSlot(ui.item, props.ui?.item)">
          <a :href="`#${link.id}`" v-bind="linkProps(link)">{{ link.text }}</a>
          <div v-if="link.children?.length" v-bind="resolveSlot(ui.content, props.ui?.content)">
            <!-- Vue's SFC self-recursion resolves by this file's own bare name -
                 keep it unprefixed even though the public component is SContentToc. -->
            <ContentToc :links="link.children" is-nested :active-ids="activeIds" :ui="props.ui" />
          </div>
        </li>
      </ul>
    </div>

    <ul v-else v-bind="resolveSlot(ui.list, props.ui?.list)">
      <li v-for="link in links" :key="link.id" v-bind="resolveSlot(ui.item, props.ui?.item)">
        <a :href="`#${link.id}`" v-bind="linkProps(link)">{{ link.text }}</a>
        <div v-if="link.children?.length" v-bind="resolveSlot(ui.content, props.ui?.content)">
          <ContentToc :links="link.children" is-nested :active-ids="activeIds" :ui="props.ui" />
        </div>
      </li>
    </ul>
  </component>
</template>
