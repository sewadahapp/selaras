import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Alert from '../../src/runtime/components/Alert.vue'

describe('alert', () => {
  it('renders title and description from props', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: { title: 'Heads up', description: 'Something worth noting.' },
    })

    expect(wrapper.text()).toContain('Heads up')
    expect(wrapper.text()).toContain('Something worth noting.')
  })

  it('the title and description slots override the props', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: { title: 'Prop title', description: 'Prop description' },
      slots: { title: () => 'Slot title', description: () => 'Slot description' },
    })

    expect(wrapper.text()).toContain('Slot title')
    expect(wrapper.text()).toContain('Slot description')
    expect(wrapper.text()).not.toContain('Prop title')
  })

  it('falls back to the color\'s own default icon when icon is unset', async () => {
    const wrapper = await mountSuspended(Alert, { props: { color: 'danger', title: 'Error' } })

    const icon = wrapper.find('.iconify')
    expect(icon.classes()).toContain('i-hugeicons:cancel-circle')
  })

  it('an explicit icon overrides the color\'s own default', async () => {
    const wrapper = await mountSuspended(Alert, { props: { color: 'danger', icon: 'lucide:bug', title: 'Error' } })

    const icon = wrapper.find('.iconify')
    expect(icon.classes()).toContain('i-lucide:bug')
  })

  it('renders no icon with no color and no explicit icon', async () => {
    const wrapper = await mountSuspended(Alert, { props: { title: 'Plain' } })

    expect(wrapper.find('.iconify').exists()).toBe(false)
  })

  it('renders no close button without closable', async () => {
    const wrapper = await mountSuspended(Alert, { props: { title: 'Info' } })

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('clicking the close button emits close', async () => {
    const wrapper = await mountSuspended(Alert, { props: { title: 'Info', closable: true } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('renders the actions slot when given, not otherwise', async () => {
    const withoutActions = await mountSuspended(Alert, { props: { title: 'Info' } })
    expect(withoutActions.text()).not.toContain('Retry')

    const withActions = await mountSuspended(Alert, {
      props: { title: 'Info' },
      slots: { actions: () => 'Retry' },
    })
    expect(withActions.text()).toContain('Retry')
  })

  it('merges a string :ui.root override with the theme classes', async () => {
    const wrapper = await mountSuspended(Alert, { props: { title: 'Info', ui: { root: 'custom-class' } } })

    expect(wrapper.classes()).toContain('custom-class')
  })
})
