/** Presence follows native boolean-attribute semantics, including readonly="". */
export function isFieldReadonly(value: unknown): boolean {
  return value !== undefined && value !== null && value !== false
}

export function canClearField(clearable: boolean | undefined, hasContent: boolean, disabled: boolean | undefined, readonly = false): boolean {
  return !!clearable && hasContent && !disabled && !readonly
}

/** The clear target is smaller than the field; glyph sizing is independent. */
export const fieldClearWidths = { sm: '1.5rem', md: '1.75rem', lg: '2rem' } as const
