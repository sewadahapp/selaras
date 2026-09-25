<script setup lang="ts">
const phone = ref('')
const maskedPhone = ref('')

function updateMask(detail: { maskedValue: string }) {
  maskedPhone.value = detail.maskedValue
}
</script>

<template>
  <div class="grid gap-2">
    <SInput
      v-model="phone"
      v-mask="{ mask: '(###) ###-####', onMask: updateMask }"
      inputmode="tel"
      placeholder="(555) 123-4567"
    />
    <p class="text-sm text-content-muted">
      Raw value: {{ phone || '—' }}<br>
      Masked value: {{ maskedPhone || '—' }}
    </p>
  </div>
</template>
