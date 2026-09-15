import type { VariantProps } from 'tailwind-variants'
import type { accordionTheme, AccordionThemeSlots } from './theme/accordion'
import type { alertTheme, AlertThemeSlots } from './theme/alert'
import type { alertDialogTheme, AlertDialogThemeSlots } from './theme/alert-dialog'
import type { avatarTheme, AvatarThemeSlots } from './theme/avatar'
import type { avatarGroupTheme, AvatarGroupThemeSlots } from './theme/avatar-group'
import type { badgeTheme, BadgeThemeSlots } from './theme/badge'
import type { breadcrumbTheme, BreadcrumbThemeSlots } from './theme/breadcrumb'
import type { buttonTheme, ButtonThemeSlots } from './theme/button'
import type { buttonGroupTheme, ButtonGroupThemeSlots } from './theme/button-group'
import type { calloutTheme, CalloutThemeSlots } from './theme/callout'
import type { cardTheme, CardThemeSlots } from './theme/card'
import type { cardGroupTheme, CardGroupThemeSlots } from './theme/card-group'
import type { checkboxTheme, CheckboxThemeSlots } from './theme/checkbox'
import type { chipTheme, ChipThemeSlots } from './theme/chip'
import type { codeButtonTheme, CodeButtonThemeSlots } from './theme/code-button'
import type { codeTreeTheme, CodeTreeThemeSlots } from './theme/code-tree'
import type { collapsibleTheme, CollapsibleThemeSlots } from './theme/collapsible'
import type { colorPickerTheme, ColorPickerThemeSlots } from './theme/color-picker'
import type { commandPaletteTheme, CommandPaletteThemeSlots } from './theme/command-palette'
import type { containerTheme, ContainerThemeSlots } from './theme/container'
import type { contentNavigationTheme, ContentNavigationThemeSlots } from './theme/content-navigation'
import type { contentSurroundTheme, ContentSurroundThemeSlots } from './theme/content-surround'
import type { contentTocTheme, ContentTocThemeSlots } from './theme/content-toc'
import type { contextMenuTheme, ContextMenuThemeSlots } from './theme/context-menu'
import type { datePickerTheme, DatePickerThemeSlots } from './theme/date-picker'
import type { drawerTheme, DrawerThemeSlots } from './theme/drawer'
import type { dropdownTheme, DropdownThemeSlots } from './theme/dropdown'
import type { fileTreeTheme, FileTreeThemeSlots } from './theme/file-tree'
import type { fileUploadTheme, FileUploadThemeSlots } from './theme/file-upload'
import type { formFieldTheme, FormFieldThemeSlots } from './theme/form-field'
import type { headerTheme, HeaderThemeSlots } from './theme/header'
import type { iconTheme, IconThemeSlots } from './theme/icon'
import type { inputTheme, InputThemeSlots } from './theme/input'
import type { inputGroupTheme, InputGroupThemeSlots } from './theme/input-group'
import type { inputNumberTheme, InputNumberThemeSlots } from './theme/input-number'
import type { kbdTheme, KbdThemeSlots } from './theme/kbd'
import type { modalTheme, ModalThemeSlots } from './theme/modal'
import type { navigationMenuTheme, NavigationMenuThemeSlots } from './theme/navigation-menu'
import type { pageAsideTheme, PageAsideThemeSlots } from './theme/page-aside'
import type { pageHeaderTheme, PageHeaderThemeSlots } from './theme/page-header'
import type { paginationTheme, PaginationThemeSlots } from './theme/pagination'
import type { pinInputTheme, PinInputThemeSlots } from './theme/pin-input'
import type { popoverTheme, PopoverThemeSlots } from './theme/popover'
import type { progressTheme, ProgressThemeSlots } from './theme/progress'
import type { proseTheme, ProseThemeSlots } from './theme/prose'
import type { radioGroupTheme, RadioGroupThemeSlots } from './theme/radio-group'
import type { ratingTheme, RatingThemeSlots } from './theme/rating'
import type { readMoreTheme, ReadMoreThemeSlots } from './theme/read-more'
import type { scrollAreaTheme, ScrollAreaThemeSlots } from './theme/scroll-area'
import type { selectTheme, SelectThemeSlots } from './theme/select'
import type { separatorTheme, SeparatorThemeSlots } from './theme/separator'
import type { skeletonTheme, SkeletonThemeSlots } from './theme/skeleton'
import type { slideoverTheme, SlideoverThemeSlots } from './theme/slideover'
import type { sliderTheme, SliderThemeSlots } from './theme/slider'
import type { splitterTheme, SplitterThemeSlots } from './theme/splitter'
import type { splitterPanelTheme, SplitterPanelThemeSlots } from './theme/splitter-panel'
import type { splitterResizeHandleTheme, SplitterResizeHandleThemeSlots } from './theme/splitter-resize-handle'
import type { stepperTheme, StepperThemeSlots } from './theme/stepper'
import type { switchTheme, SwitchThemeSlots } from './theme/switch'
import type { tableTheme, TableThemeSlots } from './theme/table'
import type { tabsTheme, TabsThemeSlots } from './theme/tabs'
import type { textareaTheme, TextareaThemeSlots } from './theme/textarea'
import type { toastTheme, ToastThemeSlots } from './theme/toast'
import type { toggleTheme, ToggleThemeSlots } from './theme/toggle'
import type { toggleGroupTheme, ToggleGroupThemeSlots } from './theme/toggle-group'
import type { tooltipTheme, TooltipThemeSlots } from './theme/tooltip'
import type { treeTheme, TreeThemeSlots } from './theme/tree'
import type { ColorRole, RuntimeTokenOverrides } from './utils/color-registry'

