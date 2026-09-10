---
title: TypeScript
description: Importing a component's Props, Emits and Slots types.
order: 40
---

Every component exports named, documented `Props`/`Emits`/`Slots`
interfaces (`ButtonProps`, `ModalEmits`, `PopoverSlots`, ...) - useful when
you're wrapping a component, forwarding its props from your own, or just
want autocomplete on an object you're building up before passing it down.

## From the `@sewadah/selaras/types` barrel

The simplest path - one import for every component's types:

```ts
import type { ModalEmits, ModalProps, PopoverSlots } from '@sewadah/selaras/types'
```

## From a specific component

Each component's `.vue` file is also a valid type-only import path, if you
only need one component and don't want the rest pulled into scope:

```ts
import type { PopoverProps } from '@sewadah/selaras/components/Popover.vue'
```

## Module options

The module's own configuration type (the shape of the `selaras` key in
`nuxt.config.ts`, see [Installation](/overview/installation)) is exported
from the package root:

```ts
import type { ModuleOptions } from '@sewadah/selaras'
```
