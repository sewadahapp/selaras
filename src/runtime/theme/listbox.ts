import { tv } from 'tailwind-variants'

export const listboxTheme = tv({
  slots: {
    root: 'flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)] bg-[var(--selaras-resolved-surface-default)] text-[var(--selaras-resolved-text-default)]',
    header: 'flex items-center justify-between gap-2 border-b border-[var(--selaras-resolved-border-default)] px-3 py-2',
    footer: 'border-t border-[var(--selaras-resolved-border-default)] px-3 py-2',
    searchWrapper: 'flex items-center gap-2 border-b border-[var(--selaras-resolved-border-default)] px-3',
    searchInput: 'h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--selaras-resolved-text-muted)]',
    content: 'max-h-72 min-h-0 overflow-y-auto p-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--_selaras-color-focus)]',
    group: '',
    groupLabel: 'px-2 py-2 text-xs font-medium text-[var(--selaras-resolved-text-muted)]',
    item: 'my-0.5 flex w-full min-w-0 items-center gap-2 rounded-[var(--selaras-resolved-radius-sm)] px-2 py-2 outline-none cursor-pointer select-none transition-colors data-[highlighted]:bg-[var(--selaras-resolved-surface-elevated)] data-[state=checked]:bg-[var(--_selaras-color-subtle)] data-[state=checked]:text-[var(--_selaras-color-on-subtle)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    label: 'truncate',
    description: 'text-xs text-[var(--selaras-resolved-text-muted)]',
    itemContent: 'flex min-w-0 flex-1 flex-col gap-0.5',
    icon: 'size-4 shrink-0',
    indicator: 'ms-auto flex size-4 shrink-0 items-center justify-center text-[var(--_selaras-color-indicator)]',
    checkbox: 'pointer-events-none flex size-4 shrink-0 items-center justify-center rounded-[var(--selaras-resolved-radius-sm)] border border-[var(--selaras-resolved-border-default)] data-[state=checked]:border-[var(--_selaras-color-fill)] data-[state=checked]:bg-[var(--_selaras-color-fill)] data-[state=checked]:text-[var(--_selaras-color-on-fill)]',
    empty: 'px-3 py-6 text-center text-sm text-[var(--selaras-resolved-text-muted)]',
  },
  variants: {
    size: { sm: { item: 'py-1.5 text-xs' }, md: { item: 'text-sm' }, lg: { item: 'py-2.5 text-base' } },
    color: { primary: '', secondary: '', neutral: '', success: '', danger: '', info: '', warning: '' },
    invalid: { true: { root: 'border-[var(--_selaras-color-border)]' } },
  },
  defaultVariants: { size: 'md', color: 'primary' },
})

export type ListboxThemeSlots = keyof (typeof listboxTheme)['slots']
