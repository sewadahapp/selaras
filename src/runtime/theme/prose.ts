import { tv } from 'tailwind-variants'

// Only the two Prose*.vue components with genuine behavior beyond styling
// keep a real tv() theme (h1-h6 and pre's own copy-button chrome) - see
// prose.md and prose.css for why every other markdown element's styling
// moved to a plain, pipeline-agnostic CSS class instead.
export const proseTheme = tv({
  slots: {
    h1: 'text-3xl font-semibold tracking-tight text-[var(--ui-text)] scroll-mt-20',
    h2: 'text-2xl font-semibold tracking-tight text-[var(--ui-text)] scroll-mt-20',
    h3: 'text-xl font-semibold tracking-tight text-[var(--ui-text)] scroll-mt-20',
    h4: 'text-lg font-semibold text-[var(--ui-text)] scroll-mt-20',
    h5: 'text-base font-semibold text-[var(--ui-text)] scroll-mt-20',
    h6: 'text-sm font-semibold text-[var(--ui-text)] scroll-mt-20',
    headingAnchor: 'no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)]',

    preWrapper: 'overflow-hidden rounded-[var(--ui-radius-md)] ring-1 ring-[var(--ui-border)]',
    preHeader: 'flex items-center justify-between gap-2 border-b border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-3 py-1.5',
    preFilename: 'font-mono text-xs text-[var(--ui-text-muted)]',
    preCopyButton: 'shrink-0',
    pre: 'overflow-x-auto bg-[var(--ui-bg-elevated)] p-4 font-mono text-sm leading-relaxed',
  },
})

export type ProseThemeSlots = keyof (typeof proseTheme)['slots']
