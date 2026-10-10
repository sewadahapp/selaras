export default defineAppConfig({
  selaras: {
    icons: { check: 'test:mark', loading: 'test:mark', search: 'test:mark', chevronRight: 'test:mark', chevronLeft: 'test:mark' },
    messages: { selectAll: 'Check visible', moveToTarget: 'Assign', moveToSource: 'Unassign' },
    ui: { listbox: { slots: { root: 'outline-dashed' } }, transferList: { slots: { header: 'tracking-wide' } } },
  },
})
