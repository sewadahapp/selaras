<script setup lang="ts">
interface Team {
  name: string
  lead: string
  subRows?: Team[]
}

const teams = ref<Team[]>([
  {
    name: 'Engineering',
    lead: 'Arif Rahman',
    subRows: [
      {
        name: 'Platform',
        lead: 'Maya Putri',
        subRows: [
          { name: 'Runtime', lead: 'Dina Sari' },
          { name: 'Infrastructure', lead: 'Dave Kim' },
        ],
      },
      { name: 'Applications', lead: 'Cara Lee' },
    ],
  },
  { name: 'Design', lead: 'Nina Patel' },
])

const getTeamId = (team: Team) => team.name
</script>

<template>
  <STable :data="teams" :get-row-id="getTeamId" tree>
    <SColumn field="name" header="Team" />
    <SColumn field="lead" header="Lead" />
  </STable>
</template>
