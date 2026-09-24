import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Autocomplete from '../../src/runtime/components/Autocomplete.vue'
import FormField from '../../src/runtime/components/FormField.vue'
import './helpers/adaptive-breakpoint'

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

describe('autocomplete', () => {
  it('preserves controlled empty ownership when the parent vetoes created text', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: [{ value: 1, label: 'One' }], modelValue: undefined, defaultValue: 1, name: 'query', clearable: true },
    })
    try {
      await nextTick()
      const input = wrapper.find('input[role="combobox"]')
      expect((input.element as HTMLInputElement).value).toBe('')
      await input.setValue('Created text')
      await input.trigger('blur')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Created text'])
      expect(wrapper.find('input[type="hidden"][name="query"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Clear"]').exists()).toBe(false)
    }
    finally {
      wrapper.unmount()
    }
  })

  it('blocks unmatched numeric-suggestion text on Enter and blur in both selection modes', async () => {
    for (const multiple of [false, true]) {
      const wrapper = await mountSuspended(Autocomplete, {
        props: { items: [{ value: 1, label: 'One' }], defaultValue: multiple ? [1] : 1, multiple, forceSelection: true, name: 'query' },
      })
      try {
        const input = wrapper.find('input[role="combobox"]')
        for (const action of ['keydown', 'blur']) {
          await input.setValue('Unmatched text')
          await input.trigger(action, action === 'keydown' ? { key: 'Enter' } : {})
          expect(wrapper.emitted('update:modelValue')).toBeUndefined()
          expect(wrapper.findAll('input[type="hidden"][name="query"]').map(field => field.attributes('value'))).toEqual(['1'])
        }
      }
      finally {
        wrapper.unmount()
      }
    }
  })

  it('proposes the numeric custom-key identity while an empty controlled parent vetoes selection', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: [{ id: 0, title: 'Zero' }], valueKey: 'id', labelKey: 'title', forceSelection: true, modelValue: undefined, open: true, name: 'query' },
    })
    try {
      const input = wrapper.find('input[role="combobox"]')
      await input.setValue('Zero')
      await nextTick()
      await nextTick()
      await input.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
      expect(wrapper.find('input[type="hidden"][name="query"]').exists()).toBe(false)
      expect(document.body.querySelector('[role="option"]')?.getAttribute('aria-selected')).toBe('false')
    }
    finally {
      wrapper.unmount()
    }
  })

  it('keeps forced clear and native reset proposals numeric in both selection modes', async () => {
    interface Row { id: number, title: string }
    for (const multiple of [false, true]) {
      const proposals: (number | number[] | undefined)[] = []
      const wrapper = await mountSuspended(defineComponent({
        render: () => h('form', {}, [h(Autocomplete<Row, 'id', boolean, true>, {
          'items': [{ id: 1, title: 'One' }],
          'valueKey': 'id',
          'labelKey': 'title',
          'multiple': multiple,
          'forceSelection': true,
          'defaultValue': multiple ? [1] : 1,
          'name': 'query',
          'clearable': true,
          'onUpdate:modelValue': value => proposals.push(value),
        })]),
      }))
      try {
        const form = wrapper.find('form').element
        expect(new FormData(form).getAll('query')).toEqual(['1'])
        await wrapper.find('[aria-label="Clear"]').trigger('click')
        expect(proposals.at(-1)).toEqual(multiple ? [] : undefined)
        expect(new FormData(form).getAll('query')).toEqual([])
        form.reset()
        await nextTick()
        await nextTick()
        expect(proposals.at(-1)).toEqual(multiple ? [1] : 1)
        expect(new FormData(form).getAll('query')).toEqual(['1'])
      }
      finally {
        wrapper.unmount()
      }
    }
  })

  it('retains forced async identities and blocks creation after a dynamic mode change', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: [], valueKey: 'id', labelKey: 'title', modelValue: 7, forceSelection: true, name: 'query' },
    })
    try {
      await nextTick()
      expect((wrapper.find('input[role="combobox"]').element as HTMLInputElement).value).toBe('7')
      const row = Object.freeze({ id: 7, title: 'Loaded' })
      await wrapper.setProps({ items: Object.freeze([Object.freeze({ label: 'Async', items: Object.freeze([row]) })]) })
      await nextTick()
      expect((wrapper.find('input[role="combobox"]').element as HTMLInputElement).value).toBe('Loaded')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      await wrapper.setProps({ forceSelection: false })
      const input = wrapper.find('input[role="combobox"]')
      await input.setValue('Created text')
      await input.trigger('blur')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Created text'])
      await wrapper.setProps({ forceSelection: true })
      const previousCount = wrapper.emitted('update:modelValue')?.length
      await input.setValue('Other text')
      await input.trigger('blur')
      expect(wrapper.emitted('update:modelValue')).toHaveLength(previousCount!)
      expect(wrapper.find('input[type="hidden"][name="query"]').attributes('value')).toBe('7')
    }
    finally {
      wrapper.unmount()
    }
  })

  it('keeps active and parent-controlled queries when async labels arrive', async () => {
    for (const controlled of [false, true]) {
      const wrapper = await mountSuspended(Autocomplete, {
        props: { items: [], valueKey: 'id', labelKey: 'title', modelValue: 7, ...(controlled ? { searchTerm: 'Parent query' } : { open: true }) },
      })
      try {
        const input = wrapper.find('input[role="combobox"]')
        if (!controlled)
          await input.setValue('7')
        await wrapper.setProps({ items: [{ id: 7, title: 'Loaded' }] })
        await nextTick()
        expect((input.element as HTMLInputElement).value).toBe(controlled ? 'Parent query' : '7')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      }
      finally {
        wrapper.unmount()
      }
    }
  })

  it('retains previously created strings and their reset target when forcing selection dynamically', async () => {
    const forced = ref(false)
    const proposals: (number | string | undefined)[] = []
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('form', {}, [h(Autocomplete<{ value: number, label: string }, 'value', false, boolean>, {
        'items': [{ value: 1, label: 'One' }],
        'forceSelection': forced.value,
        'defaultValue': 'Existing text',
        'name': 'query',
        'clearable': true,
        'onUpdate:modelValue': value => proposals.push(value),
      })]),
    }))
    try {
      const form = wrapper.find('form').element
      forced.value = true
      await nextTick()
      expect(new FormData(form).getAll('query')).toEqual(['Existing text'])
      expect(proposals).toEqual([])
      await wrapper.find('[aria-label="Clear"]').trigger('click')
      expect(proposals.at(-1)).toBeUndefined()
      form.reset()
      await nextTick()
      await nextTick()
      expect(proposals.at(-1)).toBe('Existing text')
      expect(new FormData(form).getAll('query')).toEqual(['Existing text'])
    }
    finally {
      wrapper.unmount()
    }
  })

  it('routes accessible naming and descriptions to the editable input', async () => {
    const attrs = { 'aria-label': 'Search fruit', 'aria-labelledby': 'fruit-label', 'aria-describedby': 'fruit-help', 'aria-errormessage': 'fruit-error', 'aria-details': 'fruit-details' }
    const wrapper = await mountSuspended(Autocomplete, { attrs, props: { items: fruitItems } })
    try {
      const input = wrapper.find('input[role="combobox"]')
      for (const [key, value] of Object.entries(attrs)) {
        expect(input.attributes(key)).toBe(value)
        expect(wrapper.attributes(key)).toBeUndefined()
      }
    }
    finally {
      wrapper.unmount()
    }
  })

  it('renders created chips without passing fabricated records to the item slot', async () => {
    const wrapper = await mountSuspended(Autocomplete<{ value: number, label: string, title: string }, 'value', true>, {
      props: { items: [{ value: 1, label: 'One', title: 'Suggestion' }], defaultValue: [1, 'Created text'], multiple: true, displayMode: 'chip' },
      slots: { item: ({ item }: { item: { title: string } }) => item.title.toUpperCase() },
    })
    try {
      expect(wrapper.text()).toContain('SUGGESTION')
      expect(wrapper.text()).toContain('Created text')
      await wrapper.find('[aria-label="Remove Created text"]').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[1]])
    }
    finally {
      wrapper.unmount()
    }
  })

  it('supports a controlled open state and emits close requests', async () => {
    const wrapper = await mountSuspended(Autocomplete, { props: { items: fruitItems, open: true, dropdown: true } })
    const trigger = wrapper.find('[aria-haspopup="listbox"]')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    await trigger.trigger('click')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(trigger.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('uses native required validity for an empty selection', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('form', {}, [
        h(Autocomplete<(typeof fruitItems)[number]>, { name: 'query', items: fruitItems, required: true }),
      ]),
    }))
    const field = wrapper.find('input[required]')
    expect(field.attributes('required')).toBe('')
    expect(wrapper.find('form').element.checkValidity()).toBe(false)
  })

  it('forwards native search input attributes to the editable field', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      attrs: { autocomplete: 'email', inputmode: 'email', readonly: true },
      props: { items: fruitItems },
    })
    const input = wrapper.find('input[role="combobox"]')

    expect(input.attributes('autocomplete')).toBe('email')
    expect(input.attributes('inputmode')).toBe('email')
    expect(input.attributes('readonly')).toBeDefined()
    expect(wrapper.find('[data-selaras-color]').attributes('readonly')).toBeUndefined()
  })

  it('associates a FormField label with the actual editable input', async () => {
    const wrapper = await mountSuspended(FormField, {
      props: { label: 'Fruit' },
      slots: { default: () => h(Autocomplete<(typeof fruitItems)[number]>, { items: fruitItems }) },
    })
    const input = wrapper.find('input[role="combobox"]')

    expect(input.attributes('id')).toBeTruthy()
    expect(wrapper.find('label').attributes('for')).toBe(input.attributes('id'))
    expect(input.attributes('aria-describedby')).toBeUndefined()
  })

  it('displays the label for numeric zero without treating it as empty', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: [{ label: 'Numeric zero', value: 0 }, { label: 'Text zero', value: '0' }], modelValue: 0 },
    })
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('Numeric zero')
  })

  it('binds a custom semantic role to the trigger root', async () => {
    const wrapper = await mountSuspended(Autocomplete, { props: { items: [{ label: 'One', value: 'one' }], color: 'premium' as any } })
    expect(wrapper.find('[data-selaras-color="premium"]').exists()).toBe(true)
  })

  it('does not render a dropdown button by default', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems },
    })
    expect(wrapper.find('[aria-haspopup="listbox"]').exists()).toBe(false)
  })

  it('renders a dropdown button that opens the popover and blanks the current filter', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems, dropdown: true, searchTerm: 'xyz' },
    })

    const dropdownButton = wrapper.find('[aria-haspopup="listbox"]')
    expect(dropdownButton.exists()).toBe(true)
    expect(dropdownButton.attributes('aria-expanded')).toBe('false')

    await dropdownButton.trigger('click')

    expect(dropdownButton.attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('update:searchTerm')?.at(-1)).toEqual([''])
  })

  it('selects the highlighted option on the first Enter press, not the second', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems },
    })

    const input = wrapper.find('input')
    await input.setValue('app')
    await nextTick()
    await nextTick()

    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['apple'])
  })

  it('clears the selection when clearable and something is picked', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
  })

  it('commits unmatched typed text as a new value by default (no forceSelection)', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems },
    })

    const input = wrapper.find('input')
    await input.setValue('zzz')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['zzz'])
  })

  it('leaves Enter to IME composition, then consumes creation and forced rejection', async () => {
    const wrapper = await mountSuspended(Autocomplete, { props: { items: fruitItems } })
    try {
      const input = wrapper.find('input')
      await input.setValue('created')

      // Safari can issue the IME commit Enter after compositionend with
      // isComposing false. Dispatch synchronously so it remains in the
      // compositionend grace tick.
      input.element.dispatchEvent(new Event('compositionstart', { bubbles: true }))
      input.element.dispatchEvent(new Event('compositionend', { bubbles: true }))
      const imeEnter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      input.element.dispatchEvent(imeEnter)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(imeEnter.defaultPrevented).toBe(false)

      await nextTick()
      const finalImeEnter = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229, bubbles: true, cancelable: true })
      input.element.dispatchEvent(finalImeEnter)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(finalImeEnter.defaultPrevented).toBe(false)

      const createEnter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      input.element.dispatchEvent(createEnter)
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['created'])
      expect(createEnter.defaultPrevented).toBe(true)
    }
    finally {
      wrapper.unmount()
    }

    const forced = await mountSuspended(Autocomplete, { props: { items: fruitItems, forceSelection: true } })
    try {
      const input = forced.find('input')
      await input.setValue('rejected')
      const searchUpdatesBeforeComposition = forced.emitted('update:searchTerm')?.length ?? 0
      const composingEnter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, isComposing: true })
      input.element.dispatchEvent(composingEnter)
      expect(forced.emitted('update:searchTerm')).toHaveLength(searchUpdatesBeforeComposition)
      expect(composingEnter.defaultPrevented).toBe(false)

      const rejectEnter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      input.element.dispatchEvent(rejectEnter)
      expect(forced.emitted('update:modelValue')).toBeUndefined()
      expect(forced.emitted('update:searchTerm')?.at(-1)).toEqual([''])
      expect(rejectEnter.defaultPrevented).toBe(true)
    }
    finally {
      forced.unmount()
    }
  })

  it('creates strings alongside numeric suggestions in single and multiple modes', async () => {
    for (const multiple of [false, true]) {
      const wrapper = await mountSuspended(Autocomplete, {
        props: { items: [{ label: 'One', value: 1 }], multiple, defaultValue: multiple ? [1] : 1 },
      })
      try {
        const input = wrapper.find('input')
        await input.setValue('new entry')
        await input.trigger('blur')
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([multiple ? [1, 'new entry'] : 'new entry'])
      }
      finally {
        wrapper.unmount()
      }
    }
  })

  it('reverts unmatched typed text on blur instead of committing it when forceSelection is on', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems, forceSelection: true },
    })

    const input = wrapper.find('input')
    await input.setValue('zzz')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('update:searchTerm')?.at(-1)).toEqual([''])
  })

  describe('icon slots', () => {
    it('replaces the clear icon via the clear-icon slot', async () => {
      const wrapper = await mountSuspended(Autocomplete, {
        props: { items: fruitItems, modelValue: 'apple', clearable: true },
        slots: { 'clear-icon': '<span class="my-clear-icon">x</span>' },
      })
      expect(wrapper.find('.my-clear-icon').exists()).toBe(true)
    })

    it('replaces the dropdown chevron via the dropdown-icon slot', async () => {
      const wrapper = await mountSuspended(Autocomplete, {
        props: { items: fruitItems, dropdown: true },
        slots: { 'dropdown-icon': '<span class="my-dropdown-icon">v</span>' },
      })
      expect(wrapper.find('.my-dropdown-icon').exists()).toBe(true)
    })

    it('replaces the loading spinner via the loading-icon slot', async () => {
      const wrapper = await mountSuspended(Autocomplete, {
        props: { items: fruitItems, loading: true },
        slots: { 'loading-icon': '<span class="my-loading-icon">...</span>' },
      })
      expect(wrapper.find('.my-loading-icon').exists()).toBe(true)
    })
  })

  // Multiple+chip mode nests a real TagsInputRoot around the input itself
  // (see ComboboxSelectBase.vue) - Reka owns the chip removal wiring here,
  // unlike Select's plain-button trigger which has no input to attach to.
  describe('chip mode (multiple, TagsInputRoot-driven)', () => {
    it('renders a chip with an accessible delete button for each selected value', async () => {
      const wrapper = await mountSuspended(Autocomplete, {
        props: { items: fruitItems, modelValue: ['apple', 'banana'], multiple: true, displayMode: 'chip' },
      })
      const removeButtons = wrapper.findAll('button').filter(b => b.attributes('aria-label')?.startsWith('Remove'))
      expect(removeButtons.map(b => b.attributes('aria-label'))).toEqual(['Remove Apple', 'Remove Banana'])
      expect(removeButtons.every(button => button.attributes('aria-labelledby') === undefined)).toBe(true)
    })

    it('removes a chip via its delete button and emits the remaining values', async () => {
      const wrapper = await mountSuspended(Autocomplete, {
        props: { items: fruitItems, modelValue: ['apple', 'banana'], multiple: true, displayMode: 'chip' },
      })
      const removeButton = wrapper.findAll('button').find(b => b.attributes('aria-label') === 'Remove Apple')
      await removeButton!.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['banana']])
    })
  })

  // Confirms `arrow` actually reaches ComboboxSelectBase through
  // Autocomplete's own forwarding boundary - Select has the
  // same coverage, but that doesn't prove this component's own forwarding
  // wires it up too.
  it('arrow renders the pointer triangle', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems, arrow: { width: 16, height: 8, rounded: true, padding: 12 } },
    })

    const input = wrapper.find('input')
    await input.setValue('app')
    await nextTick()
    await nextTick()

    const arrow = document.body.querySelector('.fill-\\[var\\(--selaras-resolved-surface-default\\)\\]')
    expect(arrow?.getAttribute('width')).toBe('16')
    expect(arrow?.getAttribute('height')).toBe('8')
  })
})

