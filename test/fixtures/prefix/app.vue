<script setup>
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'

const unknownRole = /** @type {any} */ ('not-registered')
const scopedDate = new CalendarDate(2024, 1, 15)
const semanticRecipe = {
  fill: 'rgb(10 20 30)',
  onFill: 'white',
  fillHover: 'rgb(20 30 40)',
  fillPressed: 'rgb(30 40 50)',
  subtle: 'rgb(40 50 60)',
  onSubtle: 'rgb(230 240 250)',
  subtleHover: 'rgb(50 60 70)',
  subtlePressed: 'rgb(60 70 80)',
  text: 'rgb(70 80 90)',
  textHover: 'rgb(80 90 100)',
  textPressed: 'rgb(90 100 110)',
  border: 'rgb(100 110 120)',
  focus: 'rgb(130 140 150)',
}
const nestedTokens = ref({
  light: { enterprise: { fill: 'rgb(60 61 62)', subtle: 'rgb(63 64 65)', text: 'rgb(60 61 62)' } },
  dark: { enterprise: { subtle: 'rgb(103 104 105)' } },
})
const radioValues = ref({ primary: 'one', enterprise: 'one' })

function updateNestedTokens() {
  nestedTokens.value.light.enterprise.subtle = 'rgb(83 84 85)'
}
</script>

