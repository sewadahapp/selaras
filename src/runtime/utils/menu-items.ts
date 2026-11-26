export interface MenuItemOptions {
  label: string
  icon?: string
  disabled?: boolean
  /** Styles the item for a destructive action. */
  destructive?: boolean
  onSelect?: () => void
  /** Displays a keyboard shortcut hint. */
  shortcut?: string
  /** Binds the shortcut while the menu is open. */
  hotkey?: boolean
}

export interface MenuCheckboxItem extends MenuItemOptions {
  type: 'checkbox'
  checked: boolean
  onUpdateChecked?: (checked: boolean) => void
}

export interface MenuRadioItem extends MenuItemOptions {
  value: string
}

// Every menu entry preserves the fields readers could access on action items.
type RadioGroupActionFields = Partial<Record<Exclude<keyof MenuItemOptions, 'label'>, never>>

export interface MenuRadioGroup extends RadioGroupActionFields {
  type: 'radio-group'
  /** Accessible name for the group. */
  label: string
  value?: string
  onUpdateValue?: (value: string) => void
  items: MenuRadioItem[]
}

export function isMenuCheckboxItem(item: MenuItemOptions | MenuCheckboxItem | MenuRadioGroup): item is MenuCheckboxItem {
  return 'type' in item && item.type === 'checkbox' && 'checked' in item && typeof item.checked === 'boolean'
}

export function isMenuRadioGroup(item: MenuItemOptions | MenuCheckboxItem | MenuRadioGroup): item is MenuRadioGroup {
  return 'type' in item && item.type === 'radio-group' && 'items' in item && Array.isArray(item.items)
}
