<script setup lang="ts">
/**
 * The homepage's signature element: six bars, one per semantic role, each
 * sized by that role's REAL --color-{role}-500 lightness (not arbitrary
 * heights) - so this is a literal picture of the actual design tokens, not
 * decoration. They start scattered and settle into their true alignment on
 * load, echoing "selaras" (Indonesian/Malay for "in harmony, aligned").
 */
interface Role {
  key: string
  label: string
  /** OKLCH L from theme.css's --color-{key}-500, as a 0-100 percentage. */
  lightness: number
}

const roles: Role[] = [
  { key: 'primary', label: 'Piccolo', lightness: 47.5 },
  { key: 'secondary', label: 'Hit', lightness: 76.7 },
  { key: 'success', label: 'Roshi', lightness: 68.3 },
  { key: 'danger', label: 'Dodoria', lightness: 56.9 },
  { key: 'info', label: 'Whis', lightness: 50.9 },
  { key: 'warning', label: 'Krillin', lightness: 81.8 },
]

// A deliberately dissonant starting arrangement - not each bar's own final
// height in a different order, just "not yet in tune" - settling to `true`
// animates every bar toward its real lightness. Always starts scattered
// (matching server-rendered markup exactly, so hydration can't mismatch);
// onMounted only ever runs client-side, after hydration, so branching on
// prefers-reduced-motion there is safe - reduced motion just resolves
// immediately instead of via the delayed, staggered transition.
const scatter = [30, 85, 40, 95, 55, 65]
const settled = ref(false)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    settled.value = true
    return
  }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    settled.value = true
  }))
})
</script>

<template>
  <div class="flex h-48 gap-3 sm:gap-4">
    <div
      v-for="(role, index) in roles"
      :key="role.key"
      class="group flex min-w-0 flex-1 flex-col items-center gap-3"
    >
      <div class="flex w-full flex-1 items-end">
        <div
          class="harmony-bar w-full rounded-t-[var(--ui-radius-md)]"
          :style="{
            height: `${settled ? role.lightness : scatter[index]}%`,
            backgroundColor: `var(--color-${role.key}-500)`,
            transitionDelay: `${index * 70}ms`,
          }"
        />
      </div>
      <div class="w-full text-center">
        <p class="truncate font-mono text-[0.65rem] tracking-wide text-[var(--ui-text-muted)] uppercase">
          {{ role.key }}
        </p>
        <p class="hidden truncate font-mono text-[0.65rem] text-[var(--ui-text-muted)] opacity-0 transition-opacity group-hover:opacity-100 sm:block">
          --color-{{ role.key }}-500
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.harmony-bar {
  transition: height 900ms cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  .harmony-bar {
    transition: none;
  }
}
</style>