<template>
  <div>
    <SButton>Click me</SButton>
    <SRadioGroup id="radio-invalid" :items="['one', 'two']" model-value="one" color="enterprise" invalid />
    <SCheckbox id="checkbox-invalid" :model-value="true" color="enterprise" invalid label="Invalid" />
    <SSwitch id="switch-invalid" :model-value="true" color="enterprise" invalid label="Invalid switch" />
    <SToggle id="toggle-invalid" default-value color="enterprise">
      Invalid toggle
    </SToggle>
    <SToggleGroup id="toggle-group-invalid" :items="['One', 'Two']" default-value="One" color="enterprise" />
    <SChip id="chip-invalid" label="Invalid chip" color="enterprise" variant="solid" />
    <SButton id="enterprise-button" color="enterprise">
      Enterprise
    </SButton>
    <SButton id="unknown-role-button" :color="unknownRole">
      Unknown role
    </SButton>
    <div style="--selaras-color-enterprise-fill: rgb(30 31 32); --company-brand-fill: rgb(17 34 51); --company-brand-on-fill: white; --company-brand-subtle: rgb(34 51 68); --company-brand-on-subtle: white; --company-brand-text: rgb(17 34 51); --company-brand-border: rgb(17 34 51);">
      <SButton id="local-role-input-button" color="enterprise">
        Local role input
      </SButton>
      <div style="--selaras-color-enterprise-fill: rgb(33 34 35);">
        <SButton id="nested-role-input-button" color="enterprise">
          Nested role input
        </SButton>
      </div>
      <SButton id="brand-vars-button" color="brand-vars">
        Brand variables
      </SButton>
    </div>
    <STheme
      as="section"
      :tokens="{ light: { enterprise: { fill: 'rgb(9 8 7)', onFill: 'white', subtle: 'rgb(20 19 18)', onSubtle: 'white', text: 'rgb(9 8 7)', border: 'rgb(9 8 7)' } } }"
    >
      <SPopover :open="true">
        <template #default>
          <button id="scoped-popover-trigger">
            Scoped popover
          </button>
        </template>
        <template #content>
          <SButton id="scoped-popover-button" color="enterprise">
            Scoped portal
          </SButton>
          <SBadge id="scoped-popover-badge" color="enterprise" variant="solid" label="Scoped badge" />
        </template>
      </SPopover>
    </STheme>
    <STheme
      as="section"
      :tokens="{ light: { enterprise: { fill: 'rgb(80 81 82)', onFill: 'white', subtle: 'rgb(83 84 85)', onSubtle: 'white', text: 'rgb(80 81 82)', border: 'rgb(80 81 82)' } } }"
    >
      <div id="scoped-date-picker-fixture">
        <SDatePicker :model-value="scopedDate" active-color="enterprise" />
      </div>
    </STheme>
    <SApp dir="rtl">
      <div id="rtl-probe">
        RTL probe
      </div>
      <STheme
        as="section"
        :tokens="{ light: { enterprise: { fill: 'rgb(90 91 92)' } } }"
      >
        <ScopedToastTrigger />
      </STheme>
      <ClientOnly>
        <SToast />
      </ClientOnly>
    </SApp>
    <SPopover>
      <template #default>
        <button id="keyboard-popover-trigger">
          Keyboard popover
        </button>
      </template>
      <template #content>
        <button id="keyboard-popover-content">
          Keyboard content
        </button>
      </template>
    </SPopover>
    <STheme
      as="section"
      :tokens="{ light: { enterprise: { fill: 'rgb(40 41 42)', onFill: 'white', subtle: 'rgb(43 44 45)', onSubtle: 'white', text: 'rgb(40 41 42)', border: 'rgb(40 41 42)' } } }"
    >
      <SButton id="nested-outer-button" color="enterprise">
        Outer scope
      </SButton>
      <STheme
        as="div"
        :tokens="{ light: { enterprise: { fill: 'rgb(50 51 52)', onFill: 'white', subtle: 'rgb(53 54 55)', onSubtle: 'white', text: 'rgb(50 51 52)', border: 'rgb(50 51 52)' } } }"
      >
        <SButton id="nested-inner-button" color="enterprise">
          Inner scope
        </SButton>
      </STheme>
    </STheme>
    <STheme
      as="section"
      :tokens="nestedTokens"
    >
      <button id="nested-tokens-update" type="button" @click="updateNestedTokens">
        Update outer tokens
      </button>
      <SPopover :open="true">
        <template #default>
          <button id="nested-overlay-trigger">
            Nested overlay
          </button>
        </template>
        <template #content>
          <STheme
            as="div"
            :tokens="{ light: { enterprise: { fill: 'rgb(70 71 72)' } }, dark: { enterprise: { fill: 'rgb(110 111 112)' } } }"
          >
            <SButton id="nested-inner-inline-subtle" color="enterprise" variant="soft">
              Inline inherited subtle color
            </SButton>
            <SPopover :open="true">
              <template #default>
                <button id="nested-inner-overlay-trigger">
                  Inner nested overlay
                </button>
              </template>
              <template #content>
                <SButton id="nested-inner-overlay-button" color="enterprise">
                  Inner nested portal
                </SButton>
                <STheme>
                  <SButton id="nested-inner-overlay-subtle" color="enterprise" variant="soft">
                    Inherited subtle color through a headless scope
                  </SButton>
                </STheme>
              </template>
            </SPopover>
          </STheme>
        </template>
      </SPopover>
    </STheme>
    <SButton id="override-button" :ui="{ base: 'tw:bg-purple-700' }">
      Overridden
    </SButton>
    <div style="--ui-primary: rgb(1 2 3);">
      <SButton id="builtin-foundation-button">
        Independent built-in default
      </SButton>
      <span id="builtin-foundation-probe" style="color: var(--tw-color-primary-500);">Foundation probe</span>
    </div>
    <STheme
      as="section"
      :tokens="{ light: { enterprise: { fill: 'rgb(20 21 22)', subtle: 'rgb(60 61 62)', text: 'rgb(100 101 102)' } }, dark: { enterprise: { fill: 'rgb(30 31 32)', subtle: 'rgb(70 71 72)', text: 'rgb(110 111 112)' } } }"
    >
      <SButton id="derived-states-button" color="enterprise">
        Derived states
      </SButton>
    </STheme>
    <!-- Restore the stock primary shade changed by this fixture's @theme override. -->
    <section id="stock-colors" style="--tw-color-primary-500: oklch(0.4755 0.2026 279.99); background: var(--ui-bg); position: relative; z-index: 999999;">
      <SButton
        v-for="role in ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'neutral']"
        :id="`stock-${role}`" :key="role" :color="role" variant="soft"
      >
        {{ role }}
      </SButton>
    </section>
    <STheme
      as="section"
      :tokens="{ light: { primary: semanticRecipe, enterprise: semanticRecipe }, dark: { primary: semanticRecipe, enterprise: semanticRecipe } }"
      style="position: relative; z-index: 999999;"
    >
      <div v-for="role in ['primary', 'enterprise']" :key="role">
        <SCheckbox :id="`checkbox-${role}`" :model-value="true" :color="role" variant="card" label="Checked" />
        <SSwitch :id="`switch-${role}`" :model-value="true" :color="role" label="On" />
        <SToggle :id="`toggle-${role}`" default-value :color="role">
          On
        </SToggle>
        <SToggleGroup :id="`toggle-group-${role}`" :items="['One', 'Two']" default-value="One" :color="role" />
        <SChip v-for="variant in ['solid', 'soft', 'outline']" :id="`chip-${role}-${variant}`" :key="`chip-${variant}`" :label="variant" :color="role" :variant="variant" />
        <SRadioGroup :id="`radio-${role}`" v-model="radioValues[role]" :items="['one', 'two']" :color="role" variant="card" />
        <SBadge
          v-for="variant in ['solid', 'soft', 'outline']"
          :id="`semantic-badge-${role}-${variant}`" :key="`badge-${variant}`" :color="role" :variant="variant" dot
          :label="`${role} ${variant}`"
        />
        <SBadge :id="`semantic-dot-${role}`" :color="role" variant="solid" dot :aria-label="`${role} status`" />
        <SButton
          v-for="variant in ['solid', 'soft', 'outline', 'ghost', 'text']"
          :id="`semantic-${role}-${variant}`" :key="variant" :color="role" :variant="variant"
        >
          {{ role }} {{ variant }}
        </SButton>
      </div>
    </STheme>
  </div>
</template>