function macrotask() {
  return new Promise(resolve => setTimeout(resolve, 50))
}

// window.matchMedia isn't simulated in this test environment (it never
// matches a real viewport size), so useIsMobile's underlying query is
// stubbed directly here - same helper as select.test.ts's own identical need.
function mockMatchMedia(matches: boolean) {
  const original = window.matchMedia
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
  return () => {
    window.matchMedia = original
  }
}

// Autocomplete's own trigger is the search input typed into continuously.
// On mobile it remains the Combobox focus owner and opens a wider nonmodal
// panel; putting that editor outside a modal would hide it from AT.
describe('autocomplete (adaptive)', () => {
  it('adaptive=true on a mobile-matching viewport keeps the editable combobox and opens a nonmodal panel', async () => {
    const restore = mockMatchMedia(true)
    const container = document.createElement('div')
    document.body.appendChild(container)

    const wrapper = await mountSuspended(Autocomplete, { attachTo: container, props: { items: fruitItems, adaptive: true } })

    const input = wrapper.find('input')
    input.element.focus()
    await input.setValue('a')
    await nextTick()
    await macrotask()

    expect(document.body.querySelector('[role="dialog"]')).toBeFalsy()
    expect(document.body.querySelector('[role="listbox"]')).toBeTruthy()
    expect(document.activeElement).toBe(input.element)

    wrapper.unmount()
    container.remove()
    restore()
  })
})
