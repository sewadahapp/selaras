---
title: FileUpload
description: A drag-and-drop dropzone for selecting files - selection and validation only, uploading to a server is left to you.
order: 21.5
---

## Usage

`v-model` is always a `File[]`, even for a single file - click the
dropzone or drag files onto it:

::component-example{name="file-upload-basic"}
::

```vue
<script setup lang="ts">
const files = ref<File[]>([])
</script>

<template>
  <SFileUpload v-model="files" />
</template>
```

`FileUpload` only selects and validates files - actually sending them
to a server is up to you (a plain `fetch`/`FormData` call using
whatever's in `v-model`, whenever you want to trigger it).

### Multiple files

`multiple` allows selecting more than one file at once (each new
selection or drop adds to the list rather than replacing it);
`max-files` caps how many are allowed in total:

::component-example{name="file-upload-multiple"}
::

```vue-html
<SFileUpload v-model="files" multiple :max-files="4" />
```

### Validation

`accept` (comma-separated MIME types/wildcards like `image/*`, or
extensions like `.pdf`) and `max-size` (bytes) reject files that don't
match - applied to both the native file dialog and anything dropped
(drops bypass the dialog's own filtering entirely). Rejected files
never reach `v-model` - listen for `@error` to find out why and surface
it however you like:

::component-example{name="file-upload-validation"}
::

```vue-html
<SFileUpload
  v-model="files"
  accept="image/*"
  :max-size="1024 * 1024"
  @error="(rejected) => console.log(rejected)"
/>
```

### Color

::component-example{name="file-upload-color"}
::

```vue-html
<SFileUpload color="success" />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `File[]` | - |
| `accept` | `string` | - |
| `multiple` | `boolean` | `false` |
| `maxFiles` | `number` | - |
| `maxSize` | `number` | - |
| `preview` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `primary` |
| `name` | `string` | - |
| `required` | `boolean` | `false` |
| `ui` | `Partial<Record<FileUploadSlot, string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `File[]` | Fires when files are added or removed |
| `error` | `{ file: File, reason: string }[]` | Fires when one or more files are rejected |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `{ isDragging }` | Replaces the dropzone's own icon/label/description content |
| `file` | `{ file, index, remove }` | Replaces one file row's content |
