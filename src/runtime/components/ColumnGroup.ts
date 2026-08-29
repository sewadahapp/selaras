import { defineComponent } from 'vue'

/**
 * Never renders real DOM - see Column.ts. Always maps to a TanStack
 * "group" column def ({ header, columns: [...] }); SColumn always maps to
 * a leaf def. Two components mirror TanStack's own ColumnDef union directly,
 * rather than one component guessing its role from slot content.
 *
 * `default` holds the group's child `<SColumn>`/`<SColumnGroup>` tags;
 * `header`/`footer` (scoped with `{ column }`) customize the group's own
 * header/footer cell, falling back to the plain string props when unset.
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
