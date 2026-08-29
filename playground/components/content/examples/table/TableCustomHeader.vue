<script setup lang="ts">
interface User { name: string, email: string, role: string }

const users = ref<User[]>([
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Member' },
])
</script>

<template>
  <STable :data="users">
    <SColumn field="name" header="Name" />
    <SColumn field="role">
      <template #header>
        <span class="inline-flex items-center gap-1">
          Role
          <STooltip text="Admins can manage billing and members">
            <SIcon name="ph:info" class="size-3.5 text-[var(--ui-text-muted)]" />
          </STooltip>
        </span>
      </template>
    </SColumn>
  </STable>
</template>
