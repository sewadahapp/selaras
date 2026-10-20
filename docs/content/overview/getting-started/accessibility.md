---
title: Accessibility
description: Label controls, manage focus, and communicate changing content.
order: 90
---

Selaras builds on accessible primitives for keyboard interaction, focus management,
and ARIA relationships. Your application supplies meaningful labels, content,
validation rules, and the surrounding document structure.

## Label controls

Use `SFormField` for a visible label and associated help or error text:

```vue-html
<SFormField label="Email address" description="Used for project updates." :error="emailError">
  <SInput v-model="email" type="email" autocomplete="email" />
</SFormField>
```

The field associates its label, description, error, and invalid state with supported
controls. Place each independently labelled control in its own field. Give icon-only
actions an `aria-label` that describes the action, such as "Close settings".

A placeholder is a hint rather than a replacement for a visible field label.
For a standalone control without a visible label, supply `aria-label` or
`aria-labelledby`.

## Keep keyboard focus predictable

Use native buttons and links for actions and navigation. Avoid positive `tabindex`
values and preserve visible focus styles when customizing component slots.

Modal dialogs keep focus inside their content and restore focus to the opener when
closed. Escape dismisses the current dismissible layer. Give dialogs a `title` and,
when helpful, a `description`. An adaptive Select or Autocomplete owns its small-screen
presentation; consumers should not add a second focus trap around its popup content.

If a user action removes the focused control, explicitly move focus to a sensible
place in the new view after the DOM updates. The [EmptyState table example](/components/data/empty-state#table)
shows this when its "Add sample project" button disappears.

## Announce changing content

Keep a short status region mounted when asynchronously updating a collection:

```vue-html
<p role="status" class="sr-only">{{ resultMessage }}</p>
<STable :data="results" :loading="pending">
  <SColumn field="name" header="Name" />
  <template #empty>
    <SEmptyState title="No matching results" description="Try another search." />
  </template>
</STable>
```

Update `resultMessage` when the request completes, for example "3 results found".
Keep the message concise and leave focus where the user is working. Use an empty
state for the absence of results and a separate error message with a retry action
when a request fails.

Listbox, Select, and Autocomplete option lists are dedicated to selection. Put
interactive empty-state actions in a footer or a nearby toolbar.

## Themes and motion

Preserve readable contrast, focus indicators, and selected or invalid states when
overriding colors. Check your application in both light and dark modes, at narrow
widths, and with browser zoom. Avoid using color as the sole indicator of a state.

Standard component transitions and the documentation's dot grid respect reduced
motion. Custom animations added by your application should respect it as well.

## What we check

The repository's `test:a11y` browser suite combines axe checks for WCAG A/AA rules
through WCAG 2.2 with keyboard scenarios. It covers representative form fields,
validation descriptions, navigation, empty states, nested dialogs, and desktop and
mobile adaptive Select presentations. It also checks for browser and hydration
errors. Existing component browser tests cover additional interactions.

These checks provide a regression baseline. They do not establish that every
component combination or consumer theme meets every accessibility requirement.
Test your application's actual content with keyboard navigation and assistive
technology as well.