type AccordionVariants = VariantProps<typeof accordionTheme>
type AlertVariants = VariantProps<typeof alertTheme>
type AvatarVariants = VariantProps<typeof avatarTheme>
type AvatarGroupVariants = VariantProps<typeof avatarGroupTheme>
type BadgeVariants = VariantProps<typeof badgeTheme>
type BreadcrumbVariants = VariantProps<typeof breadcrumbTheme>
type ButtonVariants = VariantProps<typeof buttonTheme>
type ButtonGroupVariants = VariantProps<typeof buttonGroupTheme>
type CalloutVariants = VariantProps<typeof calloutTheme>
type CardVariants = VariantProps<typeof cardTheme>
type CardGroupVariants = VariantProps<typeof cardGroupTheme>
type CheckboxVariants = VariantProps<typeof checkboxTheme>
type ChipVariants = VariantProps<typeof chipTheme>
type CollapsibleVariants = VariantProps<typeof collapsibleTheme>
type ColorPickerVariants = VariantProps<typeof colorPickerTheme>
type ContainerVariants = VariantProps<typeof containerTheme>
type ContentNavigationVariants = VariantProps<typeof contentNavigationTheme>
type ContentSurroundVariants = VariantProps<typeof contentSurroundTheme>
type ContentTocVariants = VariantProps<typeof contentTocTheme>
type InputVariants = VariantProps<typeof inputTheme>
type InputGroupVariants = VariantProps<typeof inputGroupTheme>
type InputNumberVariants = VariantProps<typeof inputNumberTheme>
type KbdVariants = VariantProps<typeof kbdTheme>
type FileUploadVariants = VariantProps<typeof fileUploadTheme>
type FormFieldVariants = VariantProps<typeof formFieldTheme>
type IconVariants = VariantProps<typeof iconTheme>
type NavigationMenuVariants = VariantProps<typeof navigationMenuTheme>
type PaginationVariants = VariantProps<typeof paginationTheme>
type PinInputVariants = VariantProps<typeof pinInputTheme>
type ProgressVariants = VariantProps<typeof progressTheme>
type RadioGroupVariants = VariantProps<typeof radioGroupTheme>
type RatingVariants = VariantProps<typeof ratingTheme>
type ReadMoreVariants = VariantProps<typeof readMoreTheme>
type SelectVariants = VariantProps<typeof selectTheme>
type SeparatorVariants = VariantProps<typeof separatorTheme>
type SkeletonVariants = VariantProps<typeof skeletonTheme>
type SliderVariants = VariantProps<typeof sliderTheme>
type SwitchVariants = VariantProps<typeof switchTheme>
type StepperVariants = VariantProps<typeof stepperTheme>
type TabsVariants = VariantProps<typeof tabsTheme>
type TextareaVariants = VariantProps<typeof textareaTheme>
type ToastVariants = VariantProps<typeof toastTheme>
type ToggleVariants = VariantProps<typeof toggleTheme>
type ToggleGroupVariants = VariantProps<typeof toggleGroupTheme>
type ContextMenuVariants = VariantProps<typeof contextMenuTheme>
type DrawerVariants = VariantProps<typeof drawerTheme>
type DropdownVariants = VariantProps<typeof dropdownTheme>
type ModalVariants = VariantProps<typeof modalTheme>
type PopoverVariants = VariantProps<typeof popoverTheme>
type SlideoverVariants = VariantProps<typeof slideoverTheme>
type TooltipVariants = VariantProps<typeof tooltipTheme>

