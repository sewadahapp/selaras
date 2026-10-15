<script setup lang="ts">
withDefaults(defineProps<{ heading?: 'h1' | 'h2' }>(), { heading: 'h1' })

const appConfig = useAppConfig()
const config = useRuntimeConfig()
const headingId = useId()
const copy = computed(() => appConfig.selarasDocs?.empty ?? {})
const homeHref = computed(() => {
  const path = appConfig.selarasDocs?.errors?.homeTo ?? '/'
  return `${config.app.baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
})
</script>

<template>
  <section class="selaras-docs-empty-state not-prose" data-docs-empty-state :aria-labelledby="headingId">
    <div class="selaras-docs-empty-artwork">
      <slot name="illustration">
        <DocsErrorIllustration missing />
      </slot>
    </div>
    <component :is="heading" :id="headingId" class="selaras-docs-empty-title">
      {{ copy.title ?? 'No content yet' }}
    </component>
    <p class="selaras-docs-empty-description">
      {{ copy.description ?? 'There’s no content on this page yet. You can explore the rest of the documentation using the navigation.' }}
    </p>
    <SButton as="a" :href="homeHref" variant="outline" color="neutral" class="selaras-docs-empty-action">
      {{ appConfig.selarasDocs?.errors?.homeLabel ?? 'Back to documentation' }}
    </SButton>
  </section>
</template>

<style scoped>
.selaras-docs-empty-state {
  max-width: 32rem;
  margin: 3rem auto;
  color: var(--selaras-resolved-text-default);
  text-align: center;
}

.selaras-docs-empty-artwork {
  width: min(100%, 18rem);
  margin: 0 auto 1.5rem;
}

.selaras-docs-empty-artwork :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

.selaras-docs-empty-title {
  margin: 0;
  font-size: clamp(1.5rem, 1.25rem + 1vw, 2rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.selaras-docs-empty-description {
  max-width: 42ch;
  margin: 0.875rem auto 0;
  color: var(--selaras-resolved-text-muted);
  line-height: 1.7;
  text-wrap: pretty;
}

.selaras-docs-empty-action {
  margin-top: 1.5rem;
}
</style>
