<script setup lang="ts">
definePageMeta({ layout: 'landing' })

// SButton's `as` accepts a real component reference, not a bare tag-name
// string - resolveComponent is how a plain h()-based Primitive gets access
// to a globally-registered one like NuxtLink for client-side navigation.
const NuxtLinkComponent = resolveComponent('NuxtLink')

const activeTab = ref('one')
const selectValue = ref('apple')

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]

const accordionItems = [
  { value: 'tokens', label: 'Where do the colors come from?' },
  { value: 'ui', label: 'How does theming work?' },
]

const values = [
  {
    title: 'Real tokens',
    body: 'Every color traces back to Moon Design System’s published values, converted to OKLCH for a perceptually even 50–900 scale – not hand-picked hex codes.',
  },
  {
    title: 'One :ui prop',
    body: 'Every slot in every component takes the same override shape, merged with tailwind-merge. No prop-per-part sprawl to learn.',
  },
  {
    title: 'CSS-only motion',
    body: 'Transitions and animations ship as plain CSS. No animation runtime, no extra bytes just for a hover state.',
  },
  {
    title: 'Nuxt-native',
    body: 'Components and composables auto-import. Add the module, start typing <S.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <SContainer size="lg" class="flex flex-col gap-10 py-20 sm:py-28">
      <div class="flex flex-col gap-6">
        <p class="text-xs tracking-[0.2em] text-[var(--ui-text-muted)] uppercase">
          Selaras — Indonesian for “in harmony”
        </p>
        <h1 class="text-4xl leading-[1.05] font-medium tracking-tight text-[var(--ui-text)] sm:text-6xl">
          Design tokens,<br>in alignment.
        </h1>
        <p class="max-w-xl text-lg text-[var(--ui-text-muted)]">
          A UI component library for Nuxt, themed with <code class="font-mono text-[var(--ui-text)]">tv()</code> and CSS variables – every color a real, measured token, every component styled through one shared <code class="font-mono text-[var(--ui-text)]">:ui</code> prop.
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <SButton size="lg" :as="NuxtLinkComponent" to="/components/elements/button">
            Browse components
          </SButton>
          <SButton size="lg" variant="ghost" as="a" href="https://github.com/sewadahapp/selaras" target="_blank" rel="noopener">
            View source
          </SButton>
        </div>
      </div>

      <div class="rounded-[var(--ui-radius-lg)] border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4 sm:p-8">
        <HarmonyStrip />
      </div>
    </SContainer>

    <!-- Showcase -->
    <div class="border-t border-[var(--ui-border)] bg-[var(--ui-bg-elevated)]">
      <SContainer size="lg" class="flex flex-col gap-8 py-16">
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl font-medium tracking-tight text-[var(--ui-text)]">
            Built from real components
          </h2>
          <p class="text-[var(--ui-text-muted)]">
            Every example on this site renders the actual library – nothing here is a mockup.
          </p>
        </div>

        <div class="flex flex-col gap-8 rounded-[var(--ui-radius-lg)] border border-[var(--ui-border)] bg-[var(--ui-bg)] p-8">
          <div class="flex flex-wrap items-center gap-3">
            <SButton>Solid</SButton>
            <SButton variant="soft">
              Soft
            </SButton>
            <SButton variant="outline">
              Outline
            </SButton>
            <SButton color="secondary">
              Secondary
            </SButton>
            <SButton color="danger">
              Danger
            </SButton>
            <SSelect v-model="selectValue" class="w-40" :items="fruitItems" />
          </div>

          <STabs
            v-model="activeTab"
            class="w-full max-w-md"
            :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]"
          >
            <template #one>
              Tab one content.
            </template>
            <template #two>
              Tab two content.
            </template>
          </STabs>

          <SAccordion :items="accordionItems" class="max-w-xl" :default-value="['tokens']">
            <template #tokens>
              From Moon Design System's real published Figma variables, resolved and converted to OKLCH – see the <NuxtLink to="/components/elements/button" class="underline">
                component docs
              </NuxtLink>.
            </template>
            <template #ui>
              Every component's every slot takes the same <code class="font-mono">:ui</code> override shape.
            </template>
          </SAccordion>
        </div>
      </SContainer>
    </div>

    <!-- Value props -->
    <SContainer size="lg" class="flex flex-col gap-8 py-16">
      <h2 class="text-2xl font-medium tracking-tight text-[var(--ui-text)]">
        Why Selaras
      </h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div
          v-for="value in values"
          :key="value.title"
          class="flex flex-col gap-2 rounded-[var(--ui-radius-lg)] border border-[var(--ui-border)] p-6"
        >
          <h3 class="text-sm font-medium text-[var(--ui-text)]">
            {{ value.title }}
          </h3>
          <p class="text-sm text-[var(--ui-text-muted)]">
            {{ value.body }}
          </p>
        </div>
      </div>
    </SContainer>

    <!-- Closing CTA -->
    <div class="border-t border-[var(--ui-border)]">
      <SContainer size="lg" class="flex flex-col items-center gap-4 py-20 text-center">
        <h2 class="text-2xl font-medium tracking-tight text-[var(--ui-text)]">
          Start with a component.
        </h2>
        <SButton size="lg" :as="NuxtLinkComponent" to="/components/elements/button">
          Browse components
        </SButton>
      </SContainer>
    </div>
  </div>
</template>
