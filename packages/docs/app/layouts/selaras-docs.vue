<template>
  <div class="selaras-docs-root min-h-screen text-[var(--selaras-resolved-text-default)]">
    <a class="selaras-docs-skip-link" href="#selaras-docs-main">Skip to content</a>
    <DocsHeader />
    <div class="selaras-docs-shell">
      <DocsSidebar />
      <main id="selaras-docs-main" class="selaras-docs-main" tabindex="-1">
        <slot />
      </main>
    </div>
    <DocsFooter />
  </div>
</template>
