<script setup lang="ts">
import type { SelarasDocsErrorKind } from '../../types'

const props = withDefaults(defineProps<{
  kind?: SelarasDocsErrorKind
  pending?: boolean
  showHome?: boolean
}>(), { kind: 'page', pending: false, showHome: undefined })

const emit = defineEmits<{ retry: [], home: [event: MouseEvent] }>()
const appConfig = useAppConfig()
const messages = useDocsMessages()
const config = useRuntimeConfig()
const homeHref = computed(() => {
  const path = appConfig.selarasDocs?.errors?.homeTo ?? '/'
  const base = config.app.baseURL.replace(/\/$/, '')
  return `${base}/${path.replace(/^\//, '')}`
})
const headingId = useId()
const heading = useTemplateRef<HTMLElement>('heading')
onMounted(() => {
  if (props.kind !== 'example')
    heading.value?.focus({ preventScroll: true })
})
const copy = computed(() => {
  const defaults = {
    notFound: { title: messages.value.notFoundTitle, description: messages.value.notFoundDescription },
    fatal: { title: messages.value.fatalTitle, description: messages.value.fatalDescription },
    page: { title: messages.value.pageTitle, description: messages.value.pageDescription },
    example: { title: messages.value.exampleTitle, description: messages.value.exampleDescription },
  }
  return { ...defaults[props.kind], ...appConfig.selarasDocs?.errors?.[props.kind] }
})
const labels = computed(() => appConfig.selarasDocs?.errors ?? {})
const showHome = computed(() => props.showHome ?? props.kind !== 'example')
</script>

<template>
  <section
    class="selaras-docs-error-state not-prose"
    :data-error-kind="kind"
    :aria-labelledby="headingId"
    :role="kind === 'example' ? 'alert' : undefined"
  >
    <div class="selaras-docs-error-artwork">
      <slot name="illustration">
        <DocsErrorIllustration :missing="kind === 'notFound'" />
      </slot>
    </div>
    <div class="selaras-docs-error-copy">
      <component :is="kind === 'example' ? 'h3' : 'h1'" :id="headingId" ref="heading" class="selaras-docs-error-title" :tabindex="kind === 'example' ? undefined : -1">
        {{ copy.title }}
      </component>
      <p class="selaras-docs-error-description">
        {{ copy.description }}
      </p>
      <div class="selaras-docs-error-actions">
        <SButton v-if="kind !== 'notFound'" :loading="pending" :disabled="pending" @click="emit('retry')">
          {{ pending ? labels.retryingLabel ?? messages.retrying : kind === 'fatal' ? labels.reloadLabel ?? messages.reload : labels.retryLabel ?? messages.retry }}
        </SButton>
        <SButton v-if="showHome" as="a" :href="homeHref" :variant="kind === 'notFound' ? 'solid' : 'outline'" :color="kind === 'notFound' ? 'primary' : 'neutral'" @click="emit('home', $event)">
          {{ labels.homeLabel ?? messages.home }}
        </SButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.selaras-docs-error-state {
  width: min(100%, 42rem);
  margin: 3rem auto;
  color: var(--selaras-resolved-text-default);
  text-align: center;
}

.selaras-docs-error-artwork {
  width: min(100%, 22rem);
  margin: 0 auto 1.5rem;
}

.selaras-docs-error-artwork :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

.selaras-docs-error-title {
  margin: 0;
  font-size: clamp(1.75rem, 1.4rem + 1vw, 2.5rem);
  font-weight: 650;
  line-height: 1.15;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.selaras-docs-error-title:focus {
  outline: none;
}

.selaras-docs-error-description {
  max-width: 44ch;
  margin: 1rem auto 0;
  color: var(--selaras-resolved-text-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.selaras-docs-error-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.selaras-docs-error-state[data-error-kind="example"] {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  margin: 0;
  padding: 1.5rem;
  border: 1px solid var(--selaras-resolved-border-default);
  border-radius: var(--selaras-resolved-radius-lg);
  background: var(--selaras-resolved-surface-elevated);
  text-align: start;
}

[data-error-kind="example"] .selaras-docs-error-artwork {
  flex: none;
  width: 6rem;
  margin: 0;
}

[data-error-kind="example"] .selaras-docs-error-title {
  font-size: 1rem;
  line-height: 1.4;
  letter-spacing: normal;
}

[data-error-kind="example"] .selaras-docs-error-description {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
}

[data-error-kind="example"] .selaras-docs-error-actions {
  justify-content: flex-start;
  margin-top: 1rem;
}

@media (max-width: 30rem) {
  .selaras-docs-error-state[data-error-kind="example"] {
    align-items: flex-start;
    flex-direction: column;
  }

  [data-error-kind="example"] .selaras-docs-error-artwork {
    display: none;
  }
}
</style>
