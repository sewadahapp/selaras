---
title: Viewport previews
description: Try responsive examples without resizing your browser.
---

Choose a device, then open the team picker. The mobile viewport uses a modal;
the larger viewports use a popup.

::docs-viewport-preview{src="/examples/team-picker" title="Team picker" :height="420"}
::

The layer's `DocsViewportPreview` component accepts an example URL, custom
devices, an initial device, and a height. Use `v-model:device` in Vue to control
the selected viewport, or the toolbar slots to add actions.
