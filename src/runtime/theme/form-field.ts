import { tv } from 'tailwind-variants'

export const formFieldTheme = tv({
  slots: {
    root: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-[var(--ui-text)]',
    required: 'ml-0.5 text-[var(--ui-danger)]',
    container: '',
    hint: 'text-xs text-[var(--ui-text-muted)]',
    error: 'text-xs text-[var(--ui-danger)]',
  },
})

export type FormFieldSlots = keyof (typeof formFieldTheme)['slots']
