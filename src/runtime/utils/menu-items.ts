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

export interface MenuRadioGroup {
  type: 'radio-group'
  /** Accessible name for the group. */
  label?: string
  value?: string
  onUpdateValue?: (value: string) => void
  items: MenuRadioItem[]
}
