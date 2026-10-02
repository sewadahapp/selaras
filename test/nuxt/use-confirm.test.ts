import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import ConfirmRenderer from '../../src/runtime/components/ConfirmRenderer.vue'
import { useConfirm } from '../../src/runtime/composables/use-confirm'
import { useConfirmService } from '../../src/runtime/internal/programmatic-services'

let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined
let result: Promise<boolean> | undefined

const Harness = defineComponent({
  setup() {
    const { confirm } = useConfirm()
    return () => h('button', {
      'data-testid': 'open-confirm',
      'onClick': () => { result = confirm({ title: 'Delete record?', description: 'This cannot be undone.', confirmLabel: 'Delete', cancelLabel: 'Keep', confirmColor: 'danger' }) },
    }, 'Open')
  },
})

const App = defineComponent({ render: () => [h(Harness), h(ConfirmRenderer)] })

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  result = undefined
  useConfirmService().dispose()
})

async function openConfirm() {
  await wrapper!.find('[data-testid="open-confirm"]').trigger('click')
  await nextTick()
}

describe('useConfirm', () => {
  it('resolves true for explicit confirmation and passes options to SAlertDialog', async () => {
    wrapper = await mountSuspended(App)
    await openConfirm()

    const dialog = document.body.querySelector('[role="alertdialog"]')!
    expect(dialog.textContent).toContain('Delete record?')
    expect(dialog.textContent).toContain('This cannot be undone.')
    expect(dialog.textContent).toContain('Delete')
    expect(dialog.textContent).toContain('Keep')

    Array.from(dialog.querySelectorAll<HTMLButtonElement>('button')).find(button => button.textContent?.trim() === 'Delete')!.click()
    expect(await result).toBe(true)
  })

  it('resolves false for cancellation', async () => {
    wrapper = await mountSuspended(App)
    await openConfirm()
    document.body.querySelector<HTMLButtonElement>('[role="alertdialog"] button[data-selaras-color="neutral"]')!.click()
    expect(await result).toBe(false)
  })

  it('resolves false when dismissed with Escape', async () => {
    wrapper = await mountSuspended(App)
    await openConfirm()
    document.body.querySelector('[role="alertdialog"]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(await result).toBe(false)
  })
})
