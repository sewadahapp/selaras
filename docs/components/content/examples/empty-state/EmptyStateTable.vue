<script setup lang="ts">
const projects = ref<{ name: string, owner: string }[]>([])
const headingId = useId()
const heading = useTemplateRef<HTMLElement>('heading')

async function addSample() {
  projects.value = [{ name: 'Website refresh', owner: 'Dina Sari' }]
  await nextTick()
  heading.value?.focus()
}
</script>

<template>
  <div class="w-full space-y-3">
    <h4 :id="headingId" ref="heading" tabindex="-1" class="font-medium">
      Projects
    </h4>
    <STable :data="projects" :aria-labelledby="headingId">
      <SColumn field="name" header="Project" />
      <SColumn field="owner" header="Owner" />
      <template #empty>
        <SEmptyState title="No projects yet" description="Add a project to get started." :ui="{ root: 'py-8' }">
          <template #actions>
            <SButton size="sm" @click="addSample">
              Add sample project
            </SButton>
          </template>
        </SEmptyState>
      </template>
    </STable>
    <SButton size="sm" variant="outline" color="neutral" @click="projects = []">
      Clear projects
    </SButton>
    <p class="sr-only" role="status">
      {{ projects.length ? 'Sample project added.' : 'No projects.' }}
    </p>
  </div>
</template>
