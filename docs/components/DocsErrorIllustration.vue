<script setup lang="ts">
defineProps<{ missing?: boolean }>()
</script>

<template>
  <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M33 174H367M33 150H367M33 126H367M33 102H367M33 78H367" stroke="var(--selaras-resolved-border-default)" stroke-width="1.5" stroke-linecap="round" />
    <path d="M74 172V61L148 45V155" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M76 80L147 65" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="9" stroke-linecap="round" />
    <ellipse cx="60" cy="173" rx="17" ry="12" transform="rotate(-18 60 173)" fill="var(--selaras-resolved-color-primary-fill)" />
    <ellipse cx="134" cy="156" rx="17" ry="12" transform="rotate(-18 134 156)" fill="var(--selaras-resolved-color-primary-fill)" />
    <path d="M199 178V88L250 76V119" stroke="var(--selaras-resolved-border-default)" stroke-width="3" stroke-dasharray="5 7" stroke-linecap="round" stroke-linejoin="round" />
    <ellipse cx="185" cy="179" rx="16" ry="11" transform="rotate(-18 185 179)" fill="var(--selaras-resolved-color-primary-subtle)" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="2" stroke-dasharray="4 5" />
    <g v-if="missing">
      <circle cx="258" cy="157" r="30" fill="var(--selaras-resolved-surface-default)" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="3" />
      <path d="M280 179L306 205" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="6" stroke-linecap="round" />
      <path d="M247 157H269" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="3" stroke-linecap="round" />
    </g>
    <g v-else>
      <circle cx="258" cy="157" r="30" fill="var(--selaras-resolved-surface-default)" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="3" />
      <path d="M247 148V166M260 148V166" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="5" stroke-linecap="round" />
    </g>
    <path d="M333 123V50" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="4" stroke-linecap="round" />
    <path d="M334 53C354 60 357 73 347 84" stroke="var(--selaras-resolved-color-primary-fill)" stroke-width="4" stroke-linecap="round" />
    <ellipse cx="319" cy="124" rx="16" ry="11" transform="rotate(-18 319 124)" fill="var(--selaras-resolved-color-primary-fill)" />
  </svg>
</template>
