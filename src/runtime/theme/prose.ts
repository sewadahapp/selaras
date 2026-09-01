import { tv } from 'tailwind-variants'

export const proseTheme = tv({
  slots: {
    a: 'font-medium text-[var(--ui-primary)] underline underline-offset-4 hover:text-[var(--ui-primary-hover)]',
    blockquote: 'border-s-2 border-[var(--ui-border)] ps-4 italic text-[var(--ui-text-muted)]',
    code: 'rounded-[var(--ui-radius-sm)] bg-[var(--ui-bg-elevated)] px-1.5 py-0.5 font-mono text-[0.875em] text-[var(--ui-text)]',
    em: 'italic',
    h1: 'text-3xl font-semibold tracking-tight text-[var(--ui-text)] scroll-mt-20',
    h2: 'text-2xl font-semibold tracking-tight text-[var(--ui-text)] scroll-mt-20',
    h3: 'text-xl font-semibold tracking-tight text-[var(--ui-text)] scroll-mt-20',
    h4: 'text-lg font-semibold text-[var(--ui-text)] scroll-mt-20',
    h5: 'text-base font-semibold text-[var(--ui-text)] scroll-mt-20',
    h6: 'text-sm font-semibold text-[var(--ui-text)] scroll-mt-20',
    headingAnchor: 'no-underline hover:underline',
    hr: 'border-[var(--ui-border)]',
    img: 'max-w-full rounded-[var(--ui-radius-md)]',
    li: 'text-[var(--ui-text)]',
    ol: 'list-decimal space-y-1 ps-6 text-[var(--ui-text)]',
    p: 'leading-relaxed text-[var(--ui-text)]',
    strong: 'font-semibold text-[var(--ui-text)]',
    table: 'w-full border-collapse text-sm',
    tbody: '',
    td: 'border-b border-[var(--ui-border-muted)] px-3 py-2 text-[var(--ui-text)]',
    th: 'border-b border-[var(--ui-border)] px-3 py-2 text-start font-medium text-[var(--ui-text-muted)]',
    thead: 'bg-[var(--ui-bg-elevated)]',
    tr: '',
    ul: 'list-disc space-y-1 ps-6 text-[var(--ui-text)]',

    preWrapper: 'overflow-hidden rounded-[var(--ui-radius-md)] ring-1 ring-[var(--ui-border)]',
    preHeader: 'flex items-center justify-between gap-2 border-b border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-3 py-1.5',
    preFilename: 'font-mono text-xs text-[var(--ui-text-muted)]',
    preCopyButton: 'shrink-0',
    pre: 'overflow-x-auto bg-[var(--ui-bg)] p-4 font-mono text-sm leading-relaxed',
  },
})

export type ProseThemeSlots = keyof (typeof proseTheme)['slots']
