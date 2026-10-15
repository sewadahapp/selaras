<script setup lang="ts">
const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const mode = ref<'sign-in' | 'reset'>('sign-in')
const pending = ref(false)
const feedback = ref('')
const failed = ref(false)

function changeMode(value: 'sign-in' | 'reset') {
  mode.value = value
  feedback.value = ''
  password.value = ''
}

async function submit() {
  pending.value = true
  feedback.value = ''
  failed.value = false
  try {
    // Replace this delay with your authentication or password-reset request.
    // Do not log credentials or persist passwords in browser storage.
    await new Promise(resolve => setTimeout(resolve, 600))
    feedback.value = mode.value === 'sign-in'
      ? 'Demo complete. Connect your authentication service to sign in.'
      : 'Demo complete. Connect your email service to send a reset link.'
    password.value = ''
  }
  catch {
    failed.value = true
    feedback.value = 'We couldn’t complete your request. Please try again.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-[var(--selaras-resolved-surface-elevated)] p-5 text-[var(--selaras-resolved-text-default)] sm:p-10">
    <SCard class="w-full max-w-md" :ui="{ body: 'p-6 sm:p-8' }">
      <div class="mb-8 flex items-center gap-3">
        <SIcon name="hugeicons:layers-01" class="size-7 text-[var(--selaras-resolved-color-primary-text)]" />
        <span class="text-lg font-semibold">Studio workspace</span>
      </div>
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ mode === 'sign-in' ? 'Welcome back' : 'Reset your password' }}
      </h1>
      <p class="mt-2 text-sm leading-6 text-[var(--selaras-resolved-text-muted)]">
        {{ mode === 'sign-in' ? 'Sign in to pick up where your team left off.' : 'Enter your email to request a password reset link.' }}
      </p>
      <form class="mt-7 space-y-5" @submit.prevent="submit">
        <SFormField label="Email address" required>
          <SInput v-model="email" name="email" type="email" autocomplete="username" placeholder="you@example.com" required :disabled="pending" class="w-full" />
        </SFormField>
        <SFormField v-if="mode === 'sign-in'" label="Password" required>
          <SInput v-model="password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" :minlength="8" required :disabled="pending" class="w-full">
            <template #trailing="{ buttonSize }">
              <SButton :icon="showPassword ? 'hugeicons:view-off' : 'hugeicons:view'" :aria-label="showPassword ? 'Hide password' : 'Show password'" :aria-pressed="showPassword" :size="buttonSize" variant="ghost" color="neutral" square @click="showPassword = !showPassword" />
            </template>
          </SInput>
        </SFormField>
        <div v-if="mode === 'sign-in'" class="flex flex-wrap items-center justify-between gap-3">
          <SCheckbox v-model="remember" label="Remember me" :disabled="pending" />
          <SButton variant="link" size="sm" :disabled="pending" @click="changeMode('reset')">
            Forgot password?
          </SButton>
        </div>
        <SButton type="submit" :loading="pending" :disabled="pending" class="w-full">
          {{ mode === 'sign-in' ? 'Sign in' : 'Request reset link' }}
        </SButton>
        <SButton v-if="mode === 'reset'" variant="link" color="neutral" :disabled="pending" class="w-full" @click="changeMode('sign-in')">
          Back to sign in
        </SButton>
        <div role="status" aria-live="polite">
          <SAlert v-if="feedback" :color="failed ? 'danger' : 'info'" :description="feedback" />
        </div>
      </form>
      <p class="mt-7 border-t border-[var(--selaras-resolved-border-default)] pt-5 text-xs leading-5 text-[var(--selaras-resolved-text-muted)]">
        Interactive demo. Use made-up credentials; nothing is sent or stored. Passwords must contain at least 8 characters.
      </p>
    </SCard>
  </main>
</template>
