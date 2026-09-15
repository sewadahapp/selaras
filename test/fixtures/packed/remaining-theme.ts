import type { ThemeConfiguration } from '@sewadah/selaras/theme'

// Keep this literal contract in the installed consumer: generated roles must
// survive imports, and every remaining public recipe gets checked together.
export const remainingTheme = {
  ui: {
    alertDialog: { compoundVariants: [{ transition: false, class: { content: 'outline-dashed' } }] },
    codeButton: { slots: { root: 'outline-dotted' } },
    codeTree: { slots: { root: 'outline-double' } },
    commandPalette: { slots: { content: 'outline-solid' } },
    datePicker: { compoundVariants: [{ size: 'sm', class: { field: 'outline-offset-2', heading: 'tracking-widest', mobileContent: 'outline-offset-4' } }] },
    fileTree: { compoundVariants: [{ color: 'published', selected: true, isNested: true, class: { row: 'tracking-widest' } }] },
    prose: { slots: { pre: 'tracking-tight' }, compoundVariants: [{ color: 'published', class: { h2: 'outline-dashed' } }] },
    splitter: { compoundVariants: [{ direction: 'vertical', class: { root: 'outline-dotted' } }] },
    splitterPanel: { slots: { root: 'outline-double' } },
    splitterResizeHandle: { compoundVariants: [{ color: 'published', direction: 'vertical', class: { root: 'outline-solid' } }] },
    table: { compoundVariants: [{ color: 'published', size: 'sm', striped: true, gridlines: true, scrollable: true, class: { root: 'outline-offset-2', expandButton: 'outline-offset-4', thSortable: 'tracking-widest' } }] },
    tree: { compoundVariants: [{ color: 'published', size: 'sm', class: { root: 'outline-offset-4' } }] },
  },
} as const satisfies ThemeConfiguration

const invalid: ThemeConfiguration[] = [
  // @ts-expect-error DatePicker has distinct field/day roles, not one color condition
  { ui: { datePicker: { compoundVariants: [{ color: 'published', class: { field: 'p-2' } }] } } },
  // @ts-expect-error behavioral ownership is not a recipe condition
  { ui: { commandPalette: { compoundVariants: [{ open: true, class: { content: 'p-2' } }] } } },
  // @ts-expect-error TanStack state is not part of the visual recipe contract
  { ui: { table: { compoundVariants: [{ pageIndex: 1, class: { root: 'p-2' } }] } } },
  // @ts-expect-error arbitrary slots must remain rejected
  { ui: { prose: { slots: { paragraph: 'p-2' } } } },
  // @ts-expect-error this registry entry does not add component defaults
  { defaults: { tree: { size: 'sm' } } },
  // @ts-expect-error internal renderers use their public parent's recipe
  { ui: { datePickerCalendarBody: { slots: { root: 'p-2' } } } },
  // @ts-expect-error custom-role conditions still require registration
  { ui: { tree: { compoundVariants: [{ color: 'not-published', class: { root: 'p-2' } }] } } },
]
void invalid
