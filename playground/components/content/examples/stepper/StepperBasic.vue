<script setup lang="ts">
const items = [
  { title: 'Cart' },
  { title: 'Shipping' },
  { title: 'Payment' },
]
const step = ref(1)
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <SStepper v-model="step" :items="items" />
    <p class="text-sm text-[var(--ui-text-muted)]">
      Step {{ step }}: {{ items[step - 1]?.title }}
    </p>
    <div class="flex gap-2">
      <SButton
        variant="outline"
        color="neutral"
        :disabled="step === 1"
        @click="step--"
      >
        Back
      </SButton>
      <SButton :disabled="step === items.length" @click="step++">
        Next
      </SButton>
    </div>
  </div>
</template>
