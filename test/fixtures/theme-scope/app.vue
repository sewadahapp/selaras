<script setup>
import { ref } from 'vue'

const mode = ref('dark')
const innerFill = ref('rgb(40 50 60)')
const mounted = ref(true)
const { add } = useToast()
const outerTokens = {
  light: { colors: { primary: { fill: 'rgb(20 30 40)', subtle: 'var(--local-subtle)' } } },
  dark: { colors: { primary: { fill: 'rgb(120 130 140)', text: 'rgb(220 221 222)' } } },
}
</script>

<template>
  <SApp>
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
    <button id="toggle-scope" @click="mounted = !mounted">
      Toggle scope
    </button>
    <STheme v-if="mounted" as="section" :mode="mode" :tokens="outerTokens" style="--local-subtle: rgb(30 40 50)">
      <SButton id="outer-fill">
        Outer
      </SButton>
      <SButton id="outer-text" variant="text">
        Outer text
      </SButton>
      <STheme as="section" mode="light" :tokens="{ light: { colors: { primary: { fill: innerFill } } } }">
        <STheme :defaults="{ button: { size: 'lg' } }">
          <SButton id="inner-fill">
            Inner
          </SButton>
          <SButton id="inner-text" variant="text">
            Inner text
          </SButton>
          <SButton id="inner-soft" variant="soft" style="--local-subtle: rgb(50 60 70)">
            Local alias
          </SButton>
          <SButton id="consumer-fill" class="consumer-override">
            Consumer CSS
          </SButton>
          <SButton id="inline-fill" style="--selaras-color-primary-fill: rgb(80 90 100)">
            Inline CSS
          </SButton>
          <SPopover :open="true" @open-auto-focus="event => event.preventDefault()">
            <SButton id="portal-trigger">
              Portal
            </SButton>
            <template #content>
              <SButton id="portal-fill">
                Portalled inner
              </SButton>
              <SButton id="portal-text" variant="text">
                Portalled text
              </SButton>
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
            @open-auto-focus="event => event.preventDefault()"
          >
            <template #content>
              <input id="modal-native" aria-label="Portalled modal native input">
            </template>
          </SModal>
        </STheme>
      </STheme>
    </STheme>
  </SApp>
</template>
