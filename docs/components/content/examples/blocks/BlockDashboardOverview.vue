<script setup lang="ts">
interface Project {
  name: string
  owner: string
  initials: string
  completed: number
  tasks: number
  due: string
  status: 'On track' | 'Needs review'
  next: string
}
const view = ref('Overview')
const sidebar = useTemplateRef('sidebar')
function navigate(label: string) {
  view.value = label
  if (window.matchMedia('(max-width: 767px)').matches)
    sidebar.value?.toggle()
}
const selected = ref<Project>()
const detailsOpen = ref(false)
const projects: Project[] = [
  { name: 'Website refresh', owner: 'Dina Sari', initials: 'DS', completed: 18, tasks: 24, due: 'Oct 24', status: 'On track', next: 'Review the responsive layouts with the team.' },
  { name: 'Customer onboarding', owner: 'Alex Morgan', initials: 'AM', completed: 8, tasks: 16, due: 'Oct 28', status: 'Needs review', next: 'Resolve feedback on the welcome flow.' },
  { name: 'Component audit', owner: 'Rafi Putra', initials: 'RP', completed: 21, tasks: 28, due: 'Nov 02', status: 'On track', next: 'Check keyboard interactions and field labels.' },
  { name: 'Help center', owner: 'Nadia Chen', initials: 'NC', completed: 6, tasks: 20, due: 'Nov 08', status: 'On track', next: 'Draft the first five getting-started articles.' },
]
const activity = [
  { person: 'Dina Sari', initials: 'DS', action: 'completed the homepage layout', project: 'Website refresh', time: '12 minutes ago' },
  { person: 'Alex Morgan', initials: 'AM', action: 'requested a design review', project: 'Customer onboarding', time: '38 minutes ago' },
  { person: 'Rafi Putra', initials: 'RP', action: 'added keyboard testing notes', project: 'Component audit', time: '1 hour ago' },
]
const completed = projects.reduce((sum, project) => sum + project.completed, 0)
const total = projects.reduce((sum, project) => sum + project.tasks, 0)
const navigation = computed(() => [
  { label: 'Workspace', type: 'label' as const },
  ...[
    ['Overview', 'hugeicons:dashboard-square-01'],
    ['Projects', 'hugeicons:folder-01'],
    ['Activity', 'hugeicons:clock-01'],
  ].map(([label, icon]) => ({ label: label!, icon, active: view.value === label, onSelect: () => navigate(label!) })),
])

function showProject(project: Project) {
  selected.value = project
  detailsOpen.value = true
}
</script>

