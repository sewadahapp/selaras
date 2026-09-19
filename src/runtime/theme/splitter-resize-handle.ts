import { tv } from 'tailwind-variants'

export const splitterResizeHandleTheme = tv({
  slots: {
    // A slim hit area with a thinner visible line inside it - the visible
    // line alone would be too narrow a target to reliably grab.
    root: 'group relative shrink-0 bg-transparent outline-none',
    line: 'absolute bg-[var(--selaras-resolved-border-default)] transition-colors group-hover:bg-[var(--_selaras-color-indicator)] group-data-[state=drag]:bg-[var(--_selaras-color-indicator)]',
  },
  variants: {
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    direction: {
      horizontal: { root: 'w-1 cursor-col-resize', line: 'inset-y-0 start-1/2 w-px -translate-x-1/2' },
      vertical: { root: 'h-1 cursor-row-resize', line: 'inset-x-0 top-1/2 h-px -translate-y-1/2' },
    },
  },
  defaultVariants: {
    color: 'primary',
    direction: 'horizontal',
  },
})

export type SplitterResizeHandleThemeSlots = keyof (typeof splitterResizeHandleTheme)['slots']
