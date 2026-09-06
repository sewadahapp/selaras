export interface MessageRegistry {
  loading: string
  clear: string
  close: string
  colorModeToggle: string
  colorPicker: string
  colorPickerDescription: string
  search: string
  searchDescription: string
  columns: string
  filterPlaceholder: string
  previous: string
  next: string
  first: string
  last: string
  pagination: string
  datePicker: string
  datePickerDescription: string
  dateRangePicker: string
  dateRangePickerDescription: string
  timePicker: string
  timePickerDescription: string
  pickTime: string
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
  done: string
  increment: string
  decrement: string
  noOptions: string
  noResultsFound: string
  noData: string
  expandRow: string
  collapseRow: string
  maximize: string
  minimize: string
  /** A single removed/removable item's accessible name - `label` is omitted for a bare, unlabeled control (matches Chip's own existing fallback). */
  removeItem: (label?: string) => string
  moreItems: (count: number) => string
  paginationInfo: (page: number, total: number) => string
  codeTabFallback: (index: number) => string
  dropFiles: string
  invalidFileType: (name: string) => string
  invalidFileSize: (name: string, max: string) => string
  tooManyFiles: (max: number) => string
  showMore: string
  showLess: string
  selectFile: string
  toggleSidebar: string
  breadcrumb: string
  showHiddenBreadcrumbItems: string
  commandPalette: string
  commandPaletteDescription: string
  navigate: string
  select: string
  onThisPage: string
  upToSize: (size: string) => string
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
  colorPicker: 'Color picker',
  colorPickerDescription: 'Drag to adjust hue, saturation, and lightness',
  search: 'Search...',
  searchDescription: 'Type to filter, then use arrow keys and enter to select',
  columns: 'Columns',
  filterPlaceholder: 'Filter...',
  previous: 'Previous',
  next: 'Next',
  first: 'First',
  last: 'Last',
  pagination: 'Pagination',
  datePicker: 'Date picker',
  datePickerDescription: 'Use arrow keys to navigate days, enter to select',
  dateRangePicker: 'Date range picker',
  dateRangePickerDescription: 'Use arrow keys to navigate days, enter to select a start and end date',
  timePicker: 'Time picker',
  timePickerDescription: 'Use arrow keys to adjust the highlighted field',
  pickTime: 'Pick a time',
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
  done: 'Done',
  increment: 'Increment',
  decrement: 'Decrement',
  noOptions: 'No options',
  noResultsFound: 'No results found',
  noData: 'No data',
  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  maximize: 'Maximize',
  minimize: 'Minimize',
  removeItem: label => label ? `Remove ${label}` : 'Remove',
  moreItems: count => `+${count} more`,
  paginationInfo: (page, total) => `Page ${page} of ${total}`,
  codeTabFallback: index => `Tab ${index}`,
  dropFiles: 'Drop files here or click to browse',
  invalidFileType: name => `${name}: invalid file type`,
  invalidFileSize: (name, max) => `${name}: exceeds the ${max} size limit`,
  tooManyFiles: max => `Only ${max} file${max === 1 ? '' : 's'} allowed`,
  showMore: 'Show more',
  showLess: 'Show less',
  selectFile: 'Select a file to view its content',
  toggleSidebar: 'Toggle sidebar',
  breadcrumb: 'Breadcrumb',
  showHiddenBreadcrumbItems: 'Show hidden breadcrumb items',
  commandPalette: 'Command palette',
  commandPaletteDescription: 'Search for a command and press enter',
  navigate: 'Navigate',
  select: 'Select',
  onThisPage: 'On this page',
  upToSize: size => `Up to ${size}`,
}
