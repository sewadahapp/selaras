<script setup lang="ts">
defineProps<{ missing?: boolean }>()
</script>

<template>
  <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M40 187H360" stroke="var(--selaras-resolved-border-default)" stroke-width="2" stroke-linecap="round" />
    <rect x="113" y="41" width="148" height="159" rx="12" fill="var(--selaras-resolved-surface-elevated)" stroke="var(--selaras-resolved-border-default)" stroke-width="2" />
    <path d="M144 24H231L277 70V170C277 177 272 182 265 182H144C137 182 132 177 132 170V36C132 29 137 24 144 24Z" fill="var(--selaras-resolved-surface-default)" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M231 25V58C231 65 236 70 243 70H276" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M154 61H193M154 84H213" stroke="var(--selaras-resolved-border-default)" stroke-width="5" stroke-linecap="round" />
    <rect x="154" y="108" width="57" height="48" rx="6" fill="var(--selaras-resolved-color-primary-subtle)" />
    <path v-if="missing" d="M225 113H254V154H225V113Z" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="2" stroke-dasharray="4 5" stroke-linejoin="round" />
    <path v-else d="M233 116V135M233 146V147" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="4" stroke-linecap="round" />
    <path d="M56 153C56 122 84 119 105 132M290 109C318 103 342 122 333 146" stroke="var(--selaras-resolved-border-default)" stroke-width="2" stroke-dasharray="4 7" stroke-linecap="round" />
    <circle cx="55" cy="159" r="6" fill="var(--selaras-resolved-color-primary-fill)" />
    <rect x="311" y="144" width="44" height="37" rx="6" fill="var(--selaras-resolved-color-primary-subtle)" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="2" />
    <path d="M323 163H343M333 153V173" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>
