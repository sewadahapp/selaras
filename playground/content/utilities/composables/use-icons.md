---
title: useIcons
description: Override the icon set used internally across every component.
order: 30
---

Every internal icon this library renders itself - a button's loading
spinner, a chip's remove glyph, a select's dropdown chevron, a toast's
success/danger icon, and so on - resolves from one semantic-purpose
registry, `useIcons()`, rather than being hardcoded per component. `name`
props you set yourself (`SButton`'s `icon`, `SInput`'s `icon`, ...) are
unaffected - this registry is only for icons a component renders on its
own.

## Usage

Override any key globally in `app.config.ts`:

```ts
export default defineAppConfig({
  icons: {
    close: 'lucide:x',
    loading: 'lucide:loader-2',
  },
})
```

Only the keys you set are overridden; everything else keeps its
[Hugeicons](https://hugeicons.com) default. This changes every component
that uses that key at once - setting `close` reskins the dismiss icon on
`Modal`, `Toast`, `Input`'s clear button, and `Chip`'s remove button all
together, rather than needing a separate override for each.

## Registry

| Key | Default | Used by |
| --- | --- | --- |
| `close` | `hugeicons:cancel-01` | Modal, Toast, Chip, Input's clear button, CommandPalette |
| `check` | `hugeicons:tick-02` | Checkbox, Select's selected-item marker |
| `indeterminate` | `hugeicons:minus-sign` | Checkbox's indeterminate state |
| `chevronUp` | `hugeicons:arrow-up-01` | Accordion, InputNumber's stepper |
| `chevronDown` | `hugeicons:arrow-down-01` | Select, Autocomplete, DatePicker, InputNumber's stepper |
| `chevronRight` | `hugeicons:arrow-right-01` | Tree, NavigationMenu |
| `chevronLeft` | `hugeicons:arrow-left-01` | Pagination, DatePicker's month nav |
| `chevronsLeft` | `hugeicons:previous` | Pagination's first-page control |
| `chevronsRight` | `hugeicons:next` | Pagination's last-page control |
| `loading` | `hugeicons:loading-02` | Button/Switch's loading spinner |
| `search` | `hugeicons:search-01` | CommandPalette, Autocomplete |
| `sortAscending` | `hugeicons:arrow-up-02` | Table's sortable column headers |
| `sortDescending` | `hugeicons:arrow-down-02` | Table's sortable column headers |
| `columns` | `hugeicons:table-columns-split` | Table's column-toggle control |
| `copy` | `hugeicons:copy` | CodeButton |
| `lightMode` | `hugeicons:sun-01` | ColorModeToggle |
| `darkMode` | `hugeicons:moon` | ColorModeToggle |
| `calendar` | `hugeicons:calendar-01` | DatePicker |
| `clock` | `hugeicons:clock-01` | DatePicker's time picker |
| `plus` | `hugeicons:plus-sign` | InputNumber's stepper |
| `minus` | `hugeicons:minus-sign` | InputNumber's stepper |
| `success` | `hugeicons:checkmark-circle-01` | Toast, Alert |
| `danger` | `hugeicons:cancel-circle` | Toast, Alert |
| `warning` | `hugeicons:alert-circle` | Toast, Alert |
| `info` | `hugeicons:information-circle` | Toast, Alert |
| `user` | `hugeicons:user` | Avatar's fallback |
| `maximize` | `hugeicons:fullscreen` | Modal's fullscreen toggle |
| `minimize` | `hugeicons:collapse` | Modal's fullscreen toggle |
| `star` | `hugeicons:star` | Rating |
| `upload` | `hugeicons:upload-01` | FileUpload |
| `file` | `hugeicons:file-01` | FileUpload, FileTree |
| `folder` | `hugeicons:folder-01` | FileTree |
| `folderOpen` | `hugeicons:folder-open` | FileTree |
| `more` | `hugeicons:more-horizontal` | Table's row-actions trigger |
| `sidebarCollapse` | `hugeicons:sidebar-left-01` | DashboardSidebarToggle |

## API

```ts
function useIcons(): ComputedRef<IconRegistry>
```

Returns the merged registry (your `app.config.icons` overrides applied
on top of the Hugeicons defaults above) - use this if you're building
your own component and want it to respect the same overrides a consumer
already set, instead of hardcoding an icon name directly:

```vue
<script setup lang="ts">
const icons = useIcons()
</script>

<template>
  <SIcon :name="icons.close" />
</template>
```
