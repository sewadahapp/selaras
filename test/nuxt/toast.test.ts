import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ToastProvider } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Toast from '../../src/runtime/components/Toast.vue'
import { useToast } from '../../src/runtime/composables/use-toast'

// Toast.vue only injects a ToastProviderContext - it doesn't provide one
// itself, since in the real app SApp's own ToastProvider ancestor does that
// (see App.vue). Mounting it bare here would throw on injection, so tests
// wrap it in a real ToastProvider the same way SApp does.
const ToastHarness = defineComponent({
  render: () => h(ToastProvider, () => h(Toast)),
})

// useToast's state is a Nuxt useState singleton, keyed by a fixed string -
// it survives across mounts within the same test file, so each test must
// clear it itself rather than relying on a fresh wrapper to start empty.
afterEach(() => {
  useToast().toasts.value = []
})

// ToastRootImpl teleports each root into the real ToastViewport DOM node
// once the provider's viewport ref is set - invisible to wrapper.find, same
// as Modal's DialogContent (see modal.test.ts). Query document.body instead.
let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('toast', () => {
  it('renders an added toast\'s title and description', async () => {
    const { add } = useToast()
    add({ title: 'Saved', description: 'Your changes were saved.' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('Saved')
    expect(document.body.textContent).toContain('Your changes were saved.')
  })

  it('renders one root per queued toast', async () => {
    const { add } = useToast()
    add({ title: 'First' })
    add({ title: 'Second' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('First')
    expect(document.body.textContent).toContain('Second')
  })

  it('removes the toast from state when its close button is clicked', async () => {
    const { add, toasts } = useToast()
    const id = add({ title: 'Dismiss me' })
    wrapper = await mountSuspended(ToastHarness)
    await new Promise(resolve => setTimeout(resolve, 50))

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')
    expect(closeButton).toBeTruthy()
    closeButton!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(toasts.value.find(t => t.id === id)).toBeUndefined()
  })
})
