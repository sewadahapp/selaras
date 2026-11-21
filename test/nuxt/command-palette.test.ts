import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import CommandPalette from '../../src/runtime/components/CommandPalette.vue'
import { useCommandPalette } from '../../src/runtime/composables/use-command-palette'

// DialogContent renders through a real Teleport to document.body (not
// stubbed in this test environment), same as Modal's own tests - query
// document.body directly instead of wrapper.find. `isOpen` is a real
// shared singleton (useCommandPalette's whole point), so it's explicitly
// closed after every test to avoid one test's open state leaking into the
// next.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  useCommandPalette().close()
})

function macrotask() {
  return new Promise(resolve => setTimeout(resolve, 50))
}

function makeGroups(onSelect = vi.fn(), onSelectDisabled = vi.fn()) {
  return [
    {
      label: 'Actions',
      items: [
        { label: 'New file', onSelect },
        { label: 'New folder', onSelect: vi.fn() },
        { label: 'Locked action', disabled: true, onSelect: onSelectDisabled },
      ],
    },
  ]
}

function optionLabels() {
  return Array.from(document.body.querySelectorAll('[role="option"]')).map(el => el.querySelector('span')?.textContent?.trim())
}

function highlightedLabel() {
  return document.body.querySelector('[data-highlighted]')?.querySelector('span')?.textContent?.trim()
}

function searchInput() {
  return document.body.querySelector<HTMLInputElement>('input[role="combobox"]')!
}

async function type(value: string) {
  const input = searchInput()
  input.value = value
  input.dispatchEvent(new Event('input'))
  await wrapper!.vm.$nextTick()
}

