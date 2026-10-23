<script setup lang="ts">
import { formatDocsMessage } from '../utils/docs-messages'

const { locale, locales, localeOption, hasLocaleSwitching, setLocale } = useDocsLocale()
const messages = useDocsMessages()

const items = computed(() => [[
  ...locales.value.map(option => ({
    label: option.name,
    icon: option.code === locale.value ? 'hugeicons:checkmark-circle-02' : undefined,
    onSelect: () => setLocale(option.code),
  })),
]])

const nextLocale = computed(() => locales.value.find(option => option.code !== locale.value) ?? localeOption.value)
const label = computed(() => formatDocsMessage(messages.value.languageSwitcher, { language: nextLocale.value.name }))
</script>

<template>
  <SDropdown v-if="hasLocaleSwitching" :items="items">
    <SButton
      variant="ghost"
      color="neutral"
      size="sm"
      icon="hugeicons:translation"
      :aria-label="label"
      :title="label"
      class="selaras-docs-language-toggle"
    >
      <span class="uppercase">{{ localeOption.code }}</span>
    </SButton>
  </SDropdown>
</template>
