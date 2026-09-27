import type { TimelineThemeSlots } from '../theme/timeline'
import type { ColorRole } from './color-registry'
import type { UiProp } from './ui'

export interface TimelineItem {
  id?: string | number
  class?: string
  date?: string
  /** ISO-8601 value for the semantic `<time datetime>` attribute. */
  datetime?: string
  title?: string
  description?: string
  icon?: string
  color?: ColorRole
  /** Selects a named slot for this item, replacing its default content. */
  slot?: string
  /** Per-item styling overrides, resolved against the component's theme. */
  ui?: UiProp<TimelineThemeSlots>
  /** Additional application data is passed unchanged to scoped slots. */
  [key: string]: unknown
}

export interface TimelineProps<TItem extends TimelineItem = TimelineItem> {
  items: TItem[]
  orientation?: 'vertical' | 'horizontal'
  align?: 'start' | 'end' | 'alternate'
  size?: 'sm' | 'md' | 'lg'
  color?: ColorRole
  ui?: UiProp<TimelineThemeSlots>
}

export interface TimelineSlotProps<TItem extends TimelineItem = TimelineItem> {
  item: TItem
  index: number
}

export interface TimelineSlots<TItem extends TimelineItem = TimelineItem> {
  marker?: (props: TimelineSlotProps<TItem>) => any
  connector?: (props: TimelineSlotProps<TItem>) => any
  date?: (props: TimelineSlotProps<TItem>) => any
  title?: (props: TimelineSlotProps<TItem>) => any
  description?: (props: TimelineSlotProps<TItem>) => any
  content?: (props: TimelineSlotProps<TItem>) => any
  item?: (props: TimelineSlotProps<TItem>) => any
  [name: string]: ((props: TimelineSlotProps<TItem>) => any) | undefined
}
