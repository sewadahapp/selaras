<script setup lang="ts">
interface Member {
  id: string
  name: string
  email: string
  role: string
  status: string
}
const sampleMembers: Member[] = [
  { id: '1', name: 'Dina Sari', email: 'dina@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Alex Morgan', email: 'alex@example.com', role: 'Member', status: 'Active' },
  { id: '3', name: 'Rafi Putra', email: 'rafi@example.com', role: 'Member', status: 'Active' },
  { id: '4', name: 'Nadia Chen', email: 'nadia@example.com', role: 'Viewer', status: 'Invited' },
  { id: '5', name: 'Jamie Park', email: 'jamie@example.com', role: 'Member', status: 'Active' },
  { id: '6', name: 'Sasha Lee', email: 'sasha@example.com', role: 'Viewer', status: 'Active' },
  { id: '7', name: 'Mika Tan', email: 'mika@example.com', role: 'Admin', status: 'Active' },
  { id: '8', name: 'Ari Santos', email: 'ari@example.com', role: 'Viewer', status: 'Invited' },
]
const members = ref(sampleMembers.map(member => ({ ...member })))
const search = ref('')
const roles: string[] = ['Admin', 'Member', 'Viewer']
const roleFilters = ['All roles', ...roles]
const statuses: string[] = ['Invited', 'Active']
const role = ref('All roles')
const pageIndex = ref(0)
const editorOpen = ref(false)
const editingId = ref<string>()
const form = reactive({ name: '', email: '', role: 'Member', status: 'Invited' })
const pending = ref(false)
const loading = ref(false)
const feedback = ref('')
const formError = ref('')
let nextId = 9
const filtered = computed(() => members.value.filter((member) => {
  const term = search.value.trim().toLowerCase()
  return (role.value === 'All roles' || member.role === role.value)
    && (!term || `${member.name} ${member.email}`.toLowerCase().includes(term))
}))
watch([search, role], () => pageIndex.value = 0)

function edit(member?: Member) {
  editingId.value = member?.id
  Object.assign(form, member ?? { name: '', email: '', role: 'Member', status: 'Invited' })
  formError.value = ''
  editorOpen.value = true
}

async function save() {
  formError.value = ''
  if (members.value.some(member => member.id !== editingId.value && member.email.toLowerCase() === form.email.trim().toLowerCase())) {
    formError.value = 'A member already uses this email address. Enter a different address.'
    return
  }
  pending.value = true
  try {
    // Replace this delay with your API request. Keep the editor open on failure.
    await new Promise(resolve => setTimeout(resolve, 500))
    const member: Member = { id: editingId.value ?? String(nextId++), name: form.name.trim(), email: form.email.trim(), role: form.role, status: form.status }
    members.value = editingId.value ? members.value.map(item => item.id === member.id ? member : item) : [member, ...members.value]
    search.value = ''
    role.value = 'All roles'
    pageIndex.value = 0
    feedback.value = `${member.name} ${editingId.value ? 'updated' : 'added'} in this demo. No email was sent.`
    editorOpen.value = false
  }
  catch {
    formError.value = 'The member couldn’t be saved. Please try again.'
  }
  finally {
    pending.value = false
  }
}

async function resetDemo() {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  members.value = sampleMembers.map(member => ({ ...member }))
  search.value = ''
  role.value = 'All roles'
  pageIndex.value = 0
  nextId = 9
  feedback.value = 'Sample members restored.'
  loading.value = false
}
</script>

