import { defineComponent } from 'vue'

/**
 * Never renders real DOM - see Column.ts. Always maps to a TanStack
 * "group" column def ({ header, columns: [...] }); SColumn always maps to
 * a leaf def. Two components mirror TanStack's own ColumnDef union directly,
 * rather than one component guessing its role from slot content.
 */
export default defineComponent({
  name: 'SColumnGroup',
  props: {
    header: {
      type: String,
      default: undefined,
    },
    footer: {
      type: String,
      default: undefined,
    },
  },
  render() {
    return null
  },
})
