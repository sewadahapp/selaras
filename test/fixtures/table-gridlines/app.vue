<script setup>
const route = useRoute()
useHead({ htmlAttrs: { class: route.query.dark ? 'dark' : '' } })
const rows = [{ name: 'Alice', email: 'alice@example.com' }, { name: 'Bob', email: 'bob@example.com' }]
</script>

<template>
  <SApp>
    <div style="width: 340px; margin: 20px">
      <STable
        :data="route.query.empty ? [] : rows"
        :gridlines="route.query.grid !== 'false'"
        :loading="!!route.query.loading"
        scrollable
        scroll-height="200px"
        :ui="{ wrapper: { 'data-frame': 'table' }, table: { style: { minWidth: '700px' } } }"
      >
        <template v-if="route.query.grouped">
          <SColumnGroup header="Contact">
            <SColumn field="email" header="Email" />
            <SColumn field="city" header="City" />
          </SColumnGroup>
          <SColumn field="name" header="Name" />
        </template>
        <template v-else>
          <SColumn field="name" header="Name" footer="Total" />
          <SColumn field="email" header="Email" footer="2 users" />
        </template>
      </STable>
    </div>
  </SApp>
</template>
