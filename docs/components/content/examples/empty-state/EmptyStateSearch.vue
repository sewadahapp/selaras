<script setup lang="ts">
const search = ref('design')
const selected = ref<string>()
const items = ['Engineering', 'Marketing', 'Operations']
</script>

<template>
  <div class="w-full max-w-lg">
    <SListbox v-model="selected" v-model:search-term="search" :items="items" searchable aria-label="Departments">
      <template #empty-filter>
        <SEmptyState title="No matching departments" description="Try another search or clear the filter." :ui="{ root: 'py-6', title: 'text-sm' }" />
      </template>
      <template #footer>
        <SButton size="sm" variant="outline" color="neutral" @click="search = ''">
          Clear search
        </SButton>
      </template>
    </SListbox>
  </div>
</template>
