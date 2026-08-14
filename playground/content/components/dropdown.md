---
title: Dropdown
description: A menu of grouped actions built on Reka UI's DropdownMenu primitive.
---

## Usage

See it live on the [home page](/).

```vue
<template>
  <SDropdown
    :items="[
      [{ label: 'Edit', icon: 'lucide:pencil' }, { label: 'Duplicate', icon: 'lucide:copy' }],
      [{ label: 'Delete', icon: 'lucide:trash-2' }],
    ]"
  >
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
```

Items are an array of groups — a separator is rendered between each group.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; icon?: string; disabled?: boolean; onSelect?: () => void }[][]` | - |
| `ui` | `Partial<Record<'content' \| 'item' \| 'icon' \| 'separator', string \| object>>` | - |
