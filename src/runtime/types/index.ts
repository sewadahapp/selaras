// Re-exports every public component's Props/Emits/Slots types (and
// any other already-exported data-shape type, e.g. DropdownItem), so
// a consumer can `import type { ModalProps } from 'selaras/types'`
// instead of needing the deep `selaras/components/Modal.vue` path
// (which also still works directly, unchanged, for one component).
//
// This file is excluded from both this project's own tsconfig.json
// AND playground/tsconfig.json (both have their own explicit
// "exclude": ["src/runtime/types"]) - resolving a *plain .ts* file
// that imports types from *many* .vue files this way is genuinely
// nondeterministic under vue-tsc's CLI (which lines resolve and
// which error with "Cannot find module" varies between runs of the
// exact same code - confirmed repeatedly, across several different
// re-export syntaxes, all similarly unreliable at this file's scale).
// The real build (mkdist's own internal vue-tsc/Volar invocation, a
// different code path from the CLI) and a real external
// `npm install` consumer test both resolve this exact file/syntax
// correctly and consistently - this instability is specific to the
// dev-time CLI check, not the actual shipped types, so excluding it
// from that one check (while still building/shipping it normally)
// is the right tradeoff, and lets this stay the simplest possible
// form rather than a more convoluted one that happens to dodge the
// CLI's own limitation.
//
// New components need a line added here too - nothing auto-discovers
// this list.

export type * from '../components/Accordion.vue'
export type * from '../components/Alert.vue'
export type * from '../components/App.vue'
export type * from '../components/Autocomplete.vue'
export type * from '../components/Avatar.vue'
export type * from '../components/AvatarGroup.vue'
export type * from '../components/Badge.vue'
export type * from '../components/Breadcrumb.vue'
export type * from '../components/Button.vue'
export type * from '../components/ButtonGroup.vue'
export type * from '../components/Checkbox.vue'
export type * from '../components/Chip.vue'
export type * from '../components/CodeGroup.vue'
export type * from '../components/Collapsible.vue'
export type * from '../components/ColorModeToggle.vue'
export type * from '../components/CommandPalette.vue'
export type * from '../components/Container.vue'
export type * from '../components/ContentNavigation.vue'
export type * from '../components/ContentToc.vue'
export type * from '../components/ContextMenu.vue'
export type * from '../components/DatePicker.vue'
export type * from '../components/Dropdown.vue'
export type * from '../components/FileUpload.vue'
export type * from '../components/FormField.vue'
export type * from '../components/Header.vue'
export type * from '../components/Icon.vue'
export type * from '../components/Input.vue'
export type * from '../components/InputNumber.vue'
export type * from '../components/Kbd.vue'
export type * from '../components/Modal.vue'
export type * from '../components/NavigationMenu.vue'
export type * from '../components/PageAside.vue'
export type * from '../components/PageHeader.vue'
export type * from '../components/Pagination.vue'
export type * from '../components/PinInput.vue'
export type * from '../components/Popover.vue'
export type * from '../components/Progress.vue'
export type * from '../components/ProseH1.vue'
export type * from '../components/ProseH2.vue'
export type * from '../components/ProseH3.vue'
export type * from '../components/ProseH4.vue'
export type * from '../components/ProseH5.vue'
export type * from '../components/ProseH6.vue'
export type * from '../components/ProsePre.vue'
export type * from '../components/RadioGroup.vue'
export type * from '../components/Rating.vue'
export type * from '../components/ScrollArea.vue'
export type * from '../components/Select.vue'
export type * from '../components/Separator.vue'
export type * from '../components/Skeleton.vue'
export type * from '../components/Slideover.vue'
export type * from '../components/Stepper.vue'
export type * from '../components/Switch.vue'
export type * from '../components/Table.vue'
export type * from '../components/Tabs.vue'
export type * from '../components/Textarea.vue'
export type * from '../components/Toast.vue'
export type * from '../components/Toggle.vue'
export type * from '../components/ToggleGroup.vue'
export type * from '../components/Tooltip.vue'