<template>
  <main class="min-h-screen bg-[var(--selaras-resolved-surface-default)] px-5 py-8 text-[var(--selaras-resolved-text-default)] sm:px-8">
    <div class="mx-auto max-w-5xl">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">
            Team members
          </h1><p class="mt-2 text-sm leading-6 text-[var(--selaras-resolved-text-muted)]">
            Manage workspace access. All members and changes are local demo data.
          </p>
        </div>
        <SButton icon="hugeicons:plus-sign" :disabled="loading" @click="edit()">
          Add member
        </SButton>
      </div>
      <div class="my-6 flex flex-wrap items-end gap-3">
        <SFormField label="Search members" class="min-w-0 flex-1 basis-52">
          <SInput v-model="search" icon="hugeicons:search-01" placeholder="Name or email…" clearable class="w-full" />
        </SFormField>
        <SFormField label="Role" class="w-40">
          <SSelect v-model="role" aria-label="Role" :items="roleFilters" class="w-full" />
        </SFormField>
        <SButton variant="outline" color="neutral" :loading="loading" :disabled="loading" @click="resetDemo">
          Reset demo
        </SButton>
      </div>
      <div role="status" aria-live="polite" class="mb-4">
        <SAlert v-if="feedback" color="success" :description="feedback" closable @close="feedback = ''" />
      </div>
      <p class="mb-3 text-sm text-[var(--selaras-resolved-text-muted)]" aria-live="polite">
        {{ filtered.length }} {{ filtered.length === 1 ? 'member' : 'members' }}{{ search || role !== 'All roles' ? ' match your filters' : ' in your workspace' }}
      </p>
      <STable v-model:page-index="pageIndex" :data="filtered" :page-size="5" :loading="loading" row-hover :get-row-id="row => row.id">
        <SColumn field="name" header="Member" sortable>
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <SAvatar :text="row.name.split(' ').map((part: string) => part[0]).slice(0, 2).join('')" size="sm" /><div>
                <p class="whitespace-nowrap font-medium">
                  {{ row.name }}
                </p><p class="text-xs text-[var(--selaras-resolved-text-muted)]">
                  {{ row.email }}
                </p>
              </div>
            </div>
          </template>
        </SColumn>
        <SColumn field="role" header="Role" sortable />
        <SColumn field="status" header="Status">
          <template #default="{ row }">
            <SBadge :color="row.status === 'Active' ? 'success' : 'warning'" variant="soft">
              {{ row.status }}
            </SBadge>
          </template>
        </SColumn>
        <SColumn field="id" header="Actions">
          <template #default="{ row }">
            <SButton icon="hugeicons:pencil-edit-02" :aria-label="`Edit ${row.name}`" variant="ghost" color="neutral" size="sm" square :disabled="loading" @click="edit(row)" />
          </template>
        </SColumn>
        <template #empty>
          <div class="py-8 text-center">
            <p class="font-medium">
              No members found
            </p><p class="mt-2 text-sm text-[var(--selaras-resolved-text-muted)]">
              Try a different name, email address or role.
            </p><SButton class="mt-4" variant="outline" color="neutral" @click="search = ''; role = 'All roles'">
              Clear filters
            </SButton>
          </div>
        </template>
      </STable>
    </div>
    <SModal v-model:open="editorOpen" :title="editingId ? 'Edit member' : 'Add member'" description="Changes apply to this demo only. No invitation emails are sent." :dismissible="!pending" :close="!pending">
      <template #body>
        <form class="space-y-5" @submit.prevent="save">
          <SFormField label="Full name" required>
            <SInput v-model="form.name" name="name" autocomplete="name" required :maxlength="80" pattern=".*\S.*" :disabled="pending" class="w-full" />
          </SFormField>
          <SFormField label="Email address" required :error="formError">
            <SInput v-model="form.email" name="email" type="email" autocomplete="email" required :disabled="pending" class="w-full" />
          </SFormField>
          <SFormField label="Member role">
            <SSelect v-model="form.role" aria-label="Member role" :items="roles" :disabled="pending" class="w-full" />
          </SFormField>
          <SFormField label="Access status">
            <SSelect v-model="form.status" aria-label="Access status" :items="statuses" :disabled="pending" class="w-full" />
          </SFormField>
          <div class="flex justify-end gap-2 pt-2">
            <SButton variant="outline" color="neutral" :disabled="pending" @click="editorOpen = false">
              Cancel
            </SButton><SButton type="submit" :loading="pending" :disabled="pending">
              Save member
            </SButton>
          </div>
        </form>
      </template>
    </SModal>
  </main>
</template>
