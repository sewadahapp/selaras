<script setup lang="ts">
const plan = ref('pro')
</script>

<template>
  <SRadioGroup
    v-model="plan"
    variant="card"
    :items="[
      { label: 'Free', value: 'free' },
      { label: 'Pro', value: 'pro' },
    ]"
  >
    <template #label="{ item }">
      <div>
        <p class="font-medium text-[var(--ui-text)]">
          {{ item.label }}
        </p>
        <p class="text-sm text-[var(--ui-text-muted)]">
          {{ item.value === 'free' ? 'Basic features, community support.' : 'Everything in Free, plus priority support.' }}
        </p>
      </div>
    </template>
  </SRadioGroup>
</template>
