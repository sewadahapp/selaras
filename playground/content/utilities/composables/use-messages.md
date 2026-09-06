---
title: useMessages
description: Override the text every component renders internally, across every language.
order: 40
---

Every visible string a component renders itself - "Clear", "No results
found", a Pagination page count, an aria-label a screen reader announces -
resolves from one registry, `useMessages()`, rather than being hardcoded
per component. Text you pass yourself (an item's own `label`, a column's
own header) is unaffected - this registry is only for text a component
supplies on its own.

## Usage

Override any key globally in `app.config.ts`:

```ts
export default defineAppConfig({
  messages: {
    clear: 'Effacer',
    search: 'Rechercher...',
  },
})
```

Only the keys you set are overridden; everything else keeps its English
default. This changes every component that uses that key at once -
setting `close` reskins the dismiss label on `Modal`, `Toast`, `Input`'s
clear button, and `CommandPalette`'s footer hint all together, rather than
needing a separate override for each.

There's no bundled translation for any other language - this registry is
the mechanism, not a set of ready-made locale files. A full translation is
a single object literal covering every key below.

## Registry

| Key | Default | Used by |
| --- | --- | --- |
| `loading` | `Loading` | Button/Switch's loading state |
| `clear` | `Clear` | Input, Select, DatePicker's clear button |
| `close` | `Close` | Modal, Toast, CommandPalette's footer hint |
| `colorModeToggle` | `Toggle color mode` | ColorModeToggle |
| `colorPicker` | `Color picker` | ColorPicker |
| `search` | `Search...` | CommandPalette, Autocomplete |
| `columns` | `Columns` | Table's column-toggle control |
| `filterPlaceholder` | `Filter...` | Table's filter input |
| `previous` | `Previous` | Pagination, ContentSurround |
| `next` | `Next` | Pagination, ContentSurround |
| `first` | `First` | Pagination |
| `last` | `Last` | Pagination |
| `pagination` | `Pagination` | Pagination's nav aria-label |
| `datePicker` | `Date picker` | DatePicker |
| `dateRangePicker` | `Date range picker` | DatePicker (range mode) |
| `timePicker` | `Time picker` | DatePicker (time section) |
| `pickTime` | `Pick a time` | DatePicker (timeOnly mode) |
| `previousMonth` | `Previous month` | DatePicker |
| `nextMonth` | `Next month` | DatePicker |
| `previousYear` | `Previous year` | DatePicker |
| `nextYear` | `Next year` | DatePicker |
| `previousDecade` | `Previous decade` | DatePicker (year view) |
| `nextDecade` | `Next decade` | DatePicker (year view) |
| `pickDate` | `Pick a date` | DatePicker |
| `chooseMonth` | `Choose month` | DatePicker (month view) |
| `chooseYear` | `Choose year` | DatePicker (year view) |
| `hour` | `Hour` | DatePicker's time stepper |
| `minute` | `Minute` | DatePicker's time stepper |
| `done` | `Done` | DatePicker's time section |
| `increment` | `Increment` | InputNumber's stepper |
| `decrement` | `Decrement` | InputNumber's stepper |
| `noOptions` | `No options` | Select, Autocomplete |
| `noResultsFound` | `No results found` | Autocomplete, CommandPalette |
| `noData` | `No data` | Table |
| `expandRow` | `Expand row` | Table |
| `collapseRow` | `Collapse row` | Table |
| `maximize` | `Maximize` | Modal's fullscreen toggle |
| `minimize` | `Minimize` | Modal's fullscreen toggle |
| `removeItem(label?)` | `Remove ${label}` / `Remove` | Chip, FileUpload's remove button |
| `moreItems(count)` | `+${count} more` | AvatarGroup's overflow indicator |
| `paginationInfo(page, total)` | `Page ${page} of ${total}` | Pagination |
| `codeTabFallback(index)` | `Tab ${index}` | Tabs (code block group) |
| `dropFiles` | `Drop files here or click to browse` | FileUpload |
| `invalidFileType(name)` | `${name}: invalid file type` | FileUpload |
| `invalidFileSize(name, max)` | `${name}: exceeds the ${max} size limit` | FileUpload |
| `tooManyFiles(max)` | `Only ${max} file(s) allowed` | FileUpload |
| `showMore` | `Show more` | ReadMore |
| `showLess` | `Show less` | ReadMore |
| `selectFile` | `Select a file to view its content` | FileTree |
| `toggleSidebar` | `Toggle sidebar` | DashboardSidebarToggle |
| `breadcrumb` | `Breadcrumb` | Breadcrumb's nav aria-label |
| `showHiddenBreadcrumbItems` | `Show hidden breadcrumb items` | Breadcrumb's overflow trigger |
| `commandPalette` | `Command palette` | CommandPalette's sr-only title |
| `navigate` | `Navigate` | CommandPalette's footer hint |
| `select` | `Select` | CommandPalette's footer hint |
| `onThisPage` | `On this page` | ContentToc's default heading |
| `upToSize(size)` | `Up to ${size}` | FileUpload's max-size hint |

There's deliberately no `am`/`pm` entry: `DatePicker`'s time section
derives that text directly from [`useLocale`](/utilities/composables/use-locale)
via `Intl`, so it always matches the same locale driving the hour-cycle
display next to it, rather than needing a separate translation kept in
sync by hand.

## API

```ts
function useMessages(): ComputedRef<MessageRegistry>
```

Returns the merged registry (your `app.config.messages` overrides applied
on top of the English defaults above) - use this if you're building your
own component and want it to respect the same overrides a consumer
already set, instead of hardcoding a string directly:

```vue
<script setup lang="ts">
const messages = useMessages()
</script>

<template>
  <button :aria-label="messages.close">
    ...
  </button>
</template>
```
