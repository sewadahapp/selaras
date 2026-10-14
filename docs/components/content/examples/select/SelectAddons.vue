<script setup lang="ts">
const currency = ref<'IDR' | 'USD' | 'EUR'>('IDR')
const details = ref(false)
</script>

<template>
  <div class="w-full max-w-sm space-y-2">
    <SSelect v-model="currency" :items="['IDR', 'USD', 'EUR']" clearable aria-label="Currency">
      <template #leading>
        <span class="text-xs">Pay in</span>
      </template>
      <template #trailing="{ disabled, buttonSize }">
        <SButton type="button" :disabled="disabled" :size="buttonSize" variant="text" color="neutral" square icon="hugeicons:information-circle" aria-label="Currency details" :aria-pressed="details" @click="details = !details" />
      </template>
    </SSelect>
    <p v-if="details" class="text-sm text-[var(--selaras-resolved-text-muted)]">
      Choose the currency used for your payment.
    </p>
  </div>
</template>
