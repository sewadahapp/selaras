<script setup>
import { ref } from 'vue'

const mode = ref('dark')
const innerFill = ref('rgb(40 50 60)')
const mounted = ref(true)
const surface = ref('rgb(24 25 26)')
const scrim = ref()
const { add } = useToast()
const outerTokens = {
  light: {
    colors: { primary: { fill: 'rgb(20 30 40)', subtle: 'var(--local-subtle)' } },
    surface: { default: 'rgb(230 231 232)' },
    text: { default: 'rgb(30 31 32)' },
    border: { default: 'rgb(80 81 82)' },
  },
  dark: {
    colors: { primary: { fill: 'rgb(120 130 140)', text: 'rgb(220 221 222)' } },
    surface: { default: 'rgb(14 15 16)' },
    text: { default: 'rgb(210 211 212)', muted: 'rgb(160 161 162)' },
    border: { default: 'rgb(100 101 102)' },
    scrim: 'rgb(5 6 7 / .7)',
  },
}
</script>

<template>
  <SApp>
    <div id="global-surface" class="functional-elevated">
      Ordinary global surface
    </div>
    <STheme as="section" mode="dark">
      <div id="default-dark-surface" class="functional-sample">
        Default dark surface
      </div>
      <STheme as="section" mode="light">
        <div id="default-light-surface" class="functional-sample">
          Default light surface
        </div>
      </STheme>
    </STheme>
    <SButton id="global-theme">
      Global
    </SButton>
    <button id="global-toast" @click="add({ title: 'Global theme toast', color: 'primary' })">
      Show global toast
    </button>
    <SToast />
    <div class="dark">
      <SButton id="unmanaged-dark-ancestor">
        Document-following
      </SButton>
    </div>
    <button id="toggle-mode" @click="mode = mode === 'dark' ? 'light' : 'dark'">
      Toggle outer mode
    </button>
    <button id="update-inner" @click="innerFill = 'rgb(41 51 61)'">
      Update inner fill
    </button>
    <button id="update-surface" @click="surface = 'rgb(25 26 27)'; scrim = 'rgb(20 30 40 / .6)'">
      Update surface
    </button>
    <button id="toggle-scope" @click="mounted = !mounted">
      Toggle scope
    </button>
    <STheme v-if="mounted" as="section" :mode="mode" :tokens="outerTokens" style="--local-subtle: rgb(30 40 50)">
      <div id="outer-surface" class="functional-sample">
        Outer surface
      </div>
      <SButton id="outer-fill">
        Outer
      </SButton>
      <SButton id="outer-text" variant="text">
        Outer text
      </SButton>
      <span id="outer-primary-read" class="text-[var(--selaras-resolved-color-primary-text)]">
        Outer public role read
      </span>
      <STheme as="section" mode="light" :tokens="{ light: { colors: { primary: { fill: innerFill } }, surface: { default: surface }, scrim } }">
        <STheme :defaults="{ button: { size: 'lg' } }">
          <SButton id="inner-fill">
            Inner
          </SButton>
          <div id="inner-surface" class="functional-sample">
            Inner surface
          </div>
          <STheme id="functional-consumer" as="div" class="functional-sample functional-consumer">
            Consumer surface
          </STheme>
          <SInput id="functional-input" model-value="Functional input" readonly />
          <SButton id="inner-text" variant="text">
            Inner text
          </SButton>
          <span id="inner-primary-read" class="text-[var(--selaras-resolved-color-primary-fill)]">
            Inner public role read
          </span>
          <SAvatar id="independent-status" text="A" color="primary" status status-color="success" />
          <SButton id="inner-soft" variant="soft" style="--local-subtle: rgb(50 60 70)">
            Local alias
          </SButton>
          <SButton id="consumer-fill" class="consumer-override">
            Consumer CSS
          </SButton>
          <SButton id="inline-fill" style="--selaras-color-primary-fill: rgb(80 90 100)">
            Inline CSS
          </SButton>
          <ProgrammaticThemeProbe />
          <SPopover :open="true" @open-auto-focus="event => event.preventDefault()">
            <SButton id="portal-trigger">
              Portal
            </SButton>
            <template #content>
              <div id="portal-surface" class="functional-sample">
                Portal surface
              </div>
              <SButton id="portal-fill">
                Portalled inner
              </SButton>
              <SButton id="portal-text" variant="text">
                Portalled text
              </SButton>
              <span id="portal-primary-read" class="text-[var(--selaras-resolved-color-primary-fill)]">
                Portalled public role read
              </span>
              <input id="portal-native" aria-label="Portalled native input">
            </template>
          </SPopover>
          <SSelect
            id="portal-select"
            :open="true"
            :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]"
            model-value="one"
          />
          <SRadioGroup
            id="invalid-radio"
            invalid
            model-value="one"
            :items="['one', 'two']"
          />
          <SColorPicker
            :open="true"
            model-value="#112233"
          />
          <SModal
            :open="true"
            title="Scoped modal"
            description="Verifies portalled native control mode."
            :ui="{ content: { 'data-testid': 'functional-modal' }, overlay: { 'data-testid': 'functional-scrim' } }"
            @open-auto-focus="event => event.preventDefault()"
          >
            <template #content>
              <div id="modal-surface" class="functional-sample">
                Modal surface
              </div>
              <p id="modal-muted" class="functional-muted">
                Muted content
              </p>
              <input id="modal-native" aria-label="Portalled modal native input">
            </template>
          </SModal>
        </STheme>
      </STheme>
    </STheme>
  </SApp>
</template>
