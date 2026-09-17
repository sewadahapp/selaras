import { tv } from 'tailwind-variants'

export const commandPaletteTheme = tv({
  slots: {
    overlay: 'fixed inset-0 z-[var(--selaras-resolved-z-modal-overlay)] bg-[var(--selaras-resolved-scrim)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
    // Top-anchored (not vertically centered like Modal) - the conventional
    // command-palette position, and it means the dialog doesn't visibly
    // jump up and down as the result list grows/shrinks while typing.
    // The search input is the palette's only editor. Keep focus local to the
    // editor rather than tinting the palette's whole dialog frame or divider.
    content: 'fixed left-1/2 top-24 z-[var(--selaras-resolved-z-modal)] flex max-h-[min(28rem,calc(100vh-8rem))] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 flex-col overflow-hidden rounded-[var(--selaras-resolved-radius-lg)] bg-[var(--selaras-resolved-surface-default)] shadow-[var(--selaras-resolved-shadow-lg)] focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    header: 'flex shrink-0 items-center gap-2 border-b border-[var(--selaras-resolved-border-default)] px-4',
    searchIcon: 'size-4.5 shrink-0 text-[var(--selaras-resolved-text-muted)]',
    input: 'h-12 flex-1 rounded-[var(--selaras-resolved-radius-sm)] bg-transparent text-sm text-[var(--selaras-resolved-text-default)] placeholder:text-[var(--selaras-resolved-text-muted)] outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--_selaras-color-focus)]',
    list: 'flex-1 overflow-y-auto p-1',
    group: 'py-1',
    groupLabel: 'px-2 py-1 text-xs font-medium text-[var(--selaras-resolved-text-muted)]',
    item: 'flex items-center gap-2 rounded-[var(--selaras-resolved-radius-sm)] px-2 py-2 text-sm text-[var(--selaras-resolved-text-default)] cursor-pointer select-none outline-none data-[highlighted]:bg-[var(--selaras-resolved-surface-elevated)] data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    itemIcon: 'size-4 shrink-0 text-[var(--selaras-resolved-text-muted)]',
    itemLabel: 'flex-1',
    itemShortcut: 'flex shrink-0 items-center gap-1',
    empty: 'p-6 text-center text-sm text-[var(--selaras-resolved-text-muted)]',
    footer: 'flex shrink-0 items-center gap-3 border-t border-[var(--selaras-resolved-border-default)] px-3 py-2 text-xs text-[var(--selaras-resolved-text-muted)]',
    footerKey: 'flex items-center gap-1',
  },
})

export type CommandPaletteThemeSlots = keyof (typeof commandPaletteTheme)['slots']
