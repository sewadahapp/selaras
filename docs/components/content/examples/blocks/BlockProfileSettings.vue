<script setup lang="ts">
const timezones: string[] = ['Asia/Jakarta', 'Asia/Singapore', 'Europe/London', 'America/New_York']
const initial = {
  name: 'Dina Sari',
  email: 'dina@example.com',
  bio: 'Product designer building thoughtful tools for small teams.',
  timezone: 'Asia/Jakarta',
  updates: true,
  digest: false,
}
const saved = ref({ ...initial })
const profile = reactive({ ...initial })
const pending = ref(false)
const feedback = ref('')
const failed = ref(false)
const dirty = computed(() => JSON.stringify(profile) !== JSON.stringify(saved.value))
const initials = computed(() => profile.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('') || 'DS')

function reset() {
  Object.assign(profile, saved.value)
  feedback.value = ''
}

async function save() {
  pending.value = true
  feedback.value = ''
  failed.value = false
  try {
    // Replace this delay with your profile API. Save the snapshot only on success.
    await new Promise(resolve => setTimeout(resolve, 600))
    saved.value = { ...profile }
    feedback.value = 'Profile saved for this demo. Reloading restores the sample profile.'
  }
  catch {
    failed.value = true
    feedback.value = 'Your changes weren’t saved. Please try again; your edits are still here.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-[var(--selaras-resolved-surface-default)] px-5 py-8 text-[var(--selaras-resolved-text-default)] sm:px-10">
    <div class="mx-auto max-w-3xl">
      <h1 class="text-2xl font-semibold tracking-tight">
        Profile settings
      </h1>
      <p class="mt-2 text-sm leading-6 text-[var(--selaras-resolved-text-muted)]">
        Manage how you appear in your workspace. This is a sample profile.
      </p>
      <form class="mt-8" @submit.prevent="save">
        <fieldset :disabled="pending" class="min-w-0 space-y-8">
          <legend class="sr-only">
            Personal information and notifications
          </legend>
          <div class="flex items-center gap-4">
            <SAvatar :text="initials" size="lg" />
            <div class="min-w-0">
              <p class="break-words font-medium">
                {{ profile.name || 'Your name' }}
              </p>
              <p class="mt-1 text-sm text-[var(--selaras-resolved-text-muted)]">
                Your initials are used as your avatar.
              </p>
            </div>
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
            <SFormField label="Full name" required>
              <SInput v-model="profile.name" name="name" autocomplete="name" required :maxlength="80" class="w-full" />
            </SFormField>
            <SFormField label="Email address" required>
              <SInput v-model="profile.email" name="email" type="email" autocomplete="email" required class="w-full" />
            </SFormField>
          </div>
          <SFormField label="About you" hint="A short introduction for your teammates. Maximum 240 characters.">
            <STextarea v-model="profile.bio" name="bio" :maxlength="240" :rows="3" class="w-full" />
          </SFormField>
          <SFormField label="Time zone" hint="Used to display times in your workspace.">
            <SSelect v-model="profile.timezone" aria-label="Time zone" :items="timezones" :disabled="pending" class="w-full sm:max-w-sm" />
          </SFormField>
          <section class="border-t border-[var(--selaras-resolved-border-default)] pt-6" aria-labelledby="notifications-title">
            <h2 id="notifications-title" class="font-semibold">
              Email preferences
            </h2>
            <div class="mt-5 grid gap-5">
              <SSwitch v-model="profile.updates" label="Project updates" description="Activity on projects you follow." :disabled="pending" />
              <SSwitch v-model="profile.digest" label="Weekly digest" description="A weekly summary of your workspace." :disabled="pending" />
            </div>
          </section>
        </fieldset>
        <div class="mt-7" role="status" aria-live="polite">
          <SAlert v-if="feedback" :color="failed ? 'danger' : 'success'" :description="feedback" />
        </div>
        <div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--selaras-resolved-border-default)] pt-5">
          <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
            {{ dirty ? 'You have unsaved changes.' : 'All changes saved.' }}
          </p>
          <div class="flex gap-2">
            <SButton variant="outline" color="neutral" :disabled="!dirty || pending" @click="reset">
              Reset
            </SButton>
            <SButton type="submit" :loading="pending" :disabled="!dirty || pending">
              Save changes
            </SButton>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
