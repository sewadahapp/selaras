export interface IconRegistry {
  close: string
  check: string
  indeterminate: string
  chevronUp: string
  chevronDown: string
  chevronRight: string
  chevronLeft: string
  chevronsLeft: string
  chevronsRight: string
  loading: string
  search: string
  sortAscending: string
  sortDescending: string
  columns: string
  copy: string
  lightMode: string
  darkMode: string
  calendar: string
  clock: string
  plus: string
  minus: string
  success: string
  danger: string
  warning: string
  info: string
  user: string
  maximize: string
  minimize: string
  star: string
  upload: string
  file: string
  folder: string
  folderOpen: string
  more: string
  sidebarCollapse: string
}

// Hugeicons by default. One registry keyed by semantic purpose, not by
// component/slot - matches how --ui-* colors are a single shared layer
// rather than per-component tokens, so overriding app.config.icons.close
// once retheme every dismiss/clear/remove "x" glyph in the library
// together, instead of needing a separate override per component.
export const defaultIcons: IconRegistry = {
  close: 'hugeicons:cancel-01',
  check: 'hugeicons:tick-02',
  indeterminate: 'hugeicons:minus-sign',
  // Hugeicons' "arrow-*-01" set is the plain chevron shape (no shaft) -
  // matches the original caret look despite the name.
  chevronUp: 'hugeicons:arrow-up-01',
  chevronDown: 'hugeicons:arrow-down-01',
  chevronRight: 'hugeicons:arrow-right-01',
  chevronLeft: 'hugeicons:arrow-left-01',
  chevronsLeft: 'hugeicons:previous',
  chevronsRight: 'hugeicons:next',
  loading: 'hugeicons:loading-02',
  search: 'hugeicons:search-01',
  // "arrow-*-02" (shaft + arrowhead) - kept visually distinct from the
  // plain chevrons above, matching the original caret-vs-arrow split.
  sortAscending: 'hugeicons:arrow-up-02',
  sortDescending: 'hugeicons:arrow-down-02',
  columns: 'hugeicons:table-columns-split',
  copy: 'hugeicons:copy',
  lightMode: 'hugeicons:sun-01',
  darkMode: 'hugeicons:moon',
  calendar: 'hugeicons:calendar-01',
  clock: 'hugeicons:clock-01',
  plus: 'hugeicons:plus-sign',
  minus: 'hugeicons:minus-sign',
  success: 'hugeicons:checkmark-circle-01',
  danger: 'hugeicons:cancel-circle',
  warning: 'hugeicons:alert-circle',
  info: 'hugeicons:information-circle',
  user: 'hugeicons:user',
  // Four expanding corner brackets / two arrows converging - a matched
  // expand/collapse pair, not just any two vaguely-related glyphs.
  maximize: 'hugeicons:fullscreen',
  minimize: 'hugeicons:collapse',
  star: 'hugeicons:star',
  upload: 'hugeicons:upload-01',
  file: 'hugeicons:file-01',
  folder: 'hugeicons:folder-01',
  folderOpen: 'hugeicons:folder-open',
  more: 'hugeicons:more-horizontal',
  // A panel-with-a-shaded-column glyph reads as "sidebar" far more directly
  // than a generic double-chevron - DashboardSidebarToggle mirrors this one
  // horizontally (`scaleX(-1)`, not a rotation) once collapsed, rather than
  // swapping in hugeicons:sidebar-right-01. Confirmed by diffing both
  // icons' real path data: they're identical except every x-coordinate is
  // reflected around the icon's center (same y-coordinates throughout) -
  // a true mirror image, not a 180°-rotated one, which would put the
  // little nav-line details at the bottom instead of back at the top.
  sidebarCollapse: 'hugeicons:sidebar-left-01',
}
