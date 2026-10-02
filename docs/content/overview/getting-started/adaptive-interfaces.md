---
title: Adaptive interfaces
description: Opt into mobile modal presentation for common controls.
order: 70
---

The `adaptive` prop switches supported controls from their desktop popup to modal presentation below the configured breakpoint. It is opt-in; its default is `false`.

## Try it

Open these controls on a mobile viewport, or narrow your browser before opening them.

::component-example{name="adaptive-interfaces-basic"}
::

## Supported controls

| Component | Adaptive behavior |
| --- | --- |
| [Select](/components/forms/select) | Selection popup becomes a modal. |
| [Autocomplete](/components/forms/autocomplete) | Search and selection appear in a modal. |
| [Dropdown](/components/overlays/dropdown) | Menu actions appear in a modal. |
| [DatePicker](/components/forms/date-picker) | Date and time picker content appears in a modal. |
| [ColorPicker](/components/forms/color-picker) | Color controls appear in a modal. |

Models and item actions use the same API in either presentation. Other overlay components do not automatically acquire an `adaptive` prop.

## Breakpoint

The default is Tailwind's `md` breakpoint. Set `selaras.adaptive.breakpoint` in Nuxt configuration to choose another Tailwind breakpoint token. Define its length in CSS; see [Nuxt configuration](/overview/getting-started/nuxt-configuration#adaptive-breakpoint).

Server rendering starts with desktop presentation. The viewport is measured after mount, and an open adaptive control retains its chosen presentation until it closes. Test both viewport sizes and keyboard interaction in your application.
