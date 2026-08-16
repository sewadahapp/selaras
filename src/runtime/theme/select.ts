import { tv } from 'tailwind-variants'

export const selectTheme = tv({
  slots: {
    trigger: 'inline-flex w-full items-center justify-between gap-2 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] px-3 text-sm ring-1 ring-inset ring-[var(--ui-border)] outline-none transition-[color,background-color,box-shadow] hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus:ring-2 focus:ring-[var(--ui-primary)] data-[state=open]:ring-2 data-[state=open]:ring-[var(--ui-primary)] disabled:opacity-50 disabled:pointer-events-none data-[placeholder]:text-[var(--ui-text-muted)]',
    value: 'truncate text-[var(--ui-text)]',
    icon: 'shrink-0 text-[var(--ui-text-muted)]',
    content: 'z-50 overflow-hidden rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] shadow-[var(--ui-shadow-md)] ring-1 ring-[var(--ui-border)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    viewport: 'p-1',
    item: 'relative flex items-center gap-2 rounded-[var(--ui-radius-sm)] py-1.5 pl-2 pr-8 text-sm text-[var(--ui-text)] outline-none cursor-pointer select-none data-[highlighted]:bg-[var(--ui-bg-elevated)] data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    itemIndicator: 'absolute right-2 flex items-center text-[var(--ui-primary)]',
  },
  variants: {
    size: {
      sm: { trigger: 'h-8' },
      md: { trigger: 'h-10' },
      lg: { trigger: 'h-11 text-base' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type SelectSlots = keyof (typeof selectTheme)['slots']
