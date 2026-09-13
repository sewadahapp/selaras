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

/** Fallthrough keys that belong on a wrapped text-like native input. */
export function isNativeInputAttr(key: string) {
  return nativeInputAttributes.has(key) || nativeInputEvents.test(key)
}

export function isNativeInputEvent(key: string) {
  return nativeInputEvents.test(key)
}
