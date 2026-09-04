import { mountSuspended } from '@nuxt/test-utils/runtime'
import { TooltipProvider } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Select from '../../src/runtime/components/Select.vue'

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

// The +N more overflow summary renders an STooltip, which now requires a
// shared TooltipProvider ancestor (normally supplied once by SApp) - see
// tooltip.test.ts for the equivalent, more detailed note.
function withTooltipProvider(children: any) {
  return defineComponent({
    render: () => h(TooltipProvider, null, { default: () => children }),
  })
}

describe('select', () => {
  // the trigger itself is a <button> (clicking anywhere on it opens the
  // popover); the clear control can't be a nested <button> - HTML doesn't
  // allow a <button> inside another one (the browser's own parser would
  // silently close the trigger early, corrupting SSR/hydration) - so it's
  // a role="button" span instead, present only when clearable is on and
  // there's something to clear.
  it('does not render a clear button when clearable is unset', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple' },
    })
    expect(wrapper.find('[role="button"]').exists()).toBe(false)
  })

  it('does not render a clear button when clearable but nothing is selected', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, clearable: true },
    })
    expect(wrapper.find('[role="button"]').exists()).toBe(false)
  })

  it('clears a single selection and emits undefined, without opening the popover', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true },
    })

    const trigger = wrapper.find('button')
    const clearButton = wrapper.find('[role="button"]')
    await clearButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('gives the clear button an accessible label - an icon-only control otherwise has no name', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true },
    })
    const clearButton = wrapper.find('[role="button"]')
    expect(clearButton.attributes('aria-label')).toBe('Clear')
  })

  it('keeps the trigger as the only Tab stop - the clear button opts out via tabindex=-1', async () => {
    // Regression: ComboboxTrigger ships tabindex=-1 by design (Reka expects
    // the consumer to override it - a comparable reference's own select component does the same).
    // Without that override, the trigger was never reachable by Tab at all -
    // this only became visible once the clear button became a real,
    // naturally-tabbable control competing for the one stop that existed.
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true },
    })
    const trigger = wrapper.find('button')
    const clearButton = wrapper.find('[role="button"]')
    expect(trigger.attributes('tabindex')).toBe('0')
    expect(clearButton.attributes('tabindex')).toBe('-1')
  })

  it('gives each chip\'s remove button an accessible label naming that chip', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: ['apple', 'banana'], multiple: true, displayMode: 'chip' },
    })
    const removeButtons = wrapper.findAll('[role="button"]').filter(b => b.attributes('aria-label')?.startsWith('Remove'))
    expect(removeButtons.map(b => b.attributes('aria-label'))).toEqual(['Remove Apple', 'Remove Banana'])
    // Same tab-stop-competition issue as the clear button - each chip's
    // remove control also opts out of Tab so the trigger stays reachable.
    expect(removeButtons.every(b => b.attributes('tabindex') === '-1')).toBe(true)
  })

  it('keeps the +N more tooltip right next to the chips, in the same flex-1 container that pushes the chevron to the edge', async () => {
    // The chevron still needs pushing to the trigger's far right edge (a
    // flex-1 container achieves that), but +N more should sit immediately
    // next to the visible chips rather than also being shoved all the way
    // to the end - so both live inside that same flex-1 wrapper, not after it.
    const wrapper = await mountSuspended(withTooltipProvider(
      h(Select, { items: fruitItems, modelValue: ['apple', 'banana', 'cherry'], multiple: true, displayMode: 'chip', maxChips: 2 }),
    ))
    const chip = wrapper.find('[aria-label="Remove Apple"]').element.parentElement!
    const wrapperEl = chip.parentElement!
    expect(wrapperEl.className).toContain('flex-1')

    const moreText = wrapper.findAll('span').find(el => el.text().includes('more'))!
    expect(moreText.element.closest('span')?.parentElement).toBe(wrapperEl)
  })

  it('keeps the +N more tooltip right next to the comma-joined text, with the text itself no longer flex-1', async () => {
    // Same fix as chip mode, but here the value span used to BE the flex-1
    // element directly - now the wrapper is, and the span drops to
    // flex-initial (still shrinks for its own truncation, just doesn't
    // grow and push the tooltip away from it).
    const wrapper = await mountSuspended(withTooltipProvider(
      h(Select, { items: fruitItems, modelValue: ['apple', 'banana', 'cherry'], multiple: true, maxChips: 2 }),
    ))
    // data-placeholder is only present when empty - not the case here (3
    // selected) - so find the value span by its known text content instead.
    const valueSpan = wrapper.findAll('span').find(el => el.text().startsWith('Apple'))!
    expect(valueSpan.classes()).not.toContain('flex-1')
    expect(valueSpan.classes()).toContain('flex-initial')

    const wrapperEl = valueSpan.element.parentElement!
    expect(wrapperEl.className).toContain('flex-1')
    const moreText = wrapper.findAll('span').find(el => el.text().includes('more'))!
    expect(moreText.element.closest('span')?.parentElement).toBe(wrapperEl)
  })

  it('clears a multiple selection down to an empty array', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: ['apple', 'banana'], multiple: true, clearable: true },
    })

    const clearButton = wrapper.find('[role="button"]')
    await clearButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
  })

  it('hides the clear button while disabled even with a selection', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true, disabled: true },
    })
    expect(wrapper.find('[role="button"]').exists()).toBe(false)
  })

  it('never nests a real <button> inside the trigger <button> - invalid HTML that SSR/hydration silently corrupts', async () => {
    // A client-only mount can't reproduce the actual corruption (that only
    // happens when the browser's HTML parser processes server-rendered
    // markup), but it can still catch a regression back to the invalid
    // structure that causes it: this asserts the invariant directly rather
    // than the symptom.
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: ['apple', 'banana'], multiple: true, displayMode: 'chip', clearable: true },
    })
    const trigger = wrapper.find('button').element
    const nestedButtons = trigger.querySelectorAll('button')
    expect(nestedButtons).toHaveLength(0)
  })

  it('sets aria-busy on the trigger while loading, with an sr-only announcement', async () => {
    const idle = await mountSuspended(Select, { props: { items: fruitItems } })
    expect(idle.find('button').attributes('aria-busy')).toBeUndefined()
    expect(idle.find('.sr-only').exists()).toBe(false)

    const busy = await mountSuspended(Select, { props: { items: fruitItems, loading: true } })
    expect(busy.find('button').attributes('aria-busy')).toBe('true')
    expect(busy.find('.sr-only').text()).toBe('Loading')
  })

  it('applies the color prop to the focus-ring class', async () => {
    const wrapper = await mountSuspended(Select, { props: { items: fruitItems, color: 'success' } })
    expect(wrapper.find('button').classes()).toContain('focus:ring-[var(--ui-success)]')
  })

  it('invalid wins over a custom color for the focus ring, not the other way around', async () => {
    const wrapper = await mountSuspended(Select, { props: { items: fruitItems, color: 'success', invalid: true } })
    const classes = wrapper.find('button').classes()
    expect(classes).toContain('focus:ring-[var(--ui-danger)]')
    expect(classes).not.toContain('focus:ring-[var(--ui-success)]')
  })

  it('renders custom group header content from the group slot, receiving the group entry', async () => {
    const items = [{ label: 'Fruits', items: fruitItems }]
    const wrapper = await mountSuspended(Select, {
      props: { items },
      slots: { group: ({ group }: { group: { label: string } }) => `Category: ${group.label}` },
    })

    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await nextTick()

    expect(document.body.textContent).toContain('Category: Fruits')
  })

  it('renders no arrow element by default', async () => {
    const wrapper = await mountSuspended(Select, { props: { items: fruitItems } })
    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.fill-\\[var\\(--ui-bg\\)\\]')).toBeFalsy()
  })

  it('arrow renders the pointer triangle', async () => {
    const wrapper = await mountSuspended(Select, { props: { items: fruitItems, arrow: true } })
    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.fill-\\[var\\(--ui-bg\\)\\]')).toBeTruthy()
  })
})

