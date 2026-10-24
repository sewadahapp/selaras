# Public API documentation audit

Reviewed 23 October 2026 against the source at `c04a2bf`, plus this audit's fixes.
Package versions: Selaras 1.1.0, docs layer 1.3.3, MCP server 0.1.1.
This is an audit record; it does not announce a release or a deployed change.

## Scope and method

- Compared all 97 public component names with the package export boundary,
  Nuxt registration exclusions, public type re-exports, and their guide paths.
- Reviewed direct named prop declarations against guide API tables. Manually
  checked inherited Select/Autocomplete contracts, Calendar defaults, scoped
  themes, shared companion APIs, and controlled overlay state against runtime code.
- Checked the 370 example sources and references used by the 125 catalog guides;
  docs type checks compile example components. Code fences embedded in prose are
  not all compiled automatically; the corrected renderer pattern is exercised by
  installed docs-layer SSR consumers.
- Checked literal Hugeicons and VS Code icon names in Markdown/example sources
  against the installed collections; no invalid names were found. This does not
  validate runtime-generated names or consumer-provided icon collections.
- Compared all 11 public composable/helper auto-imports and three directives with
  existing utility or component guidance. `useToast` and `useCommandPalette`
  intentionally live in component guides; `createTableColumnHelper` lives in Table,
  and `useRippleEnabled` lives in the ripple directive guide.

This is documentation/API coverage work. It does not establish correctness of
all runtime combinations, every inherited primitive prop, or accessibility
conformance of every example. Existing runtime, type, accessibility, and packed
consumer suites remain necessary.

## Findings and resolution checklist

- [x] All 97 public components have guidance in 84 shared or standalone guides.
- [x] 14 shared-guide companions were absent from MCP discovery/name lookup.
  Added explicit guide metadata, including TypeScript Column components. MCP now
  lists each public name while retaining one resource URI per guide. Older
  primary-only catalogs remain supported; they cannot supply missing companion
  metadata until the installed core catalog is upgraded.
- [x] Calendar had examples but no props/events/slots reference. Added its date
  models, displayed-month control, constraints, accessible label, colors, slots,
  and native form limitations.
- [x] Theme's copyable `ui` examples used the obsolete unwrapped slot shape.
  Corrected them to `slots`, updated the supported defaults list, documented
  `mode`, and used the public configuration type names.
- [x] Prose recommended string component names and documented an SSR limitation
  already avoided by the shipped docs renderer. Replaced it with imported
  component objects, clarified the stylesheet requirement, and added packed SSR
  assertions for visible code/filename/copy controls. Corrected the distinction
  between clipboard text and visible slot content and removed unsupported
  instance `ui` advice.
- [x] Select/Autocomplete omitted controlled open/default state, form requirements,
  or emitted updates. Completed their reference and the free-text model distinction,
  and corrected the public type comment describing adaptive Autocomplete as nonmodal.
- [x] Overlay guides omitted `defaultOpen`; Dropdown omitted `open` and its update
  event; Modal omitted `autoFocus`. Added initial-versus-controlled state guidance.
- [x] DatePicker's update payload omitted `Time`; InputNumber omitted `readonly`;
  Button omitted `type`; FormField omitted `id`; Tabs omitted `defaultValue`.
  Corrected these without changing component behavior.
- [x] Several guides omitted `color`, or listed only built-in names despite
  accepting registered roles. Added missing entries and linked `ColorRole`.
  ContentNavigation now explains its initial group-collapse setting.
- [x] Missing docs could recur silently in the offline catalog. Catalog builds now
  reject missing guides, unknown/private metadata names, and ambiguous ownership.
  Contributor instructions explain shared-guide registration.

## Intentional grouping and exclusions

Column/ColumnGroup belong to Table; ToolbarButton/ToolbarSeparator/ToolbarToggleGroup
belong to Toolbar; SplitterPanel/SplitterResizeHandle belong to Splitter;
ProseH1–ProseH6 and ProsePre belong to Prose. Separate near-empty pages are not needed.

Recursive `isNested` props on ContentNavigation, ContentToc, and FileTree, and
ContentToc's recursive `activeIds`, are implementation plumbing and are not
promoted as consumer configuration. Toolbar's compact table already documents
its own and companion props; a direct-prop/table-column scan alone reports
false omissions there. The seven private renderer/navigation helper components
remain excluded by both Nuxt registration and package exports.

