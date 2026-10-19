import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { NuxtErrorBoundary } from '#components'
import { useRouter } from '#imports'
import DocsErrorBoundary from '../../packages/docs/app/components/DocsErrorBoundary.vue'

const ErrorState = defineComponent({
  props: ['kind'],
  emits: ['retry'],
  setup(props, { emit }) {
    return () => h('button', { 'data-error-kind': props.kind, 'onClick': () => emit('retry') }, 'Try again')
  },
})

function harness(kind: 'page' | 'example' = 'page', statusKey?: 'statusCode' | 'status') {
  const resetKey = ref('first')
  let router: ReturnType<typeof useRouter>
  const Fragile = defineComponent({
    setup() {
      const broken = ref(false)
      return () => {
        if (broken.value)
          throw Object.assign(new Error('Private failure details'), statusKey ? { [statusKey]: 404 } : {})
        return h('button', { 'data-break': '', 'onClick': () => broken.value = true }, 'Break content')
      }
    },
  })
  const App = defineComponent({
    setup() {
      router = useRouter()
      return () => h('main', [
        h('a', { href: '/still-available' }, 'Navigation remains available'),
        h(DocsErrorBoundary, { kind, resetKey: resetKey.value }, () => h(Fragile)),
      ])
    },
  })
  return { App, resetKey, getRouter: () => router! }
}

const options = { global: { components: { DocsErrorState: ErrorState, NuxtErrorBoundary } } }

describe('documentation error isolation', () => {
  it('contains a failed example and remounts it when retried', async () => {
    const { App } = harness('example')
    const wrapper = await mountSuspended(App, options)
    await wrapper.get('[data-break]').trigger('click')
    await nextTick()
    expect(wrapper.get('[data-error-kind]').attributes('data-error-kind')).toBe('example')
    expect(wrapper.text()).toContain('Navigation remains available')
    expect(wrapper.text()).not.toContain('Private failure details')
    await wrapper.get('[data-error-kind]').trigger('click')
    expect(wrapper.find('[data-break]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('resets a failed example when its identity changes', async () => {
    const { App, resetKey } = harness('example')
    const wrapper = await mountSuspended(App, options)
    await wrapper.get('[data-break]').trigger('click')
    await nextTick()
    resetKey.value = 'second'
    await nextTick()
    await nextTick()
    expect(wrapper.find('[data-break]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('clears a page error on navigation so another page can render', async () => {
    const { App, getRouter } = harness()
    const wrapper = await mountSuspended(App, options)
    await wrapper.get('[data-break]').trigger('click')
    await nextTick()
    expect(wrapper.get('[data-error-kind]').attributes('data-error-kind')).toBe('page')
    await getRouter().push('/?recovery=next-page')
    await nextTick()
    expect(wrapper.find('[data-break]').exists()).toBe(true)
    wrapper.unmount()
    await getRouter().push('/')
  })

  it.each(['statusCode', 'status'] as const)('shows a missing-page state for a client-side 404 with %s', async (statusKey) => {
    const { App } = harness('page', statusKey)
    const wrapper = await mountSuspended(App, options)
    await wrapper.get('[data-break]').trigger('click')
    await nextTick()
    expect(wrapper.get('[data-error-kind]').attributes('data-error-kind')).toBe('notFound')
    wrapper.unmount()
  })
})
