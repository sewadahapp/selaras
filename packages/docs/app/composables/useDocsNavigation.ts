export function useDocsNavigation() {
  return useAsyncData('selaras-docs-navigation', () =>
    queryCollectionNavigation('docs').order('order', 'ASC'))
}
