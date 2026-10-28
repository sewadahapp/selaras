<script setup lang="ts">
import { formatDocsMessage } from '../utils/docs-messages'

const { locale, locales, localeOption, hasLocaleSwitching, setLocale } = useDocsLocale()
const messages = useDocsMessages()
const open = ref(false)
// A root locale redirect can hydrate a different locale than the prerendered
// trigger. Replace that trigger after hydration so its icon and label match.
const hydrated = ref(false)
onMounted(() => {
  hydrated.value = true
})

const nextLocale = computed(() => locales.value.find(option => option.code !== locale.value) ?? localeOption.value)
const label = computed(() => formatDocsMessage(messages.value.languageSwitcher, { language: nextLocale.value.name }))
</script>

<template>
  <SPopover v-if="hasLocaleSwitching" v-model:open="open" :positioning="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'p-2' }">
    <SButton
      :key="String(hydrated)"
      variant="ghost"
      color="neutral"
      square
      :aria-label="label"
      :title="label"
      :aria-expanded="open"
    >
      <Icon v-if="localeOption.code === 'en'" aria-hidden="true" name="circle-flags:gb" class="size-5" />
      <Icon v-else-if="localeOption.code === 'id'" aria-hidden="true" name="circle-flags:id" class="size-5" />
      <Icon v-else aria-hidden="true" name="hugeicons:globe-02" class="size-5" />
    </SButton>

    <template #content>
      <section class="w-[min(19rem,calc(100vw-2rem))] p-1" aria-labelledby="docs-language-picker-title">
        <div class="px-1 pb-1.5 pt-0.5">
          <h2 id="docs-language-picker-title" class="text-sm font-semibold text-[var(--selaras-resolved-text-default)]">
            {{ locale === 'id' ? 'Bahasa' : 'Language' }}
          </h2>
          <p class="mt-0.5 text-xs text-[var(--selaras-resolved-text-muted)]">
            {{ locale === 'id' ? 'Pilih bahasa dokumentasi' : 'Choose a documentation language' }}
          </p>
        </div>

        <div class="flex flex-col gap-0.5" role="group" :aria-label="locale === 'id' ? 'Bahasa dokumentasi' : 'Documentation languages'">
          <button
            v-for="option in locales"
            :key="option.code"
            type="button"
            class="group flex w-full items-center gap-2.5 rounded-[var(--selaras-resolved-radius-md)] border p-2 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--_selaras-color-focus)]"
            :class="locale === option.code
              ? 'border-[var(--selaras-resolved-color-primary-fill)] bg-[var(--selaras-resolved-surface-elevated)]'
              : 'border-transparent hover:bg-[var(--selaras-resolved-surface-elevated)]'"
            :aria-pressed="locale === option.code"
            @click="setLocale(option.code); open = false"
          >
            <span aria-hidden="true" class="flex size-10 shrink-0 items-center justify-center">
              <Icon v-if="option.code === 'en'" name="circle-flags:gb" class="size-8" />
              <Icon v-else-if="option.code === 'id'" name="circle-flags:id" class="size-8" />
              <Icon v-else name="hugeicons:globe-02" class="size-8" />
            </span>

            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-[var(--selaras-resolved-text-default)]">
                {{ option.name }}
              </span>
              <span class="mt-0.5 block text-xs text-[var(--selaras-resolved-text-muted)]">
                {{ option.language ?? option.code }}
              </span>
            </span>

            <svg
              v-if="locale === option.code"
              aria-hidden="true"
              viewBox="0 0 20 20"
              class="size-4 shrink-0 text-[var(--selaras-resolved-color-primary-text)]"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m4 10 4 4 8-8" />
            </svg>
          </button>
        </div>
      </section>
    </template>
  </SPopover>
</template>
