<script setup lang="ts">
const items = [
  {
    id: 'opened',
    date: 'Today · 9:15 AM',
    title: 'Issue opened',
    actor: 'Maya Putri',
    initials: 'MP',
    action: 'New issue',
    detail: 'Checkout returns an error when applying a discount code.',
    color: 'warning' as const,
  },
  {
    id: 'assigned',
    date: 'Today · 10:02 AM',
    title: 'Assigned to engineering',
    actor: 'Arif Rahman',
    initials: 'AR',
    action: 'In progress',
    detail: 'Arif picked up the issue and started investigating.',
    color: 'info' as const,
  },
  {
    id: 'fixed',
    date: 'Today · 1:40 PM',
    title: 'Fix merged',
    actor: 'Dina Sari',
    initials: 'DS',
    action: 'Resolved',
    detail: 'The validation fix is merged and ready for release.',
    color: 'success' as const,
  },
]
</script>

<template>
  <STimeline
    :items="items"
    :ui="{
      item: 'py-3 first:pt-0 last:pb-0',
      content: 'rounded-xl border border-[var(--selaras-resolved-border-default)] bg-[var(--selaras-resolved-surface-elevated)] p-4 sm:p-5',
    }"
  >
    <template #marker="{ item }">
      <SAvatar :name="item.actor" :text="item.initials" size="sm" />
    </template>
    <template #content="{ item }">
      <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h3 class="font-semibold tracking-tight">
          {{ item.title }}
        </h3>
        <SBadge :label="item.action" :color="item.color" variant="soft" size="sm" />
      </div>
      <p class="mt-2 text-sm leading-6 text-[var(--selaras-resolved-text-muted)]">
        {{ item.detail }}
      </p>
      <p class="mt-3 border-t border-[var(--selaras-resolved-border-default)] pt-3 text-sm text-[var(--selaras-resolved-text-muted)]">
        <span class="font-medium text-[var(--selaras-resolved-text-default)]">{{ item.actor }}</span>
        <span aria-hidden="true"> · </span>
        <time>{{ item.date }}</time>
      </p>
    </template>
  </STimeline>
</template>
