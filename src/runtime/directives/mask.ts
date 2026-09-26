import type { Directive } from 'vue'

/** A mask placeholder character and the input characters it accepts. */
export interface MaskToken {
  pattern: RegExp
  /** Rewrites an accepted character, e.g. to uppercase it. */
  transform?: (char: string) => string
}

/** Values reported by `v-mask` after each mask update. */
export interface MaskDetail {
  /** The value without mask literals. This is also the value `v-model` receives. */
  value: string
  /** The formatted value shown in the input. */
  maskedValue: string
  /** Whether every placeholder in the mask has been filled. */
  completed: boolean
}

export interface MaskOptions {
  mask: string
  /** Extra or overriding placeholder tokens, merged over the defaults (`#`, `@`, `*`). */
  tokens?: Record<string, MaskToken>
  onMask?: (detail: MaskDetail) => void
}

/** A mask pattern string, or options for custom tokens and the `onMask` callback. */
export type MaskValue = string | MaskOptions | null | undefined

const defaultMaskTokens: Record<string, MaskToken> = {
  '#': { pattern: /\d/ },
  '@': { pattern: /[a-z]/i },
  '*': { pattern: /[\da-z]/i },
}

interface MaskResult {
  masked: string
  unmasked: string
  completed: boolean
  /** Index in `masked` just after each accepted placeholder character. */
  slotEnds: number[]
}

/**
 * Formats `input` against `mask`. `raw` input (a model value) is all data;
 * otherwise (text already on screen) a literal sitting at its own mask
 * position is treated as that literal rather than as data - so a digit in a
 * literal prefix like `+62` survives re-formatting without being duplicated.
 */
function formatMask(input: string, mask: string, tokens: Record<string, MaskToken> = defaultMaskTokens, raw = true): MaskResult {
  let masked = ''
  let unmasked = ''
  let inputIndex = 0
  let maskIndex = 0
  let skipped = 0
  const slotEnds: number[] = []

  while (maskIndex < mask.length && inputIndex < input.length) {
    const maskChar = mask[maskIndex]!
    const token = tokens[maskChar]
    const char = input[inputIndex]!

    if (token) {
      if (token.pattern.test(char)) {
        const accepted = token.transform ? token.transform(char) : char
        masked += accepted
        unmasked += accepted
        slotEnds.push(masked.length)
        maskIndex++
      }
      else {
        skipped++
      }
      inputIndex++
    }
    else {
      masked += maskChar
      if (!raw && char === maskChar && inputIndex - skipped === maskIndex)
        inputIndex++
      maskIndex++
    }
  }

  let slotCount = 0
  for (const char of mask) {
    if (tokens[char])
      slotCount++
  }

  return { masked, unmasked, completed: slotEnds.length === slotCount, slotEnds }
}

interface MaskState {
  input: HTMLInputElement
  mask: string
  tokens: Record<string, MaskToken>
  onMask?: (detail: MaskDetail) => void
  masked: string
  unmasked: string
  reported?: string
  onInput: (event: Event) => void
}

const states = new WeakMap<HTMLElement, MaskState>()
let nativeDescriptor: PropertyDescriptor | undefined
function nativeValue(): PropertyDescriptor {
  return nativeDescriptor ??= Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!
}

function readNative(input: HTMLInputElement): string {
  return nativeValue().get!.call(input)
}

function writeNative(input: HTMLInputElement, value: string) {
  if (readNative(input) !== value)
    nativeValue().set!.call(input, value)
}

function resolveInput(element: HTMLElement): HTMLInputElement | undefined {
  if (element instanceof HTMLInputElement)
    return element
  return element.querySelector('input') ?? undefined
}

function normalize(value: MaskValue): MaskOptions | undefined {
  if (!value)
    return undefined
  return typeof value === 'string' ? { mask: value } : value.mask ? value : undefined
}

function resolveTokens(options: MaskOptions) {
  return options.tokens ? { ...defaultMaskTokens, ...options.tokens } : defaultMaskTokens
}

