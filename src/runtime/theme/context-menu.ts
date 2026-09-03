import { tv } from 'tailwind-variants'

export const contextMenuTheme = tv({
  slots: {
    // Same transient-popover layering tier as Dropdown - --ui-z-dropdown,
    // not a separate token of its own.
    content: 'z-[var(--ui-z-dropdown)] min-w-40 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] p-1 shadow-[var(--ui-shadow-md)] ring-1 ring-[var(--ui-border)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
    item: 'flex items-center gap-2 rounded-[var(--ui-radius-sm)] px-2 py-1.5 text-sm text-[var(--ui-text)] cursor-pointer select-none outline-none data-[highlighted]:bg-[var(--ui-bg-elevated)] data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    icon: 'size-4 shrink-0 text-[var(--ui-text-muted)]',
    separator: '-mx-1 my-1 h-px bg-[var(--ui-border)]',
  },
  variants: {
    // For a delete/remove-style action - same single flag Dropdown's own
    // theme uses, rather than the full 7-color palette Badge/Chip expose.
    destructive: {
      true: {
        item: 'text-[var(--ui-danger)] data-[highlighted]:bg-[var(--ui-danger-soft)]',
        icon: 'text-[var(--ui-danger)]',
      },
    },
  },
})

export type ContextMenuThemeSlots = keyof (typeof contextMenuTheme)['slots']
