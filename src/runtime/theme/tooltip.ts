import { tv } from 'tailwind-variants'

export const tooltipTheme = tv({
  slots: {
    content: 'z-[var(--ui-z-tooltip)] flex items-center gap-2 rounded-[var(--ui-radius-sm)] bg-[var(--ui-bg-inverted)] text-[var(--ui-text-inverted)] px-2.5 py-1.5 text-xs shadow-[var(--ui-shadow-md)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:animate-in data-[state=instant-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=instant-open]:zoom-in-95',
    arrow: 'fill-[var(--ui-bg-inverted)]',
    kbds: 'ms-auto flex items-center gap-0.5',
    // bg-current/15 (not a fixed light/dark token) picks up whatever
    // text-inverted resolves to at this spot, so the badge reads as a
    // subtle overlay on the tooltip's own inverted surface in both themes -
    // the same currentColor-overlay technique Chip's own remove button
    // already uses against its (also currentColor-driven) surface.
    kbd: 'rounded-[var(--ui-radius-sm)] bg-current/15 px-1 py-0.5 text-[10px] font-medium',
  },
})

export type TooltipSlots = keyof (typeof tooltipTheme)['slots']
