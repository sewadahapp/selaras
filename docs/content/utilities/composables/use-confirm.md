---
title: useConfirm
description: Ask for confirmation from an action handler.
order: 12
---

`useConfirm()` opens the library's accessible `<SAlertDialog>` and resolves a
boolean. Use it when the action needs a yes/no decision but should not own a
dialog and its state in the template.

## Usage

```vue
<script setup lang="ts">
const { confirm } = useConfirm()

async function handleDelete() {
  const accepted = await confirm({
    title: 'Delete this project?',
    description: 'This action cannot be undone.',
    confirmLabel: 'Delete project',
    confirmColor: 'danger',
    icon: 'hugeicons:delete-02',
  })

  if (!accepted)
    return

  await deleteProject()
}
</script>
```

Only an explicit confirmation resolves `true`. Cancel, Escape, or the renderer
being unmounted resolves `false`. The title defaults to the localized
`confirmation` message; the action and cancel labels use the same `continue`
and `cancel` messages as `<SAlertDialog>`.

## API

```ts
function useConfirm(): {
  confirm: (options?: UseConfirmOptions) => Promise<boolean>
}
```

### `UseConfirmOptions`

| Option | Type | Default |
| --- | --- | --- |
| `title` | `string` | localized “Confirm action” |
| `description` | `string` | - |
| `confirmLabel` | `string` | localized continue message |
| `cancelLabel` | `string` | localized cancel message |
| `confirmColor` | `ColorRole` | component default |
| `icon` | `string` | - |

The composable is client-only. It uses the same `<SAlertDialog>` markup and
theme as declarative dialogs, and snapshots the caller's active `<STheme>`
while it is open. Like the other programmatic overlays, it requires `<SApp>`
once around the app root.

## Setup

```vue-html
<SApp>
  <NuxtPage />
</SApp>
```
