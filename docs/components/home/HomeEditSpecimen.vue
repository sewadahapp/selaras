<script setup lang="ts">
import type { RuntimeTokenOverrides } from '@sewadah/selaras/types'
import { defineColorFromSeed } from '@sewadah/selaras/theme'

const props = defineProps<{
  /** How many of the homepage edits are applied, from 0 (none) to 4 (all). */
  step: number
  brand: string
  radius: string
  buttonClass: string
  oneButtonClass: string
}>()
const { locale } = useDocsLocale()
const id = computed(() => locale.value === 'id')
const text = computed(() => id.value
  ? {
      date: 'Kamis, 19.00 hingga 21.00',
      group: 'Ansambel lengkap',
      notes: 'Kami memerlukan gong ageng dan dua saron.',
      status: 'Permintaan dicatat. Contoh ini tidak mengirim apa pun.',
      title: 'Pesan ruang latihan',
      badge: 'Contoh',
      dateLabel: 'Tanggal dan waktu',
      groupLabel: 'Kelompok',
      notesLabel: 'Catatan untuk studio',
      ownDrums: 'Kami membawa kendang sendiri',
      reset: 'Atur ulang',
      request: 'Ajukan pemesanan',
    }
  : {
      date: 'Thursday, 19:00 to 21:00',
      group: 'Full ensemble',
      notes: 'We need the gong ageng and two saron.',
      status: 'Request noted. This sample sends nothing.',
      title: 'Book a rehearsal room',
      badge: 'Sample',
      dateLabel: 'Date and time',
      groupLabel: 'Group',
      notesLabel: 'Notes for the studio',
      ownDrums: 'We bring our own kendhang',
      reset: 'Reset',
      request: 'Request booking',
    })

// Each edit is applied with STheme, the scoped form of the same setting, so
// only this specimen changes rather than the documentation around it.
const role = computed(() => defineColorFromSeed(props.brand))
const tokens = computed<RuntimeTokenOverrides | undefined>(() => {
  if (props.step < 1)
    return undefined
  const geometry = props.step >= 2 ? { radius: { base: props.radius } } : {}
  return {
    light: { ...geometry, colors: { primary: role.value.light } },
    dark: { ...geometry, colors: { primary: role.value.dark } },
  }
})
const ui = computed(() => props.step >= 3 ? { button: { slots: { base: props.buttonClass } } } : undefined)
const requestUi = computed(() => props.step >= 4 ? { base: props.oneButtonClass } : undefined)

const date = ref(text.value.date)
const group = ref(text.value.group)
const notes = ref(text.value.notes)
const ownDrums = ref(true)
const status = ref('')

function requestBooking() {
  status.value = text.value.status
}
function reset() {
  date.value = text.value.date
  group.value = text.value.group
  notes.value = text.value.notes
  ownDrums.value = true
  status.value = ''
}
</script>

<template>
  <STheme as="div" :tokens="tokens" :ui="ui" class="home-specimen">
    <SCard>
      <template #header>
        <div class="home-specimen-head">
          <div>
            <h3>{{ text.title }}</h3>
            <p>Pendopo studio, Yogyakarta</p>
          </div>
          <SBadge variant="soft">
            {{ text.badge }}
          </SBadge>
        </div>
      </template>
      <div class="home-specimen-body">
        <SFormField :label="text.dateLabel">
          <SInput v-model="date" />
        </SFormField>
        <SFormField :label="text.groupLabel">
          <SToggleGroup v-model="group" :items="id ? ['Ansambel lengkap', 'Kelompok kecil'] : ['Full ensemble', 'Small group']" class="w-full" :ui="{ item: 'flex-1' }" />
        </SFormField>
        <SFormField :label="text.notesLabel">
          <STextarea v-model="notes" :rows="2" />
        </SFormField>
        <SSwitch v-model="ownDrums" :label="text.ownDrums" />
      </div>
      <template #footer>
        <div class="home-specimen-foot">
          <p class="home-specimen-status" role="status">
            {{ status }}
          </p>
          <div class="home-specimen-actions">
            <SButton variant="ghost" color="neutral" @click="reset">
              {{ text.reset }}
            </SButton>
            <SButton :ui="requestUi" @click="requestBooking">
              {{ text.request }}
            </SButton>
          </div>
        </div>
      </template>
    </SCard>
  </STheme>
</template>

<style scoped>
.home-specimen-head { display: flex; align-items: start; justify-content: space-between; gap: 1rem; }
.home-specimen-head h3 { margin: 0; font-size: 1.25rem; line-height: 1.3; font-weight: 600; letter-spacing: -0.01em; }
.home-specimen-head p { margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--selaras-resolved-text-muted); }
.home-specimen-body { display: grid; gap: 1.25rem; }
.home-specimen-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem 1rem; }
.home-specimen-status { margin: 0; min-height: 1.25rem; font-size: 0.8125rem; color: var(--selaras-resolved-text-muted); }
.home-specimen-actions { display: flex; gap: 0.5rem; margin-inline-start: auto; }
</style>
