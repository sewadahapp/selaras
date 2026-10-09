import { defineComponent, h } from 'vue'

/** Keep the primitive's root behavior while replacing its fixed progress announcement. */
export default defineComponent({
  name: 'StepperRootElement',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('div', attrs, slots.default?.().filter(node => !(
      node.type === 'div'
      && node.props?.role === 'status'
      && node.props?.['aria-live'] === 'polite'
    )))
  },
})
