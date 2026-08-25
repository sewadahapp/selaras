import { tv } from 'tailwind-variants'

export const tooltipTheme = tv({
  slots: {
    content: 'z-[var(--ui-z-tooltip)] rounded-[var(--ui-radius-sm)] bg-[var(--ui-bg-inverted)] text-[var(--ui-text-inverted)] px-2.5 py-1.5 text-xs shadow-[var(--ui-shadow-md)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:animate-in data-[state=instant-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=instant-open]:zoom-in-95',
    arrow: 'fill-[var(--ui-bg-inverted)]',
  },
})

export type TooltipSlots = keyof (typeof tooltipTheme)['slots']
