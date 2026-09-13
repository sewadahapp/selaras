<script setup lang="ts">
import { ref } from 'vue'
import Autocomplete from '../../../src/runtime/components/Autocomplete.vue'

interface Row { id: number, title: string }
const asyncOptions = ref<readonly Row[]>([])
const options: readonly Row[] = [{ id: 0, title: 'Numeric zero' }]
const forced = ref<number | undefined>(7)
const created = ref<(number | string)[]>([0, 'Initial text'])
const submissions = ref(0)
</script>

<template>
  <form id="autocomplete-generic-form" @submit.prevent="submissions++">
    <Autocomplete
      v-model="forced" name="forced-choice" :items="asyncOptions"
      value-key="id" label-key="title" force-selection clearable :default-value="7"
      aria-label="Choose a suggestion" aria-describedby="forced-choice-help"
    />
    <p id="forced-choice-help">
      Choose one of the numeric suggestions.
    </p>
    <button type="button" @click="asyncOptions = [{ id: 7, title: 'Loaded suggestion' }]">
      Load suggestions
    </button>
    <Autocomplete
      v-model="created" name="created-choices" :items="options"
      value-key="id" label-key="title" multiple display-mode="chip"
      :default-value="[0, 'Initial text']" aria-label="Create suggestions"
    />
    <button type="reset">
      Reset suggestions
    </button>
    <button type="submit">
      Submit suggestions
    </button>
    <output aria-label="Suggestion submissions">{{ submissions }}</output>
  </form>
</template>