function commit(state: MaskState, result: MaskResult) {
  state.masked = result.masked
  state.unmasked = result.unmasked
  writeNative(state.input, result.masked)

  if (state.reported === result.masked)
    return
  state.reported = result.masked
  const detail: MaskDetail = { value: result.unmasked, maskedValue: result.masked, completed: result.completed }
  state.onMask?.(detail)
  state.input.dispatchEvent(new CustomEvent<MaskDetail>('mask', { bubbles: true, detail }))
}

/** Formats text the user just edited, keeping the caret beside the character they typed. */
function handleInput(state: MaskState, event: Event) {
  if ((event as InputEvent).isComposing)
    return

  const { input, mask, tokens } = state
  const current = readNative(input)
  const caret = input.selectionStart ?? current.length
  const result = formatMask(current, mask, tokens, false)

  // Deleting shouldn't leave the caret stranded behind literals the user
  // would have to delete one by one.
  const inputType = (event as InputEvent).inputType ?? ''
  if (inputType.startsWith('delete'))
    result.masked = result.masked.slice(0, result.slotEnds.at(-1) ?? 0)

  // The text before the caret, formatted on its own, is exactly the part of
  // the new value that precedes the caret.
  const position = Math.min(formatMask(current.slice(0, caret), mask, tokens, false).masked.length, result.masked.length)
  commit(state, result)

  if (document.activeElement === input)
    input.setSelectionRange(position, position)
}

function install(element: HTMLElement, input: HTMLInputElement, options: MaskOptions) {
  const state: MaskState = {
    input,
    mask: options.mask,
    tokens: resolveTokens(options),
    onMask: options.onMask,
    masked: '',
    unmasked: '',
    onInput: event => handleInput(state, event),
  }

  // `value` reads as the raw value, so v-model receives it and Vue sees the
  // model and the field as already in sync - it never writes the raw value
  // back over the formatted text (which would lose the caret). Writing
  // `value` (a model update, a clear button) formats what's written.
  Object.defineProperty(input, 'value', {
    configurable: true,
    enumerable: nativeValue().enumerable,
    get: () => {
      const current = readNative(input)
      return current === state.masked
        ? state.unmasked
        : formatMask(current, state.mask, state.tokens, false).unmasked
    },
    set: (value: unknown) => {
      commit(state, formatMask(value == null ? '' : String(value), state.mask, state.tokens))
    },
  })

  // Capture, so this runs before v-model's own listener reads `value`.
  input.addEventListener('input', state.onInput, true)
  states.set(element, state)
  commit(state, formatMask(readNative(input), state.mask, state.tokens))
}

function uninstall(element: HTMLElement, state: MaskState) {
  state.input.removeEventListener('input', state.onInput, true)
  Reflect.deleteProperty(state.input, 'value')
  states.delete(element)
}

function apply(element: HTMLElement, value: MaskValue) {
  const options = normalize(value)
  const input = resolveInput(element)
  const state = states.get(element)

  if (state && (!options || state.input !== input))
    uninstall(element, state)
  if (!options || !input)
    return

  const existing = states.get(element)
  if (!existing) {
    install(element, input, options)
    return
  }

  existing.onMask = options.onMask
  const tokens = resolveTokens(options)
  if (existing.mask === options.mask && sameTokens(existing.tokens, tokens))
    return
  existing.mask = options.mask
  existing.tokens = tokens
  commit(existing, formatMask(existing.unmasked, existing.mask, existing.tokens))
}

function sameTokens(left: Record<string, MaskToken>, right: Record<string, MaskToken>) {
  if (left === right)
    return true
  const keys = Object.keys(left)
  return keys.length === Object.keys(right).length
    && keys.every(key => right[key] && String(left[key]!.pattern) === String(right[key]!.pattern))
}

/**
 * Formats a native input or the input inside a single-input component.
 * `v-model` receives the raw value; the field shows the formatted one. Use
 * `onMask` (or the bubbling `mask` event) to also read the formatted value.
 */
export const vMask: Directive<HTMLElement, MaskValue> = {
  getSSRProps() {
    return undefined
  },
  mounted(element, binding) {
    apply(element, binding.value)
  },
  updated(element, binding) {
    apply(element, binding.value)
  },
  beforeUnmount(element) {
    const state = states.get(element)
    if (state)
      uninstall(element, state)
  },
}