No remaining discrepancy from this name/direct-prop pass requires a GitHub issue.
Broader behavioral/API equivalence audits can be performed separately; this
checklist does not claim an exhaustive review of every callback or slot payload.

## Validation

- Lint, root/docs TypeScript, and 1,582 tests passed across 130 files.
- Production generation produced 555 routes. SEO checks verified 128 pages,
  128 sharing images, and robots.txt.
- Full packed-consumer checks passed: published types, core SSR/hydration,
  prefix/breakpoint changes, structural themes, agent/MCP contracts, and
  default/prefixed docs-layer SSR and browser behavior. The prose assertions
  verify visible code, filenames, and copy controls in initial server HTML.
- Delivered core consumer CSS stayed within the existing budgets:
  149,710 bytes / 20,070 gzip (prefixed) and 153,803 / 21,448 gzip (unprefixed).
- Sixteen Chromium page/viewport/interactive-theme checks passed for Calendar,
  Theme, Prose, and Select at 1440 and 390 pixels, with no page overflow,
  unresolved prose tags, hydration warnings, or browser exceptions. Dark appearance
  was checked by switching the live control after hydration.

A separate fresh-context dark-start readiness wait timed out while the header
retained its server disabled state and no browser exception was reported. This
was not established as an audit regression; cold-start readiness needs a separate
baseline comparison. The successful checks above do not claim to cover that case.

## Component-to-guide inventory

