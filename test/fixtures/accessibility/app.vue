<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const department = ref<string>()
const accepted = ref(false)
const notifications = ref(false)
const invalid = ref(false)
const search = ref('missing')
const selected = ref<string>()
const projectName = ref('Website refresh')
const items = ['Design', 'Engineering', 'Operations']
const navigation = [
  { label: 'Projects', to: '#projects' },
  { label: 'Reports', children: [{ label: 'Activity', to: '#activity' }, { label: 'Usage', to: '#usage' }] },
]
</script>

<template>
  <SApp>
    <main class="mx-auto max-w-3xl space-y-8 p-6">
      <h1 class="text-2xl font-semibold">
        Workspace
      </h1>
      <SColorModeToggle />
      <SNavigationMenu :items="navigation" orientation="vertical" aria-label="Workspace navigation" />
      <form class="space-y-4" novalidate @submit.prevent="invalid = !email.includes('@')">
        <h2 class="text-lg font-medium">
          Preferences
        </h2>
        <SFormField label="Email address" description="Used for project updates." :error="invalid ? 'Enter a valid email address.' : undefined">
          <SInput v-model="email" type="email" autocomplete="email" required />
        </SFormField>
        <SFormField id="audit-department" label="Department">
          <SSelect v-model="department" :items="items" placeholder="Choose a department" adaptive searchable :ui="{ searchInput: { 'data-audit-search': '' } }" />
        </SFormField>
        <SCheckbox v-model="accepted" label="Accept the workspace rules" />
        <SSwitch v-model="notifications" label="Email notifications" />
        <SButton type="submit">
          Save preferences
        </SButton>
      </form>
      <SModal title="Project settings" description="Update this project's settings." :transition="false">
        <SButton id="open-settings">
          Open settings
        </SButton>
        <template #body>
          <SFormField label="Project name">
            <SInput v-model="projectName" />
          </SFormField>
          <SModal title="Confirm archive" description="The project can be restored later." :transition="false">
            <SButton id="open-archive" class="mt-4">
              Archive project
            </SButton>
            <template #body>
              <p>Archive Website refresh?</p>
            </template>
          </SModal>
        </template>
      </SModal>
      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" class="text-lg font-medium">
          Projects
        </h2>
        <SEmptyState icon="audit:mark" title="No projects yet" description="Add your first project.">
          <template #actions>
            <SButton as="a" href="#new-project">
              Create project
            </SButton>
          </template>
        </SEmptyState>
      </section>
      <section aria-labelledby="departments-heading">
        <h2 id="departments-heading" class="text-lg font-medium">
          Departments
        </h2>
        <SListbox v-model="selected" v-model:search-term="search" :items="items" label="Search departments" searchable>
          <template #empty-filter>
            <SEmptyState title="No matching departments" :ui="{ root: 'py-6' }" />
          </template>
          <template #footer>
            <SButton variant="outline" color="neutral" @click="search = ''">
              Clear search
            </SButton>
          </template>
        </SListbox>
      </section>
    </main>
  </SApp>
</template>
