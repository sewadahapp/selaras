import { tv } from 'tailwind-variants'

export const readMoreTheme = tv({
  slots: {
    root: 'relative',
    // max-height (not height) is what actually animates - see
    // ReadMore.vue's own comment on why this needs a measured pixel value
    // rather than the `auto` keyword, which CSS transitions can't animate.
    content: 'relative overflow-hidden transition-[max-height] duration-300 ease-out',
    // A fade rather than a hard cut - signals there's more below without a
    // visible seam at the truncation line. Reads from --selaras-resolved-surface-default since it
    // needs to blend into whatever's directly behind it, not a fixed color.
    fade: 'pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--selaras-resolved-surface-default)] to-transparent',
    trigger: 'relative mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--_selaras-color-text)] transition-colors hover:text-[var(--_selaras-color-text-hover)]',
    triggerIcon: 'size-4 transition-transform duration-200',
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
    open: {
      true: { triggerIcon: 'rotate-180' },
    },
  },
})

export type ReadMoreThemeSlots = keyof (typeof readMoreTheme)['slots']
