---
title: Input
description: A text input with optional leading and trailing icons.
---

## Usage

::s-input{placeholder="Search..." icon="lucide:search"}
::

Wrap it in [FormField](/components/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically - see that page for details.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `string \| number` | - |
| `type` | `string` | `text` |
| `placeholder` | `string` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `ui` | `Partial<Record<'root' \| 'base' \| 'leadingIcon' \| 'trailingIcon', string \| object>>` | - |
