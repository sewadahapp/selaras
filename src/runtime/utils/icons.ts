export interface IconRegistry {
  close: string
  check: string
  indeterminate: string
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
  plus: string
  minus: string
}

// Phosphor by default. One registry keyed by semantic purpose, not by
// component/slot - matches how --ui-* colors are a single shared layer
// rather than per-component tokens, so overriding app.config.icons.close
// once retheme every dismiss/clear/remove "x" glyph in the library
// together, instead of needing a separate override per component.
export const defaultIcons: IconRegistry = {
  close: 'ph:x',
  check: 'ph:check',
  indeterminate: 'ph:minus',
  chevronDown: 'ph:caret-down',
  chevronRight: 'ph:caret-right',
  chevronLeft: 'ph:caret-left',
  chevronsLeft: 'ph:caret-double-left',
  chevronsRight: 'ph:caret-double-right',
  loading: 'ph:spinner',
  search: 'ph:magnifying-glass',
  sortAscending: 'ph:arrow-up',
  sortDescending: 'ph:arrow-down',
  columns: 'ph:columns',
  copy: 'ph:copy',
  lightMode: 'ph:sun',
  darkMode: 'ph:moon',
  calendar: 'ph:calendar',
  plus: 'ph:plus',
  minus: 'ph:minus',
}
