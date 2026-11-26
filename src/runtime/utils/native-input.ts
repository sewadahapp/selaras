const nativeInputAttributes = new Set([
  'autocomplete',
  'autocapitalize',
  'autocorrect',
  'form',
  'inputmode',
  'list',
  'maxlength',
  'minlength',
  'pattern',
  'readonly',
  'required',
  'spellcheck',
  'step',
])

const nativeInputEvents = /^on(?:BeforeInput|Change|CompositionEnd|CompositionStart|CompositionUpdate|Focus|Input|KeyDown|KeyUp|Paste|Select|Blur)$/

const nativeInputAccessibilityAttributes = new Set([
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-errormessage',
  'aria-details',
])

/** Fallthrough keys that belong on a wrapped text-like native input. */
export function isNativeInputAttr(key: string) {
  return nativeInputAttributes.has(key) || nativeInputEvents.test(key)
}

export function isNativeInputEvent(key: string) {
  return nativeInputEvents.test(key)
}

/** Accessible naming and description belong on the wrapped input, not its layout root. */
export function isNativeInputA11yAttr(key: string) {
  return nativeInputAccessibilityAttributes.has(key)
}

const nativeFieldAttributes = new Set(['autofocus', 'dirname', 'enterkeyhint'])
const inputOnlyAttributes = new Set([
  'accept',
  'alt',
  'capture',
  'checked',
  'formaction',
  'formenctype',
  'formmethod',
  'formnovalidate',
  'formtarget',
  'height',
  'max',
  'min',
  'multiple',
  'popovertarget',
  'popovertargetaction',
  'src',
  'width',
])
const textareaOnlyAttributes = new Set(['cols', 'wrap'])

function isNativeFieldAttr(key: string) {
  return nativeFieldAttributes.has(key) || isNativeInputAttr(key) || isNativeInputA11yAttr(key)
}

export function isNativeInputElementAttr(key: string) {
  return isNativeFieldAttr(key) || inputOnlyAttributes.has(key)
}

export function isNativeTextareaElementAttr(key: string) {
  return isNativeFieldAttr(key) || textareaOnlyAttributes.has(key)
}
