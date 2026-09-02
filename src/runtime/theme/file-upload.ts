import { tv } from 'tailwind-variants'

export const fileUploadTheme = tv({
  slots: {
    root: 'flex w-full flex-col gap-3',
    // The real drop target and click-to-browse trigger - a <button>,
    // not a <div>, so keyboard focus/activation (Enter/Space) comes free
    // instead of needing hand-rolled keydown handling. dragging (a
    // component-set data attribute, not a native one) recolors it
    // toward `color` - see the color variant below.
    dropzone: 'flex w-full flex-col items-center justify-center gap-2 rounded-[var(--ui-radius-md)] border-2 border-dashed border-[var(--ui-border)] p-6 text-center transition-colors hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
    icon: 'text-[var(--ui-text-muted)]',
    label: 'font-medium text-[var(--ui-text)]',
    description: 'text-[var(--ui-text-muted)]',
    // Purely an implementation detail - visually hidden and (via
    // tabindex="-1" in FileUpload.vue) not independently tab-reachable
    // either.
    // The dropzone <button> wrapping it is the real focusable, Enter/
    // Space-activatable control (free native semantics); this input just
    // gets programmatically .click()'d to open the OS file dialog.
    input: 'sr-only',
    fileList: 'flex w-full flex-col gap-2',
    file: 'flex items-center gap-3 rounded-[var(--ui-radius-md)] border border-[var(--ui-border)] p-2',
    fileThumbnail: 'size-8 shrink-0 rounded-[var(--ui-radius-sm)] object-cover',
    fileIcon: 'size-8 shrink-0 text-[var(--ui-text-muted)]',
    fileInfo: 'flex min-w-0 flex-1 flex-col',
    fileName: 'truncate text-[var(--ui-text)]',
    fileSize: 'text-[var(--ui-text-muted)]',
    fileRemove: 'shrink-0',
  },
  variants: {
    size: {
      sm: { dropzone: 'p-4 text-xs', icon: 'size-6', fileThumbnail: 'size-7', fileIcon: 'size-7', fileName: 'text-xs', fileSize: 'text-xs' },
      md: { dropzone: 'p-6 text-sm', icon: 'size-8', fileThumbnail: 'size-8', fileIcon: 'size-8', fileName: 'text-sm', fileSize: 'text-xs' },
      lg: { dropzone: 'p-8 text-base', icon: 'size-10', fileThumbnail: 'size-10', fileIcon: 'size-10', fileName: 'text-base', fileSize: 'text-sm' },
    },
    // Unlike Input/PinInput's own `color` (focus-ring only, resting
    // stays neutral), FileUpload also tints the icon at rest - a
    // dropzone has no "typing" affordance to make a focus-only color
    // legible in practice, and a Color example that only ever shows 7
    // identical-looking boxes until you interact with each one isn't
    // actually demonstrating anything - confirmed as a real problem via
    // direct user feedback, not just a style preference.
    color: {
      primary: { icon: 'text-[var(--ui-primary)]', dropzone: 'focus-visible:ring-[var(--ui-primary)] data-[dragging]:border-[var(--ui-primary)] data-[dragging]:bg-[var(--ui-primary-soft)]' },
      neutral: { icon: 'text-[var(--ui-bg-inverted)]', dropzone: 'focus-visible:ring-[var(--ui-bg-inverted)] data-[dragging]:border-[var(--ui-bg-inverted)] data-[dragging]:bg-[var(--ui-bg-elevated)]' },
      secondary: { icon: 'text-[var(--ui-secondary)]', dropzone: 'focus-visible:ring-[var(--ui-secondary)] data-[dragging]:border-[var(--ui-secondary)] data-[dragging]:bg-[var(--ui-secondary-soft)]' },
      success: { icon: 'text-[var(--ui-success)]', dropzone: 'focus-visible:ring-[var(--ui-success)] data-[dragging]:border-[var(--ui-success)] data-[dragging]:bg-[var(--ui-success-soft)]' },
      danger: { icon: 'text-[var(--ui-danger)]', dropzone: 'focus-visible:ring-[var(--ui-danger)] data-[dragging]:border-[var(--ui-danger)] data-[dragging]:bg-[var(--ui-danger-soft)]' },
      info: { icon: 'text-[var(--ui-info)]', dropzone: 'focus-visible:ring-[var(--ui-info)] data-[dragging]:border-[var(--ui-info)] data-[dragging]:bg-[var(--ui-info-soft)]' },
      warning: { icon: 'text-[var(--ui-warning)]', dropzone: 'focus-visible:ring-[var(--ui-warning)] data-[dragging]:border-[var(--ui-warning)] data-[dragging]:bg-[var(--ui-warning-soft)]' },
    },
    // Declared last (after color) so tailwind-merge lets its own border
    // override win over color's - matches Input's own documented
    // reasoning for this order.
    invalid: {
      true: { dropzone: 'border-[var(--ui-danger)] focus-visible:ring-[var(--ui-danger)]' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export type FileUploadThemeSlots = keyof (typeof fileUploadTheme)['slots']
