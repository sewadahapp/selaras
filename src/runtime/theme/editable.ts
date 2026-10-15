import { tv } from 'tailwind-variants'

export const editableTheme = tv({
  slots: {
    root: 'relative inline-flex w-full items-start gap-2',
    area: 'relative min-w-0 flex-1',
    preview: 'flex w-full items-center rounded-[var(--selaras-resolved-radius-md)] bg-transparent text-start text-[var(--selaras-resolved-text-default)] outline-none transition-colors hover:bg-[var(--selaras-resolved-surface-elevated)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--_selaras-color-focus)] disabled:opacity-50 disabled:cursor-not-allowed',
    input: 'w-full rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-default)] text-[var(--selaras-resolved-text-default)] ring-1 ring-inset ring-[var(--selaras-resolved-border-default)] placeholder:text-[var(--selaras-resolved-text-muted)] outline-none transition-[color,background-color,box-shadow] not-focus:hover:ring-[var(--selaras-resolved-border-hover)] hover:bg-[var(--selaras-resolved-surface-elevated)] focus:ring-2 focus:ring-[var(--_selaras-color-focus)] disabled:opacity-50 disabled:pointer-events-none',
    controls: 'flex shrink-0 items-center gap-1',
    edit: '',
    submit: '',
    cancel: '',
  },
  variants: {
    size: {
      sm: { preview: 'min-h-8 px-2.5 text-sm', input: 'h-8 px-2.5 text-sm' },
      md: { preview: 'min-h-10 px-3 text-sm', input: 'h-10 px-3 text-sm', controls: 'py-1' },
      lg: { preview: 'min-h-11 px-3.5 text-base', input: 'h-11 px-3.5 text-base', controls: 'py-0.5' },
    },
    color: { primary: '', secondary: '', neutral: '', success: '', danger: '', warning: '', info: '' },
    multiline: { true: { preview: 'whitespace-pre-wrap break-words py-2', input: 'h-auto py-2' } },
    empty: { true: { preview: 'text-[var(--selaras-resolved-text-muted)]' } },
    invalid: { true: { input: 'ring-[var(--_selaras-color-border)] focus:ring-[var(--_selaras-color-focus)]' } },
  },
  defaultVariants: { size: 'md', color: 'primary' },
})

export type EditableThemeSlots = keyof (typeof editableTheme)['slots']
