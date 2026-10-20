---
title: EmptyState
description: Explain an empty collection or unmatched search and offer a next step.
order: 28
---

## Usage

Use `SEmptyState` when a collection has no items or a search has no matches. Provide
your own title, description, optional icon, and actions.

::component-example{name="empty-state-basic"}
::

```vue-html
<SEmptyState title="No projects yet" description="Create your first project." />
```

The component has no border or background by default, so it fits inside a table,
list, card, or page. Add a surrounding `SCard` or override `ui.root` for a frame.

### Table

Place it in Table's `empty` slot. Actions can update the same data source used by
the table; the empty state disappears when rows become available.

::component-example{name="empty-state-table"}
::

### Search results

Use `empty-filter` for an unmatched search and `empty` for an empty collection in
Listbox, Select, Autocomplete, or TransferList. Their existing slots keep control
of when the state is shown.

::component-example{name="empty-state-search"}
::

In listboxes and popup lists, place interactive actions in a footer or an external
toolbar. Keep the option list dedicated to selection; the example uses Listbox's
`footer` slot for its clear action.

### Icons and custom content

`icon` accepts a Nuxt Icon name. The `icon` slot replaces it with a decorative
illustration. Customize its dimensions through `ui.icon`.

The title and description slots replace their corresponding props. The default
slot adds content below the description; `actions` places controls below it.

::component-example{name="empty-state-custom"}
::

### Customization

Change a single instance with `:ui`:

```vue-html
<SEmptyState title="No results" :ui="{ root: 'py-6', title: 'text-sm' }" />
```

Share styles through `app.config.ts` or scope them with `STheme`:

```ts
export default defineAppConfig({
  selaras: {
    ui: {
      emptyState: { slots: { root: 'py-8', title: 'font-medium' } },
    },
  },
})
```

## Accessibility

The component does not set a heading level or a live-region role. Choose a
heading that fits the surrounding page through the `title` slot. Icons and
illustrations are decorative and hidden from assistive technology; include their
meaning in the title or description.

For asynchronously changing results, keep a short `role="status"` message mounted
next to the collection and update its text. This announces the change without
moving focus or repeatedly announcing the empty state's action controls.

Use descriptive labels for actions. If an action removes the empty state and its
focused button, move focus to an appropriate control in the newly displayed view.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | - |
| `description` | `string` | - |
| `icon` | `string` | - |
| `ui` | `Partial<Record<EmptyStateSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| `icon` | Decorative icon or illustration; replaces `icon` |
| `title` | Replaces the title; supports heading markup |
| `description` | Replaces the description |
| `default` | Additional content below the description |
| `actions` | Buttons, links, or other actions |

The available `ui` slots are `root`, `icon`, `content`, `title`, `description`, and
`actions`. Native attributes and listeners are forwarded to the root element.
