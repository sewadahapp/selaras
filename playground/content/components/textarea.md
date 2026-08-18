---
title: Textarea
description: A multi-line text input, matching Input's border interaction pattern.
---

## Usage

::s-textarea{placeholder="Write something..."}
::

Wrap it in [FormField](/components/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `string` | - |
| `placeholder` | `string` | - |
| `rows` | `number` | `3` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `ui` | `Partial<Record<'base', string \| object>>` | - |