describe('select icon slots', () => {
  it('replaces the clear icon via the clear-icon slot', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, modelValue: 'apple', clearable: true },
      slots: { 'clear-icon': '<span class="my-clear-icon">x</span>' },
    })
    expect(wrapper.find('.my-clear-icon').exists()).toBe(true)
    expect(wrapper.find('.iconify.i-lucide\\:x').exists()).toBe(false)
  })

  it('replaces the dropdown chevron via the dropdown-icon slot', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems },
      slots: { 'dropdown-icon': '<span class="my-dropdown-icon">v</span>' },
    })
    expect(wrapper.find('.my-dropdown-icon').exists()).toBe(true)
  })

  it('replaces the loading spinner via the loading-icon slot', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, loading: true },
      slots: { 'loading-icon': '<span class="my-loading-icon">...</span>' },
    })
    expect(wrapper.find('.my-loading-icon').exists()).toBe(true)
  })

  it('replaces the popover search icon via the filter-icon slot', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items: fruitItems, searchable: true },
      slots: { 'filter-icon': '<span class="my-filter-icon">?</span>' },
    })
    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.my-filter-icon')).toBeTruthy()
  })
})

describe('select chip roving focus (non-creatable trigger, hand-rolled equivalent of TagsInputRoot)', () => {
  const items = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ]

  function activeChipLabel(wrapper: any) {
    return wrapper.findAll('span').find((el: any) => el.attributes('data-state') === 'active')?.text()
  }

  it('selects the last chip on the first Backspace, then removes it on the second (two-step, matching TagsInputRoot)', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items, modelValue: ['apple', 'banana', 'cherry'], multiple: true, displayMode: 'chip' },
    })
    const trigger = wrapper.find('[aria-haspopup="listbox"]')

    await trigger.trigger('keydown', { key: 'Backspace' })
    expect(activeChipLabel(wrapper)).toBe('Cherry')

    await trigger.trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'banana']])
  })

  it('moves the virtual selection with ArrowLeft/ArrowRight, deselecting once it moves past the last chip', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items, modelValue: ['apple', 'banana', 'cherry'], multiple: true, displayMode: 'chip' },
    })
    const trigger = wrapper.find('[aria-haspopup="listbox"]')

    await trigger.trigger('keydown', { key: 'ArrowLeft' })
    expect(activeChipLabel(wrapper)).toBe('Cherry')

    await trigger.trigger('keydown', { key: 'ArrowLeft' })
    expect(activeChipLabel(wrapper)).toBe('Banana')

    await trigger.trigger('keydown', { key: 'ArrowRight' })
    expect(activeChipLabel(wrapper)).toBe('Cherry')

    await trigger.trigger('keydown', { key: 'ArrowRight' })
    expect(activeChipLabel(wrapper)).toBeUndefined()
  })

  it('jumps to the first/last chip with Home/End', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items, modelValue: ['apple', 'banana', 'cherry'], multiple: true, displayMode: 'chip' },
    })
    const trigger = wrapper.find('[aria-haspopup="listbox"]')

    await trigger.trigger('keydown', { key: 'Home' })
    expect(activeChipLabel(wrapper)).toBe('Apple')

    await trigger.trigger('keydown', { key: 'End' })
    expect(activeChipLabel(wrapper)).toBe('Cherry')
  })

  it('clears the virtual selection on an unrelated keypress or on blur', async () => {
    const wrapper = await mountSuspended(Select, {
      props: { items, modelValue: ['apple', 'banana', 'cherry'], multiple: true, displayMode: 'chip' },
    })
    const trigger = wrapper.find('[aria-haspopup="listbox"]')

    await trigger.trigger('keydown', { key: 'ArrowLeft' })
    expect(activeChipLabel(wrapper)).toBe('Cherry')

    await trigger.trigger('keydown', { key: 'a' })
    expect(activeChipLabel(wrapper)).toBeUndefined()

    await trigger.trigger('keydown', { key: 'ArrowLeft' })
    expect(activeChipLabel(wrapper)).toBe('Cherry')

    await trigger.trigger('blur')
    expect(activeChipLabel(wrapper)).toBeUndefined()
  })
})

