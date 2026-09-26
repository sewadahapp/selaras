<template>
  <div class="selaras-docs-root min-h-screen text-[var(--selaras-resolved-text-default)]">
    <a class="selaras-docs-skip-link" href="#selaras-docs-main">Skip to content</a>
    <DocsHeader />
    <main id="selaras-docs-main" tabindex="-1">
      <slot />
    </main>
    <DocsFooter />
  </div>
</template>