// Replace the library recipe's finite color union rather than intersecting it:
// an intersection would discard every application-registered role.
type WithRegisteredColor<T> = Omit<T, 'color'> & { color?: ColorRole }

/**
 * The finite component configuration contract. A `ui` entry exists when the
 * component consumes a scoped Tailwind Variants recipe. Only entries that
 * explicitly declare `defaults` consume scoped presentation defaults;
 * behavioral props never belong there. Add entries alongside runtime and
 * contract tests.
 */
export interface ThemeComponentRegistry {
  alertDialog: {
    slots: AlertDialogThemeSlots
    conditions: Pick<VariantProps<typeof alertDialogTheme>, 'transition'>
  }
  codeButton: {
    slots: CodeButtonThemeSlots
    conditions: Pick<VariantProps<typeof codeButtonTheme>, never>
  }
  codeTree: {
    slots: CodeTreeThemeSlots
    conditions: Pick<VariantProps<typeof codeTreeTheme>, never>
  }
  commandPalette: {
    slots: CommandPaletteThemeSlots
    conditions: Pick<VariantProps<typeof commandPaletteTheme>, never>
  }
  datePicker: {
    slots: DatePickerThemeSlots
    conditions: Pick<VariantProps<typeof datePickerTheme>, 'size' | 'invalid' | 'range'>
  }
  fileTree: {
    slots: FileTreeThemeSlots
    conditions: WithRegisteredColor<Pick<VariantProps<typeof fileTreeTheme>, 'color' | 'selected' | 'isNested'>>
  }
  prose: {
    slots: ProseThemeSlots
    conditions: WithRegisteredColor<Pick<VariantProps<typeof proseTheme>, 'color'>>
  }
  splitter: {
    slots: SplitterThemeSlots
    conditions: Pick<VariantProps<typeof splitterTheme>, 'direction'>
  }
  splitterPanel: {
    slots: SplitterPanelThemeSlots
    conditions: Pick<VariantProps<typeof splitterPanelTheme>, never>
  }
  splitterResizeHandle: {
    slots: SplitterResizeHandleThemeSlots
    conditions: WithRegisteredColor<Pick<VariantProps<typeof splitterResizeHandleTheme>, 'color' | 'direction'>>
  }
  table: {
    slots: TableThemeSlots
    conditions: WithRegisteredColor<Pick<VariantProps<typeof tableTheme>, 'color' | 'size' | 'gridlines' | 'striped' | 'scrollable'>>
  }
  tree: {
    slots: TreeThemeSlots
    conditions: WithRegisteredColor<Pick<VariantProps<typeof treeTheme>, 'color' | 'size'>>
  }
  accordion: {
    slots: AccordionThemeSlots
    conditions: WithRegisteredColor<Pick<AccordionVariants, 'color' | 'size' | 'variant' | 'chevronPosition'>>
  }
  alert: {
    slots: AlertThemeSlots
    conditions: WithRegisteredColor<Pick<AlertVariants, 'color' | 'variant'>>
  }
  avatar: {
    slots: AvatarThemeSlots
    conditions: WithRegisteredColor<Pick<AvatarVariants, 'color' | 'statusColor' | 'size' | 'shape'>>
    defaults: WithRegisteredColor<Pick<AvatarVariants, 'color' | 'size'>>
  }
  avatarGroup: {
    slots: AvatarGroupThemeSlots
    conditions: Pick<AvatarGroupVariants, 'size'>
  }
  badge: {
    slots: BadgeThemeSlots
    conditions: WithRegisteredColor<Pick<BadgeVariants, 'color' | 'variant' | 'size' | 'dotOnly' | 'iconOnly'>>
    defaults: WithRegisteredColor<Pick<BadgeVariants, 'color' | 'size'>>
  }
  breadcrumb: {
    slots: BreadcrumbThemeSlots
    conditions: WithRegisteredColor<Pick<BreadcrumbVariants, 'color'>>
  }
  button: {
    slots: ButtonThemeSlots
    conditions: WithRegisteredColor<Pick<ButtonVariants, 'color' | 'variant' | 'size' | 'block' | 'raised' | 'square'>>
    defaults: WithRegisteredColor<Pick<ButtonVariants, 'color' | 'size'>>
  }
  buttonGroup: {
    slots: ButtonGroupThemeSlots
    conditions: Pick<ButtonGroupVariants, 'orientation'>
  }
  callout: {
    slots: CalloutThemeSlots
    conditions: Pick<CalloutVariants, 'type'>
  }
  card: {
    slots: CardThemeSlots
    conditions: Pick<CardVariants, 'variant'>
  }
  cardGroup: {
    slots: CardGroupThemeSlots
    conditions: Pick<CardGroupVariants, 'cols'>
  }
  chip: {
    slots: ChipThemeSlots
    conditions: WithRegisteredColor<Pick<ChipVariants, 'color' | 'size'>>
    defaults: WithRegisteredColor<Pick<ChipVariants, 'color' | 'size'>>
  }
  collapsible: {
    slots: CollapsibleThemeSlots
    conditions: WithRegisteredColor<Pick<CollapsibleVariants, 'color' | 'size' | 'direction'>>
  }
  input: {
    slots: InputThemeSlots
    conditions: WithRegisteredColor<Pick<InputVariants, 'color' | 'size' | 'hasLeadingIcon' | 'hasTrailingIcon' | 'invalid'>>
    defaults: WithRegisteredColor<Pick<InputVariants, 'color' | 'size'>>
  }
  inputGroup: {
    slots: InputGroupThemeSlots
    conditions: Pick<InputGroupVariants, 'orientation'>
  }
  checkbox: {
    slots: CheckboxThemeSlots
    conditions: WithRegisteredColor<Pick<CheckboxVariants, 'color' | 'size' | 'variant' | 'invalid'>>
  }
  colorPicker: {
    slots: ColorPickerThemeSlots
    conditions: WithRegisteredColor<Pick<ColorPickerVariants, 'color' | 'size'>>
  }
  container: {
    slots: ContainerThemeSlots
    conditions: Pick<ContainerVariants, 'size'>
  }
  /** Nested groups use Accordion internally; this key owns the navigation-tree adaptation. */
  contentNavigation: {
    slots: ContentNavigationThemeSlots
    conditions: WithRegisteredColor<Pick<ContentNavigationVariants, 'color' | 'isNested'>>
  }
  contentSurround: {
    slots: ContentSurroundThemeSlots
    conditions: WithRegisteredColor<Pick<ContentSurroundVariants, 'color' | 'align'>>
  }
  contentToc: {
    slots: ContentTocThemeSlots
    conditions: WithRegisteredColor<Pick<ContentTocVariants, 'color' | 'active'>>
  }
  fileUpload: {
    slots: FileUploadThemeSlots
    conditions: WithRegisteredColor<Pick<FileUploadVariants, 'color' | 'size' | 'invalid'>>
  }
  formField: {
    slots: FormFieldThemeSlots
    conditions: Pick<FormFieldVariants, 'size' | 'orientation'>
  }
  header: {
    slots: HeaderThemeSlots
    conditions: Pick<VariantProps<typeof headerTheme>, never>
  }
  /** Shared primitive recipe used by direct SIcon and icons inside components. */
  icon: {
    slots: IconThemeSlots
    conditions: WithRegisteredColor<Pick<IconVariants, 'color'>>
  }
  inputNumber: {
    slots: InputNumberThemeSlots
    conditions: WithRegisteredColor<Pick<InputNumberVariants, 'color' | 'size' | 'orientation' | 'invalid'>>
  }
  kbd: {
    slots: KbdThemeSlots
    conditions: Pick<KbdVariants, 'size'>
  }
  /** Shared by the public component and its recursive accordion/flyout renderers. */
  navigationMenu: {
    slots: NavigationMenuThemeSlots
    conditions: WithRegisteredColor<Pick<NavigationMenuVariants, 'orientation' | 'color' | 'variant' | 'active' | 'disabled' | 'highlight' | 'collapsed' | 'flyoutRoot'>>
  }
  /** Page controls are Button recipes; this key owns wrapper and ellipsis layout. */
  pagination: {
    slots: PaginationThemeSlots
    conditions: Pick<PaginationVariants, 'size'>
  }
  pageHeader: {
    slots: PageHeaderThemeSlots
    conditions: Pick<VariantProps<typeof pageHeaderTheme>, never>
  }
  /** Owns PageAside layout; its nested ScrollArea remains independently configurable. */
  pageAside: {
    slots: PageAsideThemeSlots
    conditions: Pick<VariantProps<typeof pageAsideTheme>, never>
  }
  pinInput: {
    slots: PinInputThemeSlots
    conditions: WithRegisteredColor<Pick<PinInputVariants, 'color' | 'size' | 'invalid'>>
  }
  progress: {
    slots: ProgressThemeSlots
    conditions: WithRegisteredColor<Pick<ProgressVariants, 'color' | 'size' | 'indeterminate'>>
  }
  radioGroup: {
    slots: RadioGroupThemeSlots
    conditions: WithRegisteredColor<Pick<RadioGroupVariants, 'color' | 'size' | 'orientation' | 'variant' | 'invalid'>>
  }
  rating: {
    slots: RatingThemeSlots
    conditions: WithRegisteredColor<Pick<RatingVariants, 'color' | 'size' | 'orientation'>>
  }
  readMore: {
    slots: ReadMoreThemeSlots
    conditions: WithRegisteredColor<Pick<ReadMoreVariants, 'color' | 'open'>>
  }
  /** Shared by Select and Autocomplete, which intentionally use one recipe. */
  select: {
    slots: SelectThemeSlots
    conditions: WithRegisteredColor<Pick<SelectVariants, 'color' | 'size' | 'invalid'>>
  }
  scrollArea: {
    slots: ScrollAreaThemeSlots
    conditions: Pick<VariantProps<typeof scrollAreaTheme>, never>
  }
  separator: {
    slots: SeparatorThemeSlots
    conditions: WithRegisteredColor<Pick<SeparatorVariants, 'orientation' | 'variant' | 'color'>>
  }
  skeleton: {
    slots: SkeletonThemeSlots
    conditions: Pick<SkeletonVariants, 'animation'>
  }
  slider: {
    slots: SliderThemeSlots
    conditions: WithRegisteredColor<Pick<SliderVariants, 'color' | 'size' | 'orientation' | 'thumbVariant'>>
  }
  switch: {
    slots: SwitchThemeSlots
    conditions: WithRegisteredColor<Pick<SwitchVariants, 'color' | 'size' | 'invalid'>>
  }
  stepper: {
    slots: StepperThemeSlots
    conditions: WithRegisteredColor<Pick<StepperVariants, 'color' | 'size' | 'orientation'>>
  }
  tabs: {
    slots: TabsThemeSlots
    conditions: WithRegisteredColor<Pick<TabsVariants, 'color' | 'variant'>>
  }
  textarea: {
    slots: TextareaThemeSlots
    conditions: WithRegisteredColor<Pick<TextareaVariants, 'color' | 'size' | 'hasLeadingIcon' | 'hasTrailingIcon' | 'autoresize' | 'invalid'>>
  }
  toast: {
    slots: ToastThemeSlots
    conditions: WithRegisteredColor<Pick<ToastVariants, 'color'>>
  }
  toggle: {
    slots: ToggleThemeSlots
    conditions: WithRegisteredColor<Pick<ToggleVariants, 'color' | 'size' | 'square'>>
  }
  toggleGroup: {
    slots: ToggleGroupThemeSlots
    conditions: WithRegisteredColor<Pick<ToggleGroupVariants, 'color' | 'size' | 'orientation'>>
  }
  /** Overlay recipes accept typed UI extension but no scoped prop defaults. */
  contextMenu: {
    slots: ContextMenuThemeSlots
    conditions: Pick<ContextMenuVariants, 'destructive'>
  }
  drawer: {
    slots: DrawerThemeSlots
    conditions: Pick<DrawerVariants, 'side' | 'transition'>
  }
  dropdown: {
    slots: DropdownThemeSlots
    conditions: Pick<DropdownVariants, 'destructive'>
  }
  modal: {
    slots: ModalThemeSlots
    conditions: Pick<ModalVariants, 'fullscreen' | 'transition'>
  }
  popover: {
    slots: PopoverThemeSlots
    conditions: Pick<PopoverVariants, never>
  }
  slideover: {
    slots: SlideoverThemeSlots
    conditions: Pick<SlideoverVariants, 'side' | 'inset' | 'transition'>
  }
  tooltip: {
    slots: TooltipThemeSlots
    conditions: Pick<TooltipVariants, never>
  }
}

