<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

const email = ref('')
const name = ref('Maya Putri')
const notes = ref('')
const plan = ref<string>()
const appointment = shallowRef<DateValue>()
const dueDate = shallowRef<DateValue>()
const search = ref('')

const plans = [
  { label: 'Starter', value: 'starter' },
  { label: 'Team', value: 'team' },
]
</script>

<template>
  <div class="grid max-w-lg gap-5 sm:grid-cols-2">
    <SFormField label="Email" label-mode="floating" hint="We'll send your receipt here.">
      <SInput v-model="email" type="email" />
    </SFormField>
    <SFormField label="Name" label-mode="floating">
      <SInput v-model="name" icon="hugeicons:user" />
    </SFormField>
    <SFormField label="Plan" label-mode="floating">
      <SInputGroup class="w-full">
        <SSelect v-model="plan" :items="plans" class="min-w-0 flex-1" />
        <SButton type="button" variant="outline" color="neutral">
          Apply
        </SButton>
      </SInputGroup>
    </SFormField>
    <SFormField label="Appointment" label-mode="floating">
      <SDatePicker v-model="appointment" trigger-mode="button" />
    </SFormField>
    <SFormField label="Due date" label-mode="floating">
      <SDatePicker v-model="dueDate" />
    </SFormField>
    <SFormField label="Search" label-mode="floating">
      <SInputGroup class="w-full">
        <SInput v-model="search" />
        <SButton variant="outline" color="neutral">
          Go
        </SButton>
      </SInputGroup>
    </SFormField>
    <SFormField label="Notes" label-mode="floating">
      <STextarea v-model="notes" />
    </SFormField>
  </div>
</template>