<template>
  <div class="h-screen bg-[var(--selaras-resolved-surface-default)] text-[var(--selaras-resolved-text-default)]">
    <SDashboardGroup auto-save-id="selaras-block-workspace">
      <SDashboardSidebar ref="sidebar" :default-size="220">
        <template #header="{ isCollapsed }">
          <div class="flex items-center gap-2 font-semibold">
            <SIcon name="hugeicons:layers-01" class="size-6 shrink-0 text-[var(--selaras-resolved-color-primary-text)]" />
            <span v-if="!isCollapsed">Studio</span>
          </div>
        </template>
        <template #default="{ isCollapsed }">
          <SNavigationMenu :items="navigation" orientation="vertical" :collapsed="isCollapsed" :ui="{ link: isCollapsed ? undefined : 'w-full text-start' }" />
        </template>
        <template #footer="{ isCollapsed }">
          <div class="flex items-center gap-3">
            <SAvatar text="DS" size="sm" />
            <div v-if="!isCollapsed" class="min-w-0 text-sm">
              <p class="font-medium">
                Dina Sari
              </p>
              <p class="text-xs text-[var(--selaras-resolved-text-muted)]">
                Demo workspace
              </p>
            </div>
          </div>
        </template>
      </SDashboardSidebar>
      <SDashboardResizeHandle />
      <SDashboardPanel>
        <SDashboardNavbar :title="view">
          <template #leading>
            <SDashboardSidebarToggle />
          </template>
          <SBadge color="neutral" variant="soft">
            Sample data
          </SBadge>
        </SDashboardNavbar>
        <main class="flex-1 overflow-y-auto p-5 sm:p-7">
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ view === 'Overview' ? 'A clear view of your work' : view === 'Projects' ? 'Workspace projects' : 'Recent activity' }}
          </h1>
          <p class="mt-2 text-sm leading-6 text-[var(--selaras-resolved-text-muted)]">
            {{ view === 'Activity' ? 'The latest updates from your team. All activity shown is illustrative.' : 'Four projects, one shared workspace. Select a project to see its next step.' }}
          </p>
          <dl v-if="view === 'Overview'" class="my-7 grid grid-cols-2 gap-5 border-y border-[var(--selaras-resolved-border-default)] py-5 sm:grid-cols-3">
            <div>
              <dt class="text-sm text-[var(--selaras-resolved-text-muted)]">
                Active projects
              </dt>
              <dd class="mt-2 text-3xl font-semibold tabular-nums">
                {{ projects.length }}
              </dd>
            </div>
            <div>
              <dt class="text-sm text-[var(--selaras-resolved-text-muted)]">
                Completed tasks
              </dt>
              <dd class="mt-2 text-3xl font-semibold tabular-nums">
                {{ completed }}<span class="ms-1 text-base font-normal text-[var(--selaras-resolved-text-muted)]">/ {{ total }}</span>
              </dd>
            </div>
            <div>
              <dt class="text-sm text-[var(--selaras-resolved-text-muted)]">
                Needs review
              </dt>
              <dd class="mt-2 text-3xl font-semibold tabular-nums">
                {{ projects.filter(project => project.status === 'Needs review').length }}
              </dd>
            </div>
          </dl>
          <section v-if="view !== 'Activity'" class="mt-7" aria-labelledby="projects-title">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h2 id="projects-title" class="font-semibold">
                Projects
              </h2>
              <SButton v-if="view === 'Overview'" variant="link" size="sm" @click="view = 'Projects'">
                View all projects
              </SButton>
            </div>
            <STable :data="projects" row-hover>
              <SColumn field="name" header="Project">
                <template #default="{ row }">
                  <SButton variant="link" color="neutral" class="justify-start px-0 text-start" @click="showProject(row)">
                    {{ row.name }}
                  </SButton>
                  <p class="text-xs text-[var(--selaras-resolved-text-muted)]">
                    {{ row.owner }}
                  </p>
                </template>
              </SColumn>
              <SColumn field="completed" header="Progress">
                <template #default="{ row }">
                  <div class="min-w-24 space-y-2">
                    <p class="text-xs tabular-nums">
                      {{ row.completed }} / {{ row.tasks }} tasks
                    </p>
                    <SProgress :model-value="row.completed" :max="row.tasks" :aria-label="`${row.name} task progress`" size="sm" />
                  </div>
                </template>
              </SColumn>
              <SColumn field="status" header="Status">
                <template #default="{ row }">
                  <SBadge :color="row.status === 'On track' ? 'success' : 'warning'" variant="soft" class="whitespace-nowrap">
                    {{ row.status }}
                  </SBadge>
                </template>
              </SColumn>
            </STable>
          </section>
          <section v-if="view !== 'Projects'" class="mt-8" aria-labelledby="activity-title">
            <h2 id="activity-title" class="mb-4 font-semibold">
              Recent activity
            </h2>
            <ul class="divide-y divide-[var(--selaras-resolved-border-default)]">
              <li v-for="item in activity" :key="item.person" class="flex items-start gap-3 py-4 first:pt-0">
                <SAvatar :text="item.initials" size="sm" />
                <div class="min-w-0 flex-1 text-sm leading-6">
                  <p><span class="font-medium">{{ item.person }}</span> {{ item.action }}.</p>
                  <p class="text-xs text-[var(--selaras-resolved-text-muted)]">
                    {{ item.project }} · {{ item.time }}
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </main>
      </SDashboardPanel>
    </SDashboardGroup>
    <SSlideover v-model:open="detailsOpen" :title="selected?.name ?? 'Project details'" description="Project details · sample data">
      <template #body>
        <div v-if="selected" class="space-y-6">
          <div class="flex items-center gap-3">
            <SAvatar :text="selected.initials" /><div>
              <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
                Project owner
              </p><p class="font-medium">
                {{ selected.owner }}
              </p>
            </div>
          </div>
          <SBadge :color="selected.status === 'On track' ? 'success' : 'warning'" variant="soft">
            {{ selected.status }}
          </SBadge>
          <div>
            <h2 class="mb-2 font-semibold">
              Next step
            </h2><p class="text-sm leading-6 text-[var(--selaras-resolved-text-muted)]">
              {{ selected.next }}
            </p>
          </div>
          <div>
            <p class="mb-2 text-sm">
              {{ selected.completed }} of {{ selected.tasks }} tasks complete
            </p><SProgress :model-value="selected.completed" :max="selected.tasks" aria-label="Completed tasks" />
          </div>
          <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
            Target date: {{ selected.due }} · illustrative schedule
          </p>
        </div>
      </template>
    </SSlideover>
  </div>
</template>