// window.matchMedia isn't simulated in this test environment (it never
// matches a real viewport size - see dashboard-group.test.ts's own note
// on this), so useIsMobile's underlying query is stubbed directly here to
// exercise both branches deterministically instead.
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

describe('select (mobileModal)', () => {
  it('mobileModal unset (default false): still the anchored popover even on a mobile-matching viewport', async () => {
    const restore = mockMatchMedia(true)
    const wrapper = await mountSuspended(Select, { props: { items: fruitItems } })

    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await nextTick()

    expect(document.body.querySelector('[role=dialog]')).toBeFalsy()
    expect(document.body.textContent).toContain('Apple')

    wrapper.unmount()
    restore()
  })

  it('mobileModal=true on a desktop viewport: still the anchored popover, not a Modal', async () => {
    const restore = mockMatchMedia(false)
    const wrapper = await mountSuspended(Select, { props: { items: fruitItems, mobileModal: true } })

    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await nextTick()

    expect(document.body.querySelector('[role=dialog]')).toBeFalsy()
    expect(document.body.textContent).toContain('Apple')

    wrapper.unmount()
    restore()
  })

  it('mobileModal=true on a mobile-matching viewport: renders a Modal, and selecting an item there still updates modelValue', async () => {
    const restore = mockMatchMedia(true)
    const wrapper = await mountSuspended(Select, { props: { items: fruitItems, mobileModal: true } })

    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await nextTick()

    const dialog = document.body.querySelector('[role=dialog]')
    expect(dialog).toBeTruthy()
    expect(dialog?.textContent).toContain('Apple')

    const appleItem = Array.from(document.body.querySelectorAll('[role="option"]')).find(el => el.textContent?.trim() === 'Apple') as HTMLElement
    appleItem.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['apple'])

    wrapper.unmount()
    restore()
  })

  // Select's own trigger is a one-off tap (a button, not something typed
  // into while the modal stays open) - unlike Autocomplete, it keeps
  // Modal's default open-autofocus (see ComboboxSelectBase.vue's own
  // `auto-focus="!creatable"` and autocomplete.test.ts's contrasting case).
  it('mobileModal=true: still moves focus into the modal on open, unlike Autocomplete', async () => {
    const restore = mockMatchMedia(true)
    const wrapper = await mountSuspended(Select, { props: { items: fruitItems, mobileModal: true } })

    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.querySelector('[role=dialog]')?.contains(document.activeElement)).toBe(true)

    wrapper.unmount()
    restore()
  })

  it('mobileModal=true: the modal content uses the same rounded-md as every other floating panel here, not Modal\'s own larger default', async () => {
    const restore = mockMatchMedia(true)
    const wrapper = await mountSuspended(Select, { props: { items: fruitItems, mobileModal: true } })

    await wrapper.find('[aria-haspopup="listbox"]').trigger('click')
    await nextTick()

    const dialog = document.body.querySelector('[role=dialog]')
    expect(dialog?.classList.contains('rounded-[var(--ui-radius-md)]')).toBe(true)
    expect(dialog?.classList.contains('rounded-[var(--ui-radius-lg)]')).toBe(false)

    wrapper.unmount()
    restore()
  })
})
