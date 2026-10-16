<script setup lang="ts">
import { ref } from 'vue'

const single = ref(0)
const numbers: number[] = [0, 1, 2]
const multiple = ref<number[]>([2])
const assigned = ref<number[]>([2])
const checked = ref<number[]>([])
const rows = [{ label: 'Apple', value: 0 }, { label: 'Apricot', value: 1, disabled: true }, { label: 'Berry', value: 2 }]
const virtual = Array.from({ length: 1000 }, (_, value) => ({ label: `Row ${value}`, value }))
</script>

<template>
  <SApp>
    <main class="tw:space-y-6 tw:p-4">
      <SListbox id="single" v-model="single" :items="numbers" label="Numbers" />
      <output id="single-value">{{ single }}</output>
      <section id="multiple-panel">
        <SListbox id="multiple" v-model="multiple" :items="rows" label="Fruit" multiple checkbox searchable select-all />
      </section>
      <output id="multiple-value">{{ JSON.stringify(multiple) }}</output>
      <form id="assignment-form">
        <STransferList id="transfer" v-model="assigned" v-model:checked="checked" :items="rows" :default-value="[2]" name="assigned" searchable source-label="Available fruit" target-label="Assigned fruit" />
        <button type="reset">
          Reset assignment
        </button>
      </form>
      <output id="assigned-value">{{ JSON.stringify(assigned) }}</output>
      <output id="checked-value">{{ JSON.stringify(checked) }}</output>
      <section id="virtual-panel">
        <SListbox id="virtual" :items="virtual" label="Virtual rows" multiple checkbox searchable virtualize />
      </section>
      <form id="required-form">
        <SListbox id="required" :items="[0, 1]" name="required-choice" label="Required choice" required />
      </form>
    </main>
  </SApp>
</template>
