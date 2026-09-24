import { tv } from 'tailwind-variants'

export const tabsTheme = tv({
  slots: {
    root: 'w-full',
    scrollRoot: '',
    scrollViewport: '',
    // Button supplies the neutral ghost styling and sm icon size. These slots
    // let Tabs authors adjust either control without duplicating Button CSS.
    scrollButton: '',
    scrollIcon: '',
    // Relative positioning anchors Reka's measured indicator in either axis.
    list: 'relative flex items-center border-b border-[var(--selaras-resolved-border-default)]',
    // z-10 unconditionally (not just for `pill`) - harmless for `underline`
    // (its indicator never overlaps the trigger's own text anyway) and
    // keeps this one class instead of a compound variant.
    trigger: 'relative z-10 inline-flex items-center gap-1.5 px-1 py-2 text-sm font-medium text-[var(--selaras-resolved-text-muted)] transition-colors hover:text-[var(--selaras-resolved-text-default)] disabled:opacity-50 disabled:pointer-events-none',
    icon: 'size-4 shrink-0',
    // Reka measures width/left horizontally and height/top vertically.
    // Tailwind's translate utilities use the CSS `translate` property.
    indicator: 'absolute transition-[translate,width,height] duration-200 ease-out',
    content: 'pt-4 focus-visible:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0',
  },
  variants: {
    variant: {
      underline: {
        trigger: 'data-[state=active]:text-[var(--_selaras-color-text)]',
        indicator: 'rounded-full bg-[var(--_selaras-color-fill)]',
      },
      pill: {
        list: 'gap-1 rounded-[var(--selaras-resolved-radius-md)] border-0 bg-[color-mix(in_oklab,var(--selaras-resolved-surface-elevated)_96%,var(--selaras-resolved-surface-inverted))] p-1',
        trigger: 'justify-center text-center rounded-[var(--selaras-resolved-radius-sm)] px-3 data-[state=active]:text-[var(--_selaras-color-on-fill)]',
        indicator: 'rounded-[var(--selaras-resolved-radius-sm)] bg-[var(--_selaras-color-fill)] shadow-[var(--selaras-resolved-shadow-sm)]',
      },
    },
    orientation: {
      horizontal: {
        indicator: 'left-0 w-[var(--reka-tabs-indicator-size)] translate-x-[var(--reka-tabs-indicator-position)]',
      },
      vertical: {
        root: 'flex items-start gap-4',
        list: 'shrink-0 flex-col items-stretch border-b-0 border-e',
        trigger: 'w-full justify-start text-start px-3',
        indicator: 'top-0 h-[var(--reka-tabs-indicator-size)] translate-y-[var(--reka-tabs-indicator-position)]',
        content: 'min-w-0 flex-1 pt-0',
      },
    },
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    scrollable: {
      false: { scrollRoot: 'contents', scrollViewport: 'contents' },
      true: {
        scrollRoot: 'flex w-full min-w-0 items-center gap-1',
        scrollViewport: 'min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        list: 'w-max min-w-full flex-nowrap',
        trigger: 'shrink-0 whitespace-nowrap',
      },
    },
  },
  compoundVariants: [
    { variant: 'underline', orientation: 'horizontal', class: { list: 'gap-4', indicator: 'bottom-0 h-0.5' } },
    { variant: 'underline', orientation: 'vertical', class: { list: 'gap-1', indicator: 'end-0 w-0.5' } },
    { variant: 'pill', orientation: 'horizontal', class: { indicator: 'inset-y-1' } },
    { variant: 'pill', orientation: 'vertical', class: { list: 'border-0', indicator: 'inset-x-1' } },
  ],
  defaultVariants: {
    variant: 'underline',
    orientation: 'horizontal',
    color: 'primary',
    scrollable: false,
  },
})

export type TabsThemeSlots = keyof (typeof tabsTheme)['slots']
