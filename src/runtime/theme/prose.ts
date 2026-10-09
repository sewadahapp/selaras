import { tv } from 'tailwind-variants'

// Only the two Prose*.vue components with genuine behavior beyond styling
// keep a real tv() theme (h1-h6 and pre's own copy-button chrome) - see
// prose.md and prose.css for why every other markdown element's styling
// moved to a plain, pipeline-agnostic CSS class instead.
export const proseTheme = tv({
  slots: {
    h1: 'text-3xl font-semibold tracking-tight text-[var(--selaras-resolved-text-default)] scroll-mt-20',
    h2: 'text-2xl font-semibold tracking-tight text-[var(--selaras-resolved-text-default)] scroll-mt-20',
    h3: 'text-xl font-semibold tracking-tight text-[var(--selaras-resolved-text-default)] scroll-mt-20',
    h4: 'text-lg font-semibold text-[var(--selaras-resolved-text-default)] scroll-mt-20',
    h5: 'text-base font-semibold text-[var(--selaras-resolved-text-default)] scroll-mt-20',
    h6: 'text-sm font-semibold text-[var(--selaras-resolved-text-default)] scroll-mt-20',
    headingAnchor: 'no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--_selaras-color-focus)]',

    preWrapper: 'min-w-0 overflow-hidden rounded-[var(--selaras-resolved-radius-lg)] bg-[var(--selaras-resolved-surface-elevated)] ring-1 ring-[var(--selaras-resolved-border-default)]',
    preHeader: 'flex min-h-11 items-center justify-between gap-3 border-b border-[var(--selaras-resolved-border-default)] bg-[var(--selaras-resolved-surface-default)] px-4 py-1.5',
    preLabel: 'flex min-w-0 items-center gap-2.5',
    preIcon: 'size-4 shrink-0',
    preFilename: 'truncate font-mono text-xs font-medium text-[var(--selaras-resolved-text-default)]',
    preLanguage: 'truncate font-mono text-xs text-[var(--selaras-resolved-text-muted)]',
    preCopyButton: 'shrink-0',
    pre: 'm-0 overflow-x-auto rounded-none bg-[var(--selaras-resolved-surface-elevated)] p-4 font-mono text-sm leading-relaxed text-[var(--selaras-resolved-text-default)]',
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
  },
})

export type ProseThemeSlots = keyof (typeof proseTheme)['slots']
