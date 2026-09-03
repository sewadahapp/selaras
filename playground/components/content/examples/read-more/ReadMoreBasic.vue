<template>
  <SReadMore :preview-height="80" class="w-full max-w-md text-sm text-[var(--ui-text-muted)]">
    <p>
      Selaras is a Nuxt module that provides a set of UI components built on
      Reka UI primitives, styled with Tailwind CSS v4 and tailwind-variants.
    </p>
    <p class="mt-2">
      Every component accepts a single <code>:ui</code> prop for per-instance
      style overrides, reads its colors from a small set of semantic CSS
      custom properties instead of hardcoded Tailwind classes, and animates
      with CSS alone - no JavaScript animation library anywhere in the
      library.
    </p>
  </SReadMore>
</template>
