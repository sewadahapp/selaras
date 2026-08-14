---
title: Input
description: A text input with optional leading and trailing icons.
---

## Usage

::s-input{placeholder="Search..." icon="lucide:search"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `string \| number` | - |
| `type` | `string` | `text` |
| `placeholder` | `string` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `ui` | `Partial<Record<'root' \| 'base' \| 'leadingIcon' \| 'trailingIcon', string \| object>>` | - |
