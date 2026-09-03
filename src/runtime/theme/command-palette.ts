import { tv } from 'tailwind-variants'

export const commandPaletteTheme = tv({
  slots: {
    overlay: 'fixed inset-0 z-[var(--ui-z-modal-overlay)] bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
    // Top-anchored (not vertically centered like Modal) - the conventional
    // command-palette position, and it means the dialog doesn't visibly
    // jump up and down as the result list grows/shrinks while typing.
    content: 'fixed left-1/2 top-24 z-[var(--ui-z-modal)] flex max-h-[min(28rem,calc(100vh-8rem))] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 flex-col overflow-hidden rounded-[var(--ui-radius-lg)] bg-[var(--ui-bg)] shadow-[var(--ui-shadow-lg)] focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    header: 'flex shrink-0 items-center gap-2 border-b border-[var(--ui-border)] px-4',
    searchIcon: 'size-4.5 shrink-0 text-[var(--ui-text-muted)]',
    input: 'h-12 flex-1 bg-transparent text-sm text-[var(--ui-text)] placeholder:text-[var(--ui-text-muted)] focus:outline-none',
    list: 'flex-1 overflow-y-auto p-1',
    group: 'py-1',
    groupLabel: 'px-2 py-1 text-xs font-medium text-[var(--ui-text-muted)]',
    item: 'flex items-center gap-2 rounded-[var(--ui-radius-sm)] px-2 py-2 text-sm text-[var(--ui-text)] cursor-pointer select-none outline-none data-[highlighted]:bg-[var(--ui-bg-elevated)] data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    itemIcon: 'size-4 shrink-0 text-[var(--ui-text-muted)]',
    itemLabel: 'flex-1',
    itemShortcut: 'flex shrink-0 items-center gap-1',
    empty: 'p-6 text-center text-sm text-[var(--ui-text-muted)]',
    footer: 'flex shrink-0 items-center gap-3 border-t border-[var(--ui-border)] px-3 py-2 text-xs text-[var(--ui-text-muted)]',
    footerKey: 'flex items-center gap-1',
  },
})

export type CommandPaletteThemeSlots = keyof (typeof commandPaletteTheme)['slots']
