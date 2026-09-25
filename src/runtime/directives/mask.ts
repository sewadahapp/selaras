import type { MaskInputOptions } from 'maska'
import type { Directive } from 'vue'
import { MaskInput } from 'maska'

/** Values reported by `v-mask` after each mask update. */
export interface MaskDetail {
  /** The value without mask literals. This is also the value emitted by `v-model`. */
  value: string
  /** The formatted value shown in the input. */
  maskedValue: string
  completed: boolean
}

/** A mask pattern or Maska options with Selaras's normalized value callback. */
export type MaskValue = string | (Omit<MaskInputOptions, 'onMaska'> & {
  onMask?: (detail: MaskDetail) => void
}) | undefined

interface MaskState {
  input: HTMLInputElement
  instance: MaskInput
  exposeModelValue: (event: Event) => void
  restoreValueProperty: (event: Event) => void
  options: MaskInputOptions
  reportMask: NonNullable<MaskInputOptions['onMaska']>
  setOnMask: (callback: ((detail: MaskDetail) => void) | undefined) => void
}

const states = new WeakMap<HTMLElement, MaskState>()

function resolveInput(element: HTMLElement): HTMLInputElement | undefined {
  if (element.tagName === 'INPUT')
    return element as HTMLInputElement

  return element.querySelector('input') ?? undefined
}

function normalizeOptions(value: MaskValue): { options: MaskInputOptions, onMask?: (detail: MaskDetail) => void } {
  if (typeof value === 'string')
    return { options: { mask: value } }

  const { onMask, ...options } = value ?? {}
  return { options, onMask }
}

function optionsEqual(left: MaskInputOptions, right: MaskInputOptions) {
  const leftKeys = Object.keys(left) as (keyof MaskInputOptions)[]
  const rightKeys = Object.keys(right) as (keyof MaskInputOptions)[]
  return leftKeys.length === rightKeys.length
    && leftKeys.every(key => Object.hasOwn(right, key) && Object.is(left[key], right[key]))
}

function destroyState(element: HTMLElement, state: MaskState) {
  state.instance.destroy()
  state.input.removeEventListener('input', state.exposeModelValue, true)
  state.input.removeEventListener('input', state.restoreValueProperty)
  states.delete(element)
}

function applyMask(element: HTMLElement, value: MaskValue) {
  const input = resolveInput(element)
  const current = states.get(element)

  if (!input) {
    if (current)
      destroyState(element, current)
    return
  }

  const { options, onMask } = normalizeOptions(value)
  let state = current

  if (state && state.input !== input) {
    destroyState(element, state)
    state = undefined
  }

  const callbackRef = { value: onMask }
  const reportMask = (detail: { masked: string, unmasked: string, completed: boolean }) => {
    const normalized: MaskDetail = {
      value: detail.unmasked,
      maskedValue: detail.masked,
      completed: detail.completed,
    }

    callbackRef.value?.(normalized)
    input.dispatchEvent(new CustomEvent<MaskDetail>('mask', {
      bubbles: true,
      detail: normalized,
    }))
  }

  if (!state) {
    const instance = new MaskInput(input, {
      ...options,
      onMaska: reportMask,
    })

    // Maska dispatches a synthetic input event after formatting. Temporarily
    // expose the unmasked value through the input's `value` property while
    // Vue's synchronous v-model listener reads it. The DOM value itself stays
    // masked, so Maska's caret calculation still sees the formatted string.
    let previousValueDescriptor: PropertyDescriptor | undefined
    let hasValueOverride = false
    const exposeModelValue = (event: Event) => {
      const maskedValue = input.value
      const detail = event instanceof CustomEvent && typeof event.detail === 'string' ? event.detail : maskedValue
      const modelValue = instance.items.get(input)?.unmasked(maskedValue) ?? detail
      previousValueDescriptor = Object.getOwnPropertyDescriptor(input, 'value')
      const nativeValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
      Object.defineProperty(input, 'value', {
        configurable: true,
        enumerable: nativeValue?.enumerable ?? true,
        get: () => modelValue,
        set: value => nativeValue?.set?.call(input, value),
      })
      hasValueOverride = true
    }
    const restoreValueProperty = () => {
      if (!hasValueOverride)
        return

      if (previousValueDescriptor)
        Object.defineProperty(input, 'value', previousValueDescriptor)
      else
        Reflect.deleteProperty(input, 'value')

      hasValueOverride = false
    }

    input.addEventListener('input', exposeModelValue, true)
    input.addEventListener('input', restoreValueProperty)
    state = {
      input,
      instance,
      exposeModelValue,
      restoreValueProperty,
      options,
      reportMask,
      setOnMask: (callback) => {
        callbackRef.value = callback
      },
    }
    states.set(element, state)
  }
  else {
    state.setOnMask(onMask)
    if (!optionsEqual(state.options, options)) {
      state.options = options
      state.instance.update({
        ...options,
        onMaska: state.reportMask,
      })
    }
    else {
      state.instance.updateValue(input)
    }
  }
}

/**
 * Formats a native input or the input inside a single-input component.
 * Vue's model receives the unmasked value; use `onMask` (or the native `mask`
 * event) to read both the raw and formatted values.
 */
export const vMask: Directive<HTMLElement, MaskValue> = {
  getSSRProps() {
    return undefined
  },
  mounted(element, binding) {
    applyMask(element, binding.value)
  },
  updated(element, binding) {
    applyMask(element, binding.value)
  },
  beforeUnmount(element) {
    const state = states.get(element)
    if (state)
      destroyState(element, state)
  },
}