describe('commandPalette', () => {
  it('uses the primary focus recipe on its search input, not the palette frame', async () => {
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups() } })
    await macrotask()

    const dialog = document.body.querySelector('[role="dialog"]')!
    const input = dialog.querySelector('input[role="combobox"]')!
    expect(dialog.getAttribute('data-selaras-color')).toBe('primary')
    expect(dialog.className).not.toContain('focus-within:ring-[var(--_selaras-color-focus)]')
    expect(input.className).toContain('focus-visible:outline-[var(--_selaras-color-focus)]')
  })

  it('is closed until useCommandPalette().open() is called', async () => {
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups() } })

    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeFalsy()

    useCommandPalette().open()
    await macrotask()

    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeTruthy()
  })

  it('close() closes it', async () => {
    const palette = useCommandPalette()
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups() } })
    palette.open()
    await macrotask()

    palette.close()
    await macrotask()

    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeFalsy()
  })

  it('toggle() flips the open state', async () => {
    const palette = useCommandPalette()
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups() } })

    palette.toggle()
    await macrotask()
    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeTruthy()

    palette.toggle()
    await macrotask()
    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeFalsy()
  })

  it('typing filters items and hides an emptied group entirely', async () => {
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups() } })
    await macrotask()

    const input = document.body.querySelector<HTMLInputElement>('input[role="combobox"]')!
    input.value = 'folder'
    input.dispatchEvent(new Event('input'))
    await wrapper.vm.$nextTick()

    const options = document.body.querySelectorAll('[role="option"]')
    expect(Array.from(options).map(el => el.textContent?.trim())).toEqual(['New folder'])
  })

  it('shows the empty state when nothing matches', async () => {
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups() } })
    await macrotask()

    const input = document.body.querySelector<HTMLInputElement>('input[role="combobox"]')!
    input.value = 'zzz-no-match'
    input.dispatchEvent(new Event('input'))
    await wrapper.vm.$nextTick()

    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(0)
    expect(document.body.textContent).toContain('No results found')
  })

  it('arrow keys move the highlighted item, wrapping past either end, skipping disabled ones', async () => {
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups() } })
    await macrotask()

    const input = document.body.querySelector<HTMLInputElement>('input[role="combobox"]')!
    const highlightedLabel = () => document.body.querySelector('[data-highlighted]')?.textContent?.trim()

    expect(highlightedLabel()).toBe('New file')

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(highlightedLabel()).toBe('New folder')

    // Wraps past the end back to the first selectable item - "Locked
    // action" is disabled and never becomes the highlighted one.
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(highlightedLabel()).toBe('New file')

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(highlightedLabel()).toBe('New folder')
  })

  it('enter fires the highlighted item\'s onSelect and closes the palette', async () => {
    const onSelect = vi.fn()
    const palette = useCommandPalette()
    palette.open()
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups(onSelect) } })
    await macrotask()

    const input = document.body.querySelector<HTMLInputElement>('input[role="combobox"]')!
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await macrotask()

    expect(onSelect).toHaveBeenCalledOnce()
    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeFalsy()
  })

  it('activates opted-in item shortcuts while the palette is open', async () => {
    const onSelect = vi.fn()
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, {
      props: { groups: [{ items: [{ label: 'New file', shortcut: 'mod+n', hotkey: true, onSelect }] }] },
    })
    await macrotask()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', ctrlKey: true, bubbles: true, cancelable: true }))
    await macrotask()
    expect(onSelect).toHaveBeenCalledOnce()
    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeFalsy()
  })

  it('a disabled item cannot be selected by click', async () => {
    const onSelectDisabled = vi.fn()
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups(vi.fn(), onSelectDisabled) } })
    await macrotask()

    const disabledOption = Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'))
      .find(el => el.textContent?.trim() === 'Locked action')!
    disabledOption.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await macrotask()

    expect(onSelectDisabled).not.toHaveBeenCalled()
  })

  it('cmd/Ctrl+K toggles open when shortcut is enabled (the default)', async () => {
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups() } })
    await macrotask()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
    await macrotask()

    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeTruthy()
  })

  it('cmd/Ctrl+K does nothing when shortcut is false', async () => {
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups(), shortcut: false } })
    await macrotask()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
    await macrotask()

    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeFalsy()
  })

  it('an `open` prop makes it a local, independent instance instead of the shared singleton', async () => {
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups(), open: true } })
    await macrotask()

    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeTruthy()

    // The shared singleton never moved - closing it has no effect on this
    // controlled instance, which stays exactly at what its own `open` prop says.
    useCommandPalette().close()
    await macrotask()
    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeTruthy()
  })

  it('a controlled instance emits update:open and does not touch the shared singleton', async () => {
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups(), open: true } })
    await macrotask()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await macrotask()

    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    expect(useCommandPalette().isOpen.value).toBe(false)
    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeTruthy()
  })

  it('gives simultaneously mounted palettes distinct listbox and option ids', async () => {
    const both = await mountSuspended(defineComponent({
      render: () => h('div', [
        h(CommandPalette, { groups: makeGroups(), open: true, shortcut: false }),
        h(CommandPalette, { groups: makeGroups(), open: true, shortcut: false }),
      ]),
    }))
    try {
      await macrotask()
      const lists = [...document.body.querySelectorAll<HTMLElement>('[role="listbox"]')]
      const inputs = [...document.body.querySelectorAll<HTMLInputElement>('input[role="combobox"]')]
      expect(lists).toHaveLength(2)
      expect(inputs).toHaveLength(2)
      expect(new Set(lists.map(list => list.id)).size).toBe(2)
      expect(inputs.map(input => input.getAttribute('aria-controls')).sort()).toEqual(lists.map(list => list.id).sort())
      expect(new Set([...document.body.querySelectorAll('[role="option"]')].map(option => option.id)).size).toBe(6)
    }
    finally {
      both.unmount()
    }
  })

  it('two simultaneously-mounted instances - one controlled, one on the shared singleton - stay independent', async () => {
    const controlledGroups = [{ label: 'Controlled group', items: [{ label: 'Controlled item' }] }]
    const sharedGroups = [{ label: 'Shared group', items: [{ label: 'Shared item' }] }]

    wrapper = await mountSuspended(CommandPalette, { props: { groups: controlledGroups, open: false } })
    const shared = await mountSuspended(CommandPalette, { props: { groups: sharedGroups } })

    useCommandPalette().open()
    await macrotask()

    const dialogs = document.body.querySelectorAll('[role="dialog"][data-state="open"]')
    expect(dialogs).toHaveLength(1)
    expect(dialogs[0]?.textContent).toContain('Shared item')

    shared.unmount()
  })

  it('v-model:search-term exposes the query, follows the parent, and resets on close', async () => {
    const term = ref('folder')
    const open = ref(true)
    const emittedTerms: string[] = []

    // A tiny parent harness so the model is genuinely two-way, like a real
    // `v-model:search-term` binding rather than a one-off prop snapshot.
    wrapper = await mountSuspended(defineComponent({
      setup: () => () => h(CommandPalette, {
        'groups': makeGroups(),
        'open': open.value,
        'shortcut': false,
        'searchTerm': term.value,
        'onUpdate:searchTerm': (value: string) => {
          term.value = value
          emittedTerms.push(value)
        },
        'onUpdate:open': (value: boolean) => {
          open.value = value
        },
      }),
    }))
    await macrotask()

    expect(searchInput().value).toBe('folder')
    expect(optionLabels()).toEqual(['New folder'])

    // The parent can set the query directly.
    term.value = 'file'
    await macrotask()
    expect(searchInput().value).toBe('file')
    expect(optionLabels()).toEqual(['New file'])

    // Typing flows back up to the parent.
    await type('folder')
    expect(emittedTerms.at(-1)).toBe('folder')
    expect(term.value).toBe('folder')

    // Closing clears it through the emit; reopening starts from an empty query.
    open.value = false
    await macrotask()
    expect(emittedTerms.at(-1)).toBe('')
    expect(term.value).toBe('')
    open.value = true
    await macrotask()
    expect(searchInput().value).toBe('')
  })

  it('a group with ignoreFilter renders its items unchanged while other groups still fuzzy filter', async () => {
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, {
      props: {
        groups: [
          { label: 'Actions', items: [{ label: 'New file' }, { label: 'New folder' }] },
          { label: 'Results', ignoreFilter: true, items: [{ label: 'Zebra report' }, { label: 'Apple report' }, { label: 'Middleware' }] },
        ],
      },
    })
    await macrotask()

    // "report" matches nothing in Actions, but the ignored group is untouched.
    await type('report')
    expect(optionLabels()).toEqual(['Zebra report', 'Apple report', 'Middleware'])

    // A query that does match Actions keeps the ignored group's authoring order.
    await type('nf')
    expect(optionLabels()).toEqual(['New file', 'New folder', 'Zebra report', 'Apple report', 'Middleware'])
  })

  it('the component-level ignoreFilter applies to all groups unless a group opts out', async () => {
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, {
      props: {
        ignoreFilter: true,
        groups: [
          { label: 'Unfiltered', items: [{ label: 'Alpha' }, { label: 'Beta' }] },
          { label: 'Filtered', ignoreFilter: false, items: [{ label: 'Alpha command' }, { label: 'Beta command' }] },
        ],
      },
    })
    await macrotask()

    await type('alpha')
    expect(optionLabels()).toEqual(['Alpha', 'Beta', 'Alpha command'])
  })

  it('loading shows a non-blocking spinner while typing and filtering still work', async () => {
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups(), loading: true } })
    await macrotask()

    const dialog = document.body.querySelector('[role="dialog"]')!
    expect(dialog.querySelector('.animate-spin')).toBeTruthy()
    expect(dialog.querySelector('[aria-busy="true"]')).toBeTruthy()
    expect(searchInput().disabled).toBe(false)
    expect(searchInput().readOnly).toBe(false)
    expect(document.body.textContent).toContain('Loading')

    await type('folder')
    expect(optionLabels()).toEqual(['New folder'])
  })

  it('has no loading indicator without the prop, preserving default behaviour', async () => {
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, { props: { groups: makeGroups() } })
    await macrotask()

    expect(document.body.querySelector('.animate-spin')).toBeFalsy()
    expect(document.body.querySelector('[aria-busy="true"]')).toBeFalsy()
  })

  it('navigates and activates items across filtered and unfiltered groups', async () => {
    const onSelectAction = vi.fn()
    const onSelectResult = vi.fn()
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, {
      props: {
        groups: [
          { label: 'Actions', items: [{ label: 'New file', onSelect: onSelectAction, shortcut: 'mod+n', hotkey: true }] },
          { label: 'Results', ignoreFilter: true, items: [{ label: 'Remote doc', onSelect: onSelectResult, shortcut: 'mod+r', hotkey: true }] },
        ],
      },
    })
    await macrotask()

    await type('nf')
    expect(optionLabels()).toEqual(['New file', 'Remote doc'])

    expect(highlightedLabel()).toBe('New file')

    searchInput().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(highlightedLabel()).toBe('Remote doc')

    searchInput().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await macrotask()
    expect(onSelectResult).toHaveBeenCalledOnce()
    expect(onSelectAction).not.toHaveBeenCalled()
    expect(document.body.querySelector('[role="dialog"][data-state="open"]')).toBeFalsy()

    // Item hotkeys stay live for unfiltered groups too after reopening.
    useCommandPalette().open()
    await macrotask()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', ctrlKey: true, bubbles: true, cancelable: true }))
    await macrotask()
    expect(onSelectResult).toHaveBeenCalledTimes(2)
  })

  it('shows the empty state only when every group is empty after filtering', async () => {
    useCommandPalette().open()
    wrapper = await mountSuspended(CommandPalette, {
      props: {
        groups: [
          { label: 'Actions', items: [{ label: 'New file' }] },
          { label: 'Results', ignoreFilter: true, items: [] },
        ],
      },
    })
    await macrotask()

    await type('zzz')
    expect(optionLabels()).toEqual([])
    expect(document.body.textContent).toContain('No results found')

    // A single surviving item in an ignored group is enough to hide it.
    await wrapper.setProps({
      groups: [
        { label: 'Actions', items: [{ label: 'New file' }] },
        { label: 'Results', ignoreFilter: true, items: [{ label: 'Remote doc' }] },
      ],
    })
    await macrotask()
    expect(optionLabels()).toEqual(['Remote doc'])
    expect(document.body.textContent).not.toContain('No results found')
  })
})
