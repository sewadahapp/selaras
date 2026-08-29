import { tv } from 'tailwind-variants'

export const tabsTheme = tv({
  slots: {
    root: 'w-full',
    // relative - the positioned ancestor both the triggers' own offsetLeft
    // and the sliding indicator's absolute positioning resolve against.
    list: 'relative flex items-center border-b border-[var(--ui-border)]',
    // z-10 unconditionally (not just for `pill`) - harmless for `underline`
    // (its indicator never overlaps the trigger's own text anyway) and
    // keeps this one class instead of a compound variant.
    trigger: 'relative z-10 inline-flex items-center gap-1.5 px-1 py-2 text-sm font-medium text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-text)] disabled:opacity-50 disabled:pointer-events-none data-[state=active]:text-[var(--ui-primary)]',
    icon: 'size-4 shrink-0',
    // Positioned via Reka's own TabsIndicator - it measures the active
    // trigger's offsetLeft/offsetWidth itself (ResizeObserver-driven, and
    // re-runs on every active-tab change whether Tabs is controlled or
    // uncontrolled) and exposes the result as these two CSS custom
    // properties, the same `var(...)` arbitrary-value pattern
    // theme/select.ts's own `content` slot already uses for
    // --reka-combobox-trigger-width. The transition is the only thing
    // actually driving the slide - JS never animates it directly.
    indicator: 'absolute translate-x-[var(--reka-tabs-indicator-position)] w-[var(--reka-tabs-indicator-size)] transition-[transform,width] duration-200 ease-out',
    content: 'pt-4 focus-visible:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0',
  },
  variants: {
    variant: {
      underline: {
        list: 'gap-4',
        indicator: 'inset-x-0 bottom-0 h-0.5 rounded-full bg-[var(--ui-primary)]',
      },
      pill: {
        list: 'gap-1 rounded-full border-0 bg-[var(--ui-bg-elevated)] p-1',
        trigger: 'rounded-full px-3',
        indicator: 'inset-y-1 rounded-full bg-[var(--ui-bg)] shadow-[var(--ui-shadow-sm)]',
      },
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
})

export type TabsSlots = keyof (typeof tabsTheme)['slots']
