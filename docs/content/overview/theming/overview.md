---
title: Theming
description: Choose the right customization layer for your application.
order: 10
---

Selaras separates semantic CSS tokens, component styles, and behavior defaults. You can change a few values or supply a complete design system.

| Goal | Guide |
| --- | --- |
| Change surfaces, typography, radius, or shadows | [CSS tokens](/overview/theming/css-tokens) |
| Customize semantic colors or register a role | [Color roles](/overview/theming/color-roles) |
| Follow system appearance or switch light/dark | [Color modes](/overview/theming/color-modes) |
| Style one component or slot | [Component styling](/overview/theming/component-styling) |
| Share styles and defaults across the app | [Global configuration](/overview/theming/global-configuration) |
| Style a subtree independently | [Scoped themes](/overview/theming/scoped-themes) |
| Supply every theme input yourself | [Complete themes](/overview/theming/complete-themes) |

Start with the aggregate CSS import from [Installation](/overview/getting-started/installation). It supplies the default theme. For a complete owned theme, the structural entry retains component behavior and bindings while you provide the theme contract.

The documentation's Pelog, Slendro, and Degung presets demonstrate CSS and component configuration working together. They are documentation showcase themes, not additional named themes automatically installed into your application.
