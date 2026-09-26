import type { MaskDetail, MaskValue } from '../../src/runtime/directives/mask'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import Input from '../../src/runtime/components/Input.vue'
import { vMask } from '../../src/runtime/directives/mask'

type Target = 'native input' | 'SInput'

const setNative = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
const mounted: { unmount: () => void }[] = []

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
})

async function setup(mask: MaskValue, target: Target = 'native input', initial = '') {
  const model = ref(initial)
  const updates: string[] = []
  const onUpdate = (value: string) => {
    model.value = value
    updates.push(value)
  }

  const wrapper = await mountSuspended(defineComponent({
    setup() {
      return () => {
        const node = target === 'native input'
          ? h('input', { value: model.value, onInput: (event: Event) => onUpdate((event.target as HTMLInputElement).value) })
          : h(Input, { 'modelValue': model.value, 'onUpdate:modelValue': onUpdate })
        return withDirectives(node, [[vMask, mask]])
      }
    },
  }), { attachTo: document.body })
  mounted.push(wrapper)

  const input = wrapper.find('input').element as HTMLInputElement
  input.focus()

  /** Simulates the browser applying an edit, then firing `input`. */
  async function edit(nextText: string, caret = nextText.length, inputType = 'insertText') {
    setNative.call(input, nextText)
    input.setSelectionRange(caret, caret)
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType }))
    await nextTick()
  }

  return { model, updates, input, edit }
}

function shown(input: HTMLInputElement) {
  return Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.get!.call(input) as string
}

describe('v-mask', () => {
  it.each(['native input', 'SInput'] as const)('gives the model the raw value and shows the masked one (%s)', async (target) => {
    const { model, updates, input, edit } = await setup('##-##', target)
    await edit('1234')

    expect(model.value).toBe('1234')
    expect(updates).not.toContain('12-34')
    expect(shown(input)).toBe('12-34')
  })

  it('formats a model value set from outside', async () => {
    const { model, input } = await setup('(###) ###-####', 'SInput', '5551234567')
    expect(shown(input)).toBe('(555) 123-4567')

    model.value = '98'
    await nextTick()
    expect(shown(input)).toBe('(98')

    model.value = ''
    await nextTick()
    expect(shown(input)).toBe('')
  })

  // Caret positions are checked in test/browser/mask.spec.ts - happy-dom clamps
  // selections to the raw (unmasked) length, so it can't measure them here.
  it('reformats a character typed in the middle', async () => {
    const { model, input, edit } = await setup('(###) ###-####', 'SInput', '5551234567')
    // Caret after "(55", user types "9": the browser produces "(559|5) 123-4567".
    await edit('(5595) 123-4567', 4)

    expect(model.value).toBe('5595123456')
    expect(shown(input)).toBe('(559) 512-3456')
  })

  it('drops trailing literals when deleting, instead of stranding the caret behind them', async () => {
    const { model, input, edit } = await setup('(###) ###-####', 'SInput', '5551')
    expect(shown(input)).toBe('(555) 1')

    await edit('(555) ', 6, 'deleteContentBackward')
    expect(model.value).toBe('555')
    expect(shown(input)).toBe('(555')
  })

  it('treats a literal prefix on screen as the prefix, not as typed digits', async () => {
    const { model, input, edit } = await setup('+62####', 'SInput')
    await edit('8123')
    expect(shown(input)).toBe('+628123')
    expect(model.value).toBe('8123')

    // Editing the displayed text keeps the prefix digits out of the value.
    await edit('+6281234', 8)
    expect(model.value).toBe('8123')
    expect(shown(input)).toBe('+628123')
  })

  it('accepts a first typed digit that happens to match a literal', async () => {
    const { model, input, edit } = await setup('+62####', 'SInput')
    await edit('6')
    expect(model.value).toBe('6')
    expect(shown(input)).toBe('+626')
  })

  it('supports custom tokens with transforms', async () => {
    const { model, input, edit } = await setup({
      mask: 'HH HH',
      tokens: { H: { pattern: /[\da-f]/i, transform: char => char.toUpperCase() } },
    }, 'SInput')
    await edit('ab1z2')

    expect(model.value).toBe('AB12')
    expect(shown(input)).toBe('AB 12')
  })

  it('reports raw and masked values through onMask and the mask event', async () => {
    const details: MaskDetail[] = []
    const events: MaskDetail[] = []
    const { input, edit } = await setup({ mask: '##-##', onMask: detail => details.push(detail) })
    input.addEventListener('mask', event => events.push((event as CustomEvent<MaskDetail>).detail))

    await edit('12')
    await edit('12-34', 5)

    expect(details.at(-1)).toEqual({ value: '1234', maskedValue: '12-34', completed: true })
    expect(details.at(-2)).toEqual({ value: '12', maskedValue: '12', completed: false })
    expect(events.at(-1)).toEqual({ value: '1234', maskedValue: '12-34', completed: true })
  })

  it('leaves the input alone without a mask', async () => {
    const { model, input, edit } = await setup(undefined, 'SInput')
    await edit('12-34 abc')
    expect(model.value).toBe('12-34 abc')
    expect(shown(input)).toBe('12-34 abc')
  })
})