| Public components | Guide |
| --- | --- |
| `SAccordion` | [Accordion](../content/components/navigation/accordion.md) |
| `SAlertDialog` | [AlertDialog](../content/components/overlays/alert-dialog.md) |
| `SAlert` | [Alert](../content/components/elements/alert.md) |
| `SApp` | [App](../content/components/layout/app.md) |
| `SAutocomplete` | [Autocomplete](../content/components/forms/autocomplete.md) |
| `SAvatarGroup` | [AvatarGroup](../content/components/elements/avatar-group.md) |
| `SAvatar` | [Avatar](../content/components/elements/avatar.md) |
| `SBadge` | [Badge](../content/components/elements/badge.md) |
| `SBreadcrumb` | [Breadcrumb](../content/components/navigation/breadcrumb.md) |
| `SButtonGroup` | [ButtonGroup](../content/components/elements/button-group.md) |
| `SButton` | [Button](../content/components/elements/button.md) |
| `SCalendar` | [Calendar](../content/components/data/calendar.md) |
| `SCallout` | [Callout](../content/components/typography/callout.md) |
| `SCardGroup` | [CardGroup](../content/components/layout/card-group.md) |
| `SCard` | [Card](../content/components/layout/card.md) |
| `SCheckbox` | [Checkbox](../content/components/forms/checkbox.md) |
| `SChip` | [Chip](../content/components/elements/chip.md) |
| `SCodeButton` | [CodeButton](../content/components/typography/code-button.md) |
| `SCodeGroup` | [CodeGroup](../content/components/typography/code-group.md) |
| `SCodeTree` | [CodeTree](../content/components/typography/code-tree.md) |
| `SCollapsible` | [Collapsible](../content/components/navigation/collapsible.md) |
| `SColorModeSwitch` | [ColorModeSwitch](../content/components/layout/color-mode-switch.md) |
| `SColorModeToggle` | [ColorModeToggle](../content/components/layout/color-mode-toggle.md) |
| `SColorPicker` | [ColorPicker](../content/components/forms/color-picker.md) |
| `SCommandPalette` | [Command Palette](../content/components/overlays/command-palette.md) |
| `SContainer` | [Container](../content/components/layout/container.md) |
| `SContentNavigation` | [ContentNavigation](../content/composites/documentation/content-navigation.md) |
| `SContentSurround` | [ContentSurround](../content/composites/documentation/content-surround.md) |
| `SContentToc` | [ContentToc](../content/composites/documentation/content-toc.md) |
| `SContextMenu` | [Context Menu](../content/components/overlays/context-menu.md) |
| `SDashboardGroup` | [DashboardGroup](../content/composites/dashboard/dashboard-group.md) |
| `SDashboardNavbar` | [DashboardNavbar](../content/composites/dashboard/dashboard-navbar.md) |
| `SDashboardPanel` | [DashboardPanel](../content/composites/dashboard/dashboard-panel.md) |
| `SDashboardResizeHandle` | [DashboardResizeHandle](../content/composites/dashboard/dashboard-resize-handle.md) |
| `SDashboardSidebarToggle` | [DashboardSidebarToggle](../content/composites/dashboard/dashboard-sidebar-toggle.md) |
| `SDashboardSidebar` | [DashboardSidebar](../content/composites/dashboard/dashboard-sidebar.md) |
| `SDatePicker` | [DatePicker](../content/components/forms/date-picker.md) |
| `SDrawer` | [Drawer](../content/components/overlays/drawer.md) |
| `SDropdown` | [Dropdown](../content/components/overlays/dropdown.md) |
| `SEditable` | [Editable](../content/components/forms/editable.md) |
| `SEmptyState` | [EmptyState](../content/components/data/empty-state.md) |
| `SFileTree` | [FileTree](../content/components/typography/file-tree.md) |
| `SFileUpload` | [FileUpload](../content/components/forms/file-upload.md) |
| `SFormField` | [FormField](../content/components/forms/form-field.md) |
| `SHeader` | [Header](../content/components/layout/header.md) |
| `SIcon` | [Icon](../content/components/elements/icon.md) |
| `SInputGroup` | [InputGroup](../content/components/forms/input-group.md) |
| `SInputNumber` | [InputNumber](../content/components/forms/input-number.md) |
| `SInput` | [Input](../content/components/forms/input.md) |
| `SKbd` | [Kbd](../content/components/elements/kbd.md) |
| `SListbox` | [Listbox](../content/components/forms/listbox.md) |
| `SModal` | [Modal](../content/components/overlays/modal.md) |
| `SNavigationMenu` | [NavigationMenu](../content/components/navigation/navigation-menu.md) |
| `SPageAside` | [PageAside](../content/composites/documentation/page-aside.md) |
| `SPageHeader` | [PageHeader](../content/composites/documentation/page-header.md) |
| `SPagination` | [Pagination](../content/components/navigation/pagination.md) |
| `SPinInput` | [PinInput](../content/components/forms/pin-input.md) |
| `SPopover` | [Popover](../content/components/overlays/popover.md) |
| `SProgress` | [Progress](../content/components/elements/progress.md) |
| `SProseH1`, `SProseH2`, `SProseH3`, `SProseH4`, `SProseH5`, `SProseH6`, `SProsePre` | [Prose](../content/components/typography/prose.md) |
| `SRadioGroup` | [RadioGroup](../content/components/forms/radio-group.md) |
| `SRating` | [Rating](../content/components/forms/rating.md) |
| `SReadMore` | [ReadMore](../content/components/typography/read-more.md) |
| `SScrollArea` | [ScrollArea](../content/components/layout/scroll-area.md) |
| `SSelect` | [Select](../content/components/forms/select.md) |
| `SSeparator` | [Separator](../content/components/elements/separator.md) |
| `SSkeleton` | [Skeleton](../content/components/elements/skeleton.md) |
| `SSlideover` | [Slideover](../content/components/overlays/slideover.md) |
| `SSlider` | [Slider](../content/components/forms/slider.md) |
| `SSplitter`, `SSplitterPanel`, `SSplitterResizeHandle` | [Splitter](../content/components/layout/splitter.md) |
| `SStepper` | [Stepper](../content/components/navigation/stepper.md) |
| `SSwitch` | [Switch](../content/components/forms/switch.md) |
| `STable`, `SColumn`, `SColumnGroup` | [Table](../content/components/data/table.md) |
| `STabs` | [Tabs](../content/components/navigation/tabs.md) |
| `STextarea` | [Textarea](../content/components/forms/textarea.md) |
| `STheme` | [Theme](../content/components/layout/theme.md) |
| `STimeline` | [Timeline](../content/components/data/timeline.md) |
| `SToast` | [Toast](../content/components/overlays/toast.md) |
| `SToggleGroup` | [Toggle Group](../content/components/elements/toggle-group.md) |
| `SToggle` | [Toggle](../content/components/elements/toggle.md) |
| `SToolbar`, `SToolbarButton`, `SToolbarSeparator`, `SToolbarToggleGroup` | [Toolbar](../content/components/elements/toolbar.md) |
| `STooltip` | [Tooltip](../content/components/overlays/tooltip.md) |
| `STransferList` | [TransferList](../content/components/forms/transfer-list.md) |
| `STree` | [Tree](../content/components/navigation/tree.md) |