type ThemeConditions<K extends keyof ThemeComponentRegistry> = {
  [P in keyof ThemeComponentRegistry[K]['conditions']]?: ThemeComponentRegistry[K]['conditions'][P] | readonly NonNullable<ThemeComponentRegistry[K]['conditions'][P]>[]
}

type ThemeSlots<K extends keyof ThemeComponentRegistry> = Partial<Record<ThemeComponentRegistry[K]['slots'], string>>

/** Typed Tailwind Variants extensions accepted by `selaras.ui` and `STheme`. */
export type ThemeUiOverrides = {
  [K in keyof ThemeComponentRegistry]?: {
    slots?: ThemeSlots<K>
    compoundVariants?: readonly (ThemeConditions<K> & { class: ThemeSlots<K> })[]
  }
}

/** Presentation defaults have a deliberately separate, finite home from UI recipes. */
export type ThemeDefaults = {
  [K in keyof ThemeComponentRegistry as 'defaults' extends keyof ThemeComponentRegistry[K] ? K : never]?: ThemeComponentRegistry[K] extends { defaults: infer Defaults } ? Partial<Defaults> : never
}

/** Public configuration shared by `app.config` and scoped `STheme` providers. */
export interface ThemeConfiguration {
  ui?: ThemeUiOverrides
  defaults?: ThemeDefaults
  tokens?: RuntimeTokenOverrides
}
