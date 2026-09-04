import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Autocomplete from '../../src/runtime/components/Autocomplete.vue'

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

describe('autocomplete', () => {
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
  // Autocomplete's own separate useForwardPropsEmits call - Select has the
  // same coverage, but that doesn't prove this component's own forwarding
  // wires it up too.
  it('arrow renders the pointer triangle', async () => {
    const wrapper = await mountSuspended(Autocomplete, {
      props: { items: fruitItems, arrow: true },
    })

    const input = wrapper.find('input')
    await input.setValue('app')
    await nextTick()
    await nextTick()

    expect(document.body.querySelector('.fill-\\[var\\(--ui-bg\\)\\]')).toBeTruthy()
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

// Regression: Autocomplete's own trigger *is* the search input, typed
// into continuously while the mobile modal stays open - Reka's default
// open-autofocus stole focus away from it the instant the modal opened
// (confirmed live: the very first keystroke opened the modal, which then
// immediately re-focused its own content, silently dropping every
// character typed afterward). ComboboxSelectBase.vue now passes
// `auto-focus="!creatable"` to Modal for exactly this reason.
describe('autocomplete (mobileModal)', () => {
  it('mobileModal=true on a mobile-matching viewport: opening via typing does not steal focus away from the input', async () => {
    const restore = mockMatchMedia(true)
    const container = document.createElement('div')
    document.body.appendChild(container)

    const wrapper = await mountSuspended(Autocomplete, { attachTo: container, props: { items: fruitItems, mobileModal: true } })

    const input = wrapper.find('input')
    input.element.focus()
    await input.setValue('a')
    await nextTick()
    await macrotask()

    expect(document.body.querySelector('.bg-black\\/50')).toBeTruthy()
    expect(document.activeElement).toBe(input.element)

    wrapper.unmount()
    container.remove()
    restore()
  })
})
