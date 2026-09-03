import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

describe('commandPalette', () => {
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
})
