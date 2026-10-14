<script setup lang="ts">
const city = ref('Bandung')
const details = ref(false)
</script>

<template>
  <div class="w-full max-w-sm space-y-2">
    <SAutocomplete v-model="city" :items="['Bandung', 'Jakarta', 'Surabaya']" clearable dropdown adaptive aria-label="City">
      <template #leading>
        <span class="text-xs">City</span>
      </template>
      <template #trailing="{ disabled, buttonSize }">
        <SButton type="button" :disabled="disabled" :size="buttonSize" variant="text" color="neutral" square icon="hugeicons:information-circle" aria-label="City details" :aria-pressed="details" @click="details = !details" />
      </template>
    </SAutocomplete>
    <p v-if="details" class="text-sm text-[var(--selaras-resolved-text-muted)]">
      Select a suggestion or enter another city.
    </p>
  </div>
</template>
