<script setup lang="ts">
import { ref } from 'vue'
import Autocomplete from '../../../src/runtime/components/Autocomplete.vue'
import Select from '../../../src/runtime/components/Select.vue'

defineProps<{ kind: 'select' | 'autocomplete' }>()
const items = [{ value: 0, label: 'Numeric zero' }, { value: 1, label: 'Numeric one' }]
const multiple = ref(true)
const controlled = ref<number | number[] | undefined>([0, 1])
const controlledSearch = ref('')
const uncontrolledProposal = ref<number | number[]>()
const controlledProposals = ref(0)

function toggleMode() {
  multiple.value = !multiple.value
  controlled.value = multiple.value
    ? Array.isArray(controlled.value) ? [...controlled.value] : controlled.value === undefined ? [] : [controlled.value]
    : Array.isArray(controlled.value) ? controlled.value[0] : controlled.value
}
</script>

<template>
  <form :id="`${kind}-mode-form`">
    <Select
      v-if="kind === 'select'" :items="items" :multiple="multiple"
      :default-value="[0, 1]" name="uncontrolled" display-mode="chip"
      aria-label="Uncontrolled select" @update:model-value="uncontrolledProposal = $event"
    />
    <Autocomplete
      v-else :items="items" :multiple="multiple" force-selection
      :default-value="[0, 1]" name="uncontrolled" display-mode="chip"
      aria-label="Uncontrolled autocomplete" @update:model-value="uncontrolledProposal = $event"
    />
    <Select
      v-if="kind === 'select'" v-model="controlled" :items="items" :multiple="multiple"
      :default-value="[0, 1]" name="controlled" display-mode="chip"
      aria-label="Controlled select" @update:model-value="controlledProposals++"
    />
    <Autocomplete
      v-else v-model="controlled" v-model:search-term="controlledSearch" :items="items" :multiple="multiple" force-selection
      :default-value="[0, 1]" name="controlled" display-mode="chip"
      aria-label="Controlled autocomplete" @update:model-value="controlledProposals++"
    />
    <button type="button" @click="toggleMode">
      {{ multiple ? 'Use single selection' : 'Use multiple selection' }}
    </button>
    <button type="reset">
      Reset mode selections
    </button>
    <output aria-label="Uncontrolled proposal">{{ JSON.stringify(uncontrolledProposal) }}</output>
    <output aria-label="Controlled proposal count">{{ controlledProposals }}</output>
  </form>
</template>
