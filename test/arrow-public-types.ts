import type { AutocompleteProps } from '../src/runtime/components/Autocomplete.vue'
import type { DatePickerProps } from '../src/runtime/components/DatePicker.vue'
import type { DropdownProps } from '../src/runtime/components/Dropdown.vue'
import type { PopoverProps } from '../src/runtime/components/Popover.vue'
import type { SelectProps } from '../src/runtime/components/Select.vue'
import type { TooltipProps } from '../src/runtime/components/Tooltip.vue'

const roundedArrow = { width: 16, height: 8, rounded: true, padding: 12 }
const popover: PopoverProps = { arrow: roundedArrow }
const dropdown: DropdownProps = { items: [], arrow: roundedArrow }
const select: SelectProps = { items: [], arrow: roundedArrow }
const autocomplete: AutocompleteProps = { items: [], arrow: roundedArrow }
const datePicker: DatePickerProps = { arrow: roundedArrow }
const tooltip: TooltipProps = { arrow: { width: 16, height: 8, padding: 12 } }
const legacy: PopoverProps = { arrow: true }

void [popover, dropdown, select, autocomplete, datePicker, tooltip, legacy]

// TooltipArrow in the installed Reka UI version does not accept rounded.
// @ts-expect-error Tooltip arrow config has no rounded option
const unsupported: TooltipProps = { arrow: { rounded: true } }
void unsupported
