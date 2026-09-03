import { tv } from 'tailwind-variants'

export const codeTreeTheme = tv({
  slots: {
    root: 'flex overflow-hidden rounded-[var(--ui-radius-md)] border border-[var(--ui-border)] bg-[var(--ui-bg)]',
    // FileTree's own root box (border/bg/padding) is stripped via its :ui
    // override below - this wrapper provides that framing instead, so the
    // two panels read as one split view rather than a box inside a box.
    tree: 'w-56 shrink-0 overflow-auto border-e border-[var(--ui-border)] p-2',
    content: 'min-w-0 flex-1 overflow-auto p-4',
    pre: 'whitespace-pre font-mono text-sm text-[var(--ui-text)]',
    empty: 'flex flex-1 items-center justify-center p-4 text-center text-sm text-[var(--ui-text-muted)]',
  },
})

export type CodeTreeThemeSlots = keyof (typeof codeTreeTheme)['slots']
