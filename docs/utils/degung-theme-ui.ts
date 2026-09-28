import type { ThemeUiOverrides } from '@sewadah/selaras/theme'

/**
 * Degung's component-level chrome treatment. Kept in the docs app as a
 * scoped STheme recipe so the other global presets keep their own shapes.
 */
export const degungThemeUi = {
  accordion: { slots: { item: 'selaras-degung-panel', trigger: 'selaras-degung-control' } },
  alert: { slots: { root: 'selaras-degung-panel' } },
  badge: { slots: { base: 'selaras-degung-control' } },
  button: { slots: { base: 'selaras-degung-button' } },
  card: { slots: { root: 'selaras-degung-panel', header: 'selaras-degung-panel-header', footer: 'selaras-degung-panel-footer' } },
  checkbox: { slots: { box: 'selaras-degung-check' } },
  chip: { slots: { root: 'selaras-degung-control' } },
  drawer: { slots: { content: 'selaras-degung-panel' } },
  dropdown: { slots: { content: 'selaras-degung-panel' } },
  input: { slots: { base: 'selaras-degung-field' } },
  inputNumber: { slots: { root: 'selaras-degung-field' } },
  modal: { slots: { content: 'selaras-degung-panel' } },
  popover: { slots: { content: 'selaras-degung-panel' } },
  progress: { slots: { root: 'selaras-degung-track', indicator: 'selaras-degung-progress' } },
  prose: { slots: { preWrapper: 'selaras-degung-code-frame', preHeader: 'selaras-degung-code-header', pre: 'selaras-degung-code' } },
  radioGroup: { slots: { item: 'selaras-degung-radio' } },
  select: { slots: { trigger: 'selaras-degung-field', content: 'selaras-degung-panel' } },
  slider: { slots: { root: 'selaras-degung-slider', track: 'selaras-degung-track', thumb: 'selaras-degung-slider-thumb' } },
  switch: { slots: { track: 'selaras-degung-switch-track', thumb: 'selaras-degung-switch-thumb' } },
  table: { slots: { wrapper: 'selaras-degung-panel', thead: 'selaras-degung-panel-header' } },
  tabs: { slots: { list: 'selaras-degung-tabs', indicator: 'selaras-degung-tab-indicator' } },
  textarea: { slots: { base: 'selaras-degung-field' } },
  toast: { slots: { root: 'selaras-degung-panel' } },
  toggle: { slots: { base: 'selaras-degung-button' } },
  toggleGroup: { slots: { item: 'selaras-degung-button' } },
} satisfies ThemeUiOverrides
