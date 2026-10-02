import type { ThemeUiOverrides } from '@sewadah/selaras/theme'

/**
 * Degung's component-level treatment: rounded, glossy silver hardware with
 * navy display wells. Kept in the docs app as a scoped STheme recipe so the
 * other presets keep their own shapes. Classes are split per variant so the
 * finish (docs/assets/style.css) layers over each variant's own colors
 * instead of painting over them.
 */
export const degungThemeUi = {
  // Its own class, not the shared `selaras-degung-panel` Card/Table also
  // use - an accordion item is a lit display panel (navy, not silver),
  // and needs independent control from those still-silver surfaces.
  accordion: { slots: { item: 'selaras-degung-accordion-item', trigger: 'selaras-degung-accordion-trigger', content: 'selaras-degung-accordion-content' } },
  alert: {
    compoundVariants: [
      { variant: 'solid', class: { root: 'selaras-degung-glass selaras-degung-glass--solid' } },
      { variant: 'soft', class: { root: 'selaras-degung-glass' } },
      { variant: 'outline', class: { root: 'selaras-degung-glass' } },
    ],
  },
  badge: {
    slots: { base: 'selaras-degung-pill' },
    compoundVariants: [
      { variant: 'solid', class: { base: 'selaras-degung-lit' } },
      { variant: 'soft', class: { base: 'selaras-degung-tint' } },
    ],
  },
  button: {
    slots: { base: 'selaras-degung-button' },
    compoundVariants: [
      { variant: 'solid', class: { base: 'selaras-degung-lit' } },
      { variant: 'soft', class: { base: 'selaras-degung-tint' } },
      { variant: 'subtle', class: { base: 'selaras-degung-tint' } },
      { variant: 'outline', class: { base: 'selaras-degung-chrome selaras-degung-chrome--ringed' } },
    ],
  },
  card: { slots: { root: 'selaras-degung-panel', header: 'selaras-degung-titlebar', footer: 'selaras-degung-panel-footer' } },
  // Its own class so the stylesheet can re-square each grouped button's
  // shared inner corner - the unconditional pill radius below would
  // otherwise override ButtonGroup's own rounded-s-none/e-none (theme/
  // button-group.ts), leaving every button its own separate pill instead
  // of one joined segmented one.
  buttonGroup: {
    slots: { root: 'selaras-degung-button-group' },
    compoundVariants: [
      { orientation: 'vertical', class: { root: 'selaras-degung-button-group--vertical' } },
    ],
  },
  checkbox: { slots: { box: 'selaras-degung-check' } },
  chip: {
    slots: { root: 'selaras-degung-pill' },
    compoundVariants: [
      { variant: 'solid', class: { root: 'selaras-degung-lit' } },
      { variant: 'soft', class: { root: 'selaras-degung-tint' } },
    ],
  },
  drawer: { slots: { content: 'selaras-degung-panel' } },
  dropdown: { slots: { content: 'selaras-degung-panel' } },
  input: { slots: { base: 'selaras-degung-field' } },
  inputNumber: { slots: { root: 'selaras-degung-field' } },
  modal: { slots: { content: 'selaras-degung-panel' } },
  popover: { slots: { content: 'selaras-degung-panel' } },
  progress: { slots: { root: 'selaras-degung-groove', indicator: 'selaras-degung-lit' } },
  prose: { slots: { preWrapper: 'selaras-degung-code-frame', preHeader: 'selaras-degung-code-header', pre: 'selaras-degung-display' } },
  radioGroup: { slots: { item: 'selaras-degung-radio' } },
  select: { slots: { trigger: 'selaras-degung-field', content: 'selaras-degung-panel' } },
  // Its own thumb class, not the switch's circular `selaras-degung-knob` -
  // this one is an elongated pill standing on the track, not a disc.
  slider: { slots: { track: 'selaras-degung-groove', range: 'selaras-degung-lit', thumb: 'selaras-degung-slider-thumb' } },
  switch: { slots: { track: 'selaras-degung-switch', thumb: 'selaras-degung-knob' } },
  table: { slots: { wrapper: 'selaras-degung-panel', thead: 'selaras-degung-titlebar' } },
  tabs: {
    compoundVariants: [
      { variant: 'pill', class: { list: 'selaras-degung-groove selaras-degung-groove--list', indicator: 'selaras-degung-lit' } },
    ],
  },
  textarea: { slots: { base: 'selaras-degung-field' } },
  toast: { slots: { root: 'selaras-degung-glass' } },
  toggle: { slots: { base: 'selaras-degung-button selaras-degung-chrome selaras-degung-toggle' } },
  toggleGroup: { slots: { item: 'selaras-degung-chrome selaras-degung-toggle' } },
} satisfies ThemeUiOverrides
