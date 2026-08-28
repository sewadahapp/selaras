export interface MessageRegistry {
  loading: string
  clear: string
  close: string
  colorModeToggle: string
  search: string
  columns: string
  filterPlaceholder: string
  previous: string
  next: string
  first: string
  last: string
  pagination: string
  datePicker: string
  dateRangePicker: string
  previousMonth: string
  nextMonth: string
  previousYear: string
  nextYear: string
  previousDecade: string
  nextDecade: string
  pickDate: string
  chooseMonth: string
  chooseYear: string
  hour: string
  minute: string
  am: string
  pm: string
  done: string
  increment: string
  decrement: string
  noOptions: string
  noResultsFound: string
  noData: string
  expandRow: string
  collapseRow: string
  /** A single removed/removable item's accessible name - `label` is omitted for a bare, unlabeled control (matches Chip's own existing fallback). */
  removeItem: (label?: string) => string
  moreItems: (count: number) => string
  paginationInfo: (page: number, total: number) => string
  codeTabFallback: (index: number) => string
}

// One registry keyed by semantic purpose, mirroring icons.ts exactly (see
// its own comment for the reasoning - a single app.config.messages.clear
// override reaches every "Clear" button in the library together, instead
// of a separate override per component). Function-valued entries are the
// ones needing interpolation (a label, a count, a page number) - a plain
// string can't carry that, unlike every icons.ts entry which is just a
// static name.
export const defaultMessages: MessageRegistry = {
  loading: 'Loading',
  clear: 'Clear',
  close: 'Close',
  colorModeToggle: 'Toggle color mode',
  search: 'Search...',
  columns: 'Columns',
  filterPlaceholder: 'Filter...',
  previous: 'Previous',
  next: 'Next',
  first: 'First',
  last: 'Last',
  pagination: 'Pagination',
  datePicker: 'Date picker',
  dateRangePicker: 'Date range picker',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  previousDecade: 'Previous decade',
  nextDecade: 'Next decade',
  pickDate: 'Pick a date',
  chooseMonth: 'Choose month',
  chooseYear: 'Choose year',
  hour: 'Hour',
  minute: 'Minute',
  am: 'AM',
  pm: 'PM',
  done: 'Done',
  increment: 'Increment',
  decrement: 'Decrement',
  noOptions: 'No options',
  noResultsFound: 'No results found',
  noData: 'No data',
  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  removeItem: label => label ? `Remove ${label}` : 'Remove',
  moreItems: count => `+${count} more`,
  paginationInfo: (page, total) => `Page ${page} of ${total}`,
  codeTabFallback: index => `Tab ${index}`,
}
