import { defineComponent } from 'vue'

/**
 * Never renders real DOM - STable reads this component's VNode props/slots
 * directly out of its own default slot (via table-columns.ts) to build a
 * TanStack ColumnDef, a technique several Vue table libraries use for a
 * <Table>/<Column> children-as-config API. Mounting <SColumn> anywhere
 * other than inside <STable> is a silent no-op, never an error.
 *
 * Three named slots read the same way: `default` (scoped with `{ row,
 * value }`) customizes a cell's content, `header`/`footer` (scoped with
 * `{ column }`) customize the column's header/footer cell - all three fall
 * back to the plain `header`/`footer` string props when unset.
 */
export default defineComponent({
  name: 'SColumn',
  props: {
    field: {
      type: String,
      required: true,
    },
    header: {
      type: String,
      default: undefined,
    },
    footer: {
      type: String,
      default: undefined,
    },
    sortable: {
      type: Boolean,
      default: true,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    /** Sticks this column to the left/right edge during horizontal scroll. */
    pinned: {
      type: String as () => 'left' | 'right' | undefined,
      default: undefined,
    },
  },
  render() {
    return null
  },
})
