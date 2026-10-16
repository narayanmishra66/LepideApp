# Lepidus Design System — AI Design Contract

**File purpose:** This markdown file teaches an AI assistant how to design and generate Lepide-style product UI using the Lepidus Design System without inventing off-system visuals, classes, spacing, colors, or behavior.

**Primary use:** Paste this file into Claude Code, Cursor, ChatGPT, Codex, Windsurf, v0, Lovable, or any UI-building assistant before asking it to create a screen, component, prototype, or production HTML/CSS/JS output.

**System status reviewed:** 2 October 2026

**Source references**

- Lepidus Storybook: `https://lepidus-design-system-button.vercel.app/storybook/?path=/docs/lepidus-introduction--docs`
- Lepidus docs: `https://lepidus-design-system-button.vercel.app/`
- AI rules: `https://lepidus-design-system-button.vercel.app/llms.txt`
- Component manifest: `https://lepidus-design-system-button.vercel.app/component-manifest.json`
- Token reference: `https://lepidus-design-system-button.vercel.app/tokens/`
- Theming: `https://lepidus-design-system-button.vercel.app/foundations/theming/`
- Accessibility: `https://lepidus-design-system-button.vercel.app/foundations/accessibility/`
- Dropdown usage: `https://lepidus-design-system-button.vercel.app/components/dropdown/`
- Dropdown code: `https://lepidus-design-system-button.vercel.app/components/dropdown/code/`
- Dropdown specifications: `https://lepidus-design-system-button.vercel.app/components/dropdown/specifications/`
- Dropdown accessibility: `https://lepidus-design-system-button.vercel.app/components/dropdown/accessibility/`

---

## -1. Source precedence and fidelity lock

This file is a **design-system implementation contract**, not a loose style guide.

When there is any ambiguity, use this priority order:

1. **Component Code page** — canonical HTML/React anatomy and documented class names.
2. **Component Specifications page** — supported API, states, modifiers, and generated class inventory.
3. **Component Accessibility page** — required semantics, focus behavior, keyboard behavior, and assistive-technology behavior.
4. **Storybook live story** — visual/state verification.
5. **Token reference** — exact token names and theme-aware values.
6. **This markdown file** — orchestration rules, composition rules, and AI guardrails.

If this file conflicts with a current component Code/Specifications/Accessibility page, the current component documentation wins.

### Component fidelity rule

When a Lepidus component exists, AI must **instantiate the documented component**, not recreate its appearance.

For every component-level UI need:

- Use the documented `lp-*` block, elements, modifiers, and `data-lp-*` hooks.
- Preserve the documented DOM hierarchy where interaction or styling depends on it.
- Preserve documented native elements (`button`, `input`, `table`, etc.).
- Preserve documented ARIA attributes and state updates.
- Preserve documented system-JS behavior.
- Do not replace a Lepidus component with a visually similar custom component.
- Do not use third-party/headless components when an equivalent Lepidus component exists.
- Do not restyle internal Lepidus elements with local CSS.
- Do not “simplify” documented markup by removing structural elements that appear redundant.

### Canonical-code rule

If a component has a Code page, **copy its anatomy first, then replace only content/data**.

Allowed changes:

```text
labels
option values
row data
IDs
business copy
layout wrappers around the component
```

Not allowed without a design-system update:

```text
lp-* class names
documented element hierarchy
component modifiers
ARIA roles/states
data-lp-* hooks
component internal spacing
component internal radii
component colors
component hover/focus behavior
component open/close behavior
```

### No “looks similar” substitutions

The following are implementation failures when the task calls for a Lepidus component:

```text
custom div styled like a button
native <select> styled to resemble Lepidus Dropdown
Headless UI / Radix / MUI select replacing Lepidus Dropdown
custom modal replacing lp-modal
custom data grid replacing lp-table
custom tabs replacing lp-tabs
hardcoded CSS that imitates component geometry
```

The goal is not “close to Lepidus.” The goal is **the documented Lepidus implementation**.

---

## 0. Non-negotiable AI contract

Any AI using this file must follow these rules before generating UI.

```yaml
lepidus_ai_contract:
  design_system: Lepidus
  owner_context: Lepide enterprise products
  preferred_output: plain HTML + documented lp- classes
  secondary_output: React only if the target project already uses React
  css_distribution: '@ramsarjal-404/css'
  react_distribution: '@ramsarjal-404/react'
  token_source: Figma DTCG -> CSS variables
  class_prefix: lp-
  theme_attribute: data-theme
  allowed_themes:
    - light
    - dark
    - hc
  default_theme: light
  font_family: var(--font-family-primary)
  font_name: Open Sans
  accessibility_target: WCAG 2.1 AA
  required_quality_gates:
    - no raw hex colors in product UI
    - no hardcoded spacing, radius, font-size, or component color values
    - use component tokens first
    - use semantic tokens second
    - use primitive tokens only when no component/semantic token exists
    - use documented lp- classes only for components
    - preserve keyboard and ARIA behavior from documented markup
    - check light, dark, and high contrast themes
    - check LTR and RTL when layout direction matters
  strict_component_locks:
    dropdown:
      require_documented_lp_markup: true
      forbid_native_select_substitution: true
      forbid_third_party_select_substitution: true
      require_system_js_for_plain_html: true
      require_open_panel_header: true
      require_listbox_semantics: true
      require_builtin_multi_checkbox_anatomy: true
      forbid_local_internal_styling: true
```

### Absolute rules

1. **Default to plain HTML with `lp-` classes.** Lepide teams may use HTML/CSS/JS directly, so the safest default is system markup using `lp-*` classes.
2. **Use React only when the user explicitly says the project is React or asks for React.** Import from `@ramsarjal-404/react`.
3. **Never invent component classes.** If a class starts with `lp-`, it must exist in the Lepidus docs, Storybook, `llms.txt`, or component manifest.
4. **Never hardcode visual values.** No raw hex, no one-off radii, no arbitrary spacing, no custom font sizes for components. Use tokens.
5. **Never write per-theme custom CSS.** Use `data-theme="light"`, `data-theme="dark"`, or `data-theme="hc"` and let variables resolve.
6. **Do not rebuild existing components.** If Lepidus has a Button, use `lp-button`. If it has a Modal, use `lp-modal`. If it has a Table, use `lp-table`.
7. **Use `lepidus.js` for documented interactive behavior.** Do not hand-roll tabs, modal focus trapping, accordions, dropdowns, tooltips, steppers, or toast behavior unless the system has no documented support.
8. **Accessibility is not optional.** Copy semantic markup, ARIA, focus behavior, and keyboard behavior from the documented component patterns.
9. **Theme and state coverage is required.** Every UI must be able to survive default, hover, focus, disabled, loading, empty, error, success, dark, and high-contrast states where applicable.
10. **If a needed pattern is missing, create a “system gap note” instead of inventing a new system.** Use closest existing Lepidus components and document the gap.

---

## 1. What Lepidus is

Lepidus is Lepide’s enterprise design system for building consistent, accessible, token-driven product interfaces. It is not just a visual library. It is a delivery contract between Design, Frontend, QA, and AI tools.

The system is built around:

- **Design tokens** generated from Figma DTCG sources.
- **Three themes**: light, dark, and high contrast.
- **A plain-CSS distribution** for HTML/CSS/JS apps.
- **A React package** for React apps.
- **Storybook examples** showing live component states.
- **Machine-readable AI surfaces**: `llms.txt`, `component-manifest.json`, and MCP tools.
- **Accessibility gates** targeting WCAG 2.1 AA.

### Design philosophy

Lepidus UI should feel:

- Enterprise-grade, calm, and trustworthy.
- Clear enough for security, audit, compliance, and admin workflows.
- Component-first, not decorative-first.
- Data-friendly and workflow-friendly.
- Accessible by default.
- Token-driven and theme-safe.
- Predictable for QA and developers.

The visual language favors:

- Open Sans typography.
- Brand blue primary actions.
- Pill-shaped buttons, inputs, dropdowns, toggles, and form controls.
- Rounded cards and modals.
- Clear status colors with labels, not color-only meaning.
- Subtle surfaces, borders, and shadows.
- Dense but readable data tables.
- Explicit empty, error, loading, disabled, and feedback states.

---

## 2. Required page shell

Use this base shell for plain HTML output.

```html
<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lepidus UI</title>
  <link rel="stylesheet" href="/v1/lepidus.css" />
</head>
<body>
  <!-- Build the product screen here using documented lp- classes. -->

  <script src="/v1/lepidus.js" defer></script>
</body>
</html>
```

### Theme switching

```html
<html data-theme="light">
<html data-theme="dark">
<html data-theme="hc">
```

Do not write:

```css
[data-theme="dark"] .custom-button {
  background: #123456;
}
```

Do this instead:

```css
.custom-layout-only-wrapper {
  background: var(--color-background-page);
  color: var(--color-text-primary);
}
```

Layout-only custom classes are allowed only when they do not replace a Lepidus component and only when they use tokens.

---

## 3. Token model

Lepidus tokens follow a three-tier chain:

```text
primitive token -> semantic token -> component token -> component UI
```

### Token priority for AI-generated UI

Use tokens in this order:

1. `var(--component-*)` for component-specific visual decisions.
2. `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--typography-*)`, `var(--shadow-*)` for semantic layout and composition.
3. Primitive tokens only when a semantic token does not exist.

### Token categories

The token reference includes:

- Color semantic tokens.
- Component tokens.
- Spacing tokens.
- Radius tokens.
- Typography tokens.
- Shadow tokens.
- Motion tokens.
- Z-index tokens.
- Breakpoint tokens.
- Primitive tokens.

### Key semantic tokens

Use these frequently:

```css
/* Brand */
color: var(--color-brand-primary);
color: var(--color-brand-primary-hover);
color: var(--color-brand-secondary);
color: var(--color-brand-accent);

/* Surfaces */
background: var(--color-background-page);
background: var(--color-background-surface);
background: var(--color-background-raised);
background: var(--color-background-subtle);
background: var(--color-background-cards);

/* Text */
color: var(--color-text-primary);
color: var(--color-text-secondary);
color: var(--color-text-disabled);
color: var(--color-text-brand);
color: var(--color-text-danger);
color: var(--color-text-inverse);

/* Borders */
border-color: var(--color-border-default);
border-color: var(--color-border-strong);
border-color: var(--color-border-brand);
border-color: var(--color-border-danger);

/* Status */
background: var(--color-status-success-bg);
color: var(--color-status-success-text);
background: var(--color-status-warning-bg);
color: var(--color-status-warning-text);
background: var(--color-status-error-bg);
color: var(--color-status-error-text);
background: var(--color-status-na-bg);
color: var(--color-status-na-text);

/* Focus */
outline-color: var(--color-focus-ring);
```

### Key component tokens

```css
/* Button */
var(--component-button-radius)
var(--component-button-fontSize)
var(--component-button-lineHeight)
var(--component-button-paddingX)
var(--component-button-paddingY)
var(--component-button-primary-fill)
var(--component-button-primary-text)
var(--component-button-primary-hover-fill)
var(--component-button-secondary-fill)
var(--component-button-secondary-text)
var(--component-button-danger-fill)
var(--component-button-danger-text)
var(--component-button-white-fill)
var(--component-button-white-text)
var(--component-button-focus-ring)

/* Input */
var(--component-input-border)
var(--component-input-border-focus)
var(--component-input-bg)
var(--component-input-bg-focus)
var(--component-input-bg-disabled)
var(--component-input-text)
var(--component-input-placeholder)
var(--component-input-label)
var(--component-input-radius)
var(--component-input-fontSize)
var(--component-input-lineHeight)
var(--component-input-paddingX)
var(--component-input-paddingY)

/* Table */
var(--component-table-header-bg)
var(--component-table-header-text)
var(--component-table-cell-bg)
var(--component-table-cell-text)
var(--component-table-border)
var(--component-table-row-hover)
var(--component-table-header-fontSize)
var(--component-table-cell-fontSize)
var(--component-table-cellPaddingX)
var(--component-table-cellPaddingY)

/* Card */
var(--component-card-bg)
var(--component-card-border)
var(--component-card-radius)
var(--component-card-title-text)
var(--component-card-body-text)

/* Modal */
var(--component-modal-bg)
var(--component-modal-overlay)
var(--component-modal-title-text)
var(--component-modal-body-text)
var(--component-modal-border)
var(--component-modal-radius)

/* Dropdown */
var(--component-dropdown-bg)
var(--component-dropdown-border)
var(--component-dropdown-item-text)
var(--component-dropdown-item-hover)
var(--component-dropdown-radius)
var(--component-dropdown-trigger-text)
var(--component-dropdown-header-bg)
var(--component-dropdown-option-text)
var(--component-dropdown-checkbox-border)
var(--component-dropdown-checkbox-fill)
var(--component-dropdown-disabled-bg)
var(--component-dropdown-disabled-text)

/* Overlay stacking */
var(--z-dropdown)
```

---

## 4. Typography rules

### Primary font

Use Open Sans through the system token:

```css
font-family: var(--font-family-primary);
```

### AI typography behavior

- Do not choose a new font.
- Do not hardcode font sizes for components.
- Use documented component typography.
- Use headings clearly for product hierarchy.
- Keep labels short and scannable.
- Use sentence case for normal UI labels.
- Use verb-first action labels.

### Action label rules

Good:

- Save changes
- Export report
- Add credentials
- Delete server
- Apply filters
- View report

Bad:

- Click here
- Submit now please
- Make this happen
- Delete the selected row from this table forever

---

## 5. Accessibility contract

Lepidus targets WCAG 2.1 AA. AI output must keep that standard.

### Required accessibility patterns

```text
Button: native <button>, visible text label, disabled attribute for disabled state.
Input errors: aria-invalid + aria-describedby connected to visible error message.
Toggle: role="switch" + aria-checked.
Breadcrumb: aria-current="page" on the current item.
Dropdown: role="listbox" and options with role="option".
Modal: role="dialog" + aria-modal="true" + aria-labelledby.
Avatar: role="img" + aria-label; fallback initials decorative when needed.
Toast: announced through polite live region.
Tabs: role="tablist", role="tab", aria-selected, aria-controls, role="tabpanel".
Table: semantic <table>, meaningful caption, scope="col" headers, aria-sort when sortable.
```

### Keyboard rules

- Every interactive control must be reachable by keyboard.
- Focus must be visible with `:focus-visible`.
- Never remove the focus ring.
- Modal must trap focus and restore focus on close.
- Dropdowns, menus, modals, and tooltips must close on Escape where documented.
- Tabs must support arrows, Home, End, and roving `tabindex` through system JS.
- RTL should work for components that support direction toggling.

### Color and status rules

- Never rely on color alone.
- Pair status color with labels, icons, or text.
- Use Badge, Tag, Message, Toast, or AlertPanel for status.
- Do not express “error” only through red border; include visible error text.

### Motion rules

- Respect `prefers-reduced-motion`.
- Motion must never be required to understand state change.
- Avoid decorative animation unless the product task benefits from it.

---

## 6. Component inventory: 44 components

### Actions

1. ActionItem
2. Button
3. Link

### Forms

4. Calendar
5. Checkbox
6. Dropdown
7. Filter
8. Input
9. Radio
10. Stepper
11. Textarea
12. TextField
13. TimePicker
14. Toggle

### Data Display

15. Accordion
16. Avatar
17. Badge
18. Card
19. Pagination
20. Progress
21. Scrollbar
22. Table
23. Tag

### Feedback

24. AlertPanel
25. EmptyState
26. Message
27. Modal
28. Skeleton
29. Spinner
30. Toast
31. ToastProvider

### Navigation

32. Breadcrumb
33. FolderTree
34. SettingsPanel
35. Sidebar
36. Steps
37. Tabs

### Overlays

38. Tooltip

### Charts

39. BarChart
40. BubbleChart
41. ColumnChart
42. DonutChart
43. GaugeChart
44. LineChart

---

## 7. Plain CSS component class inventory

Use these class names exactly. Do not invent variants.

### Button

```text
lp-button
lp-button--primary
lp-button--secondary
lp-button--danger
lp-button--white
lp-button--sm
lp-button--md
lp-button--lg
lp-button--full-width
lp-button__icon-left
lp-button__icon-right
```

### Badge

```text
lp-badge
lp-badge--default
lp-badge--success
lp-badge--warning
lp-badge--error
lp-badge--neutral
lp-badge__dot
lp-badge__icon
```

### Tag

```text
lp-tag
lp-tag--default
lp-tag--success
lp-tag--warning
lp-tag--error
lp-tag--neutral
lp-tag--disabled
lp-tag__label
lp-tag__remove
```

### Card

```text
lp-card
lp-card--elevated
lp-card--borderless
lp-card__header
lp-card__title
lp-card__actions
lp-card__body
lp-card__footer
```

### Input

```text
lp-input
lp-input--full-width
lp-input__row
lp-input__row--label-top
lp-input__row--label-left
lp-input__label
lp-input__field
lp-input__field--error
lp-input__field--disabled
lp-input__input
lp-input__icon-left
lp-input__icon-right
lp-input__message
lp-input__message--error
lp-input__message--indent
```

### Toggle

```text
lp-toggle
lp-toggle--on
lp-toggle__thumb
```

Use a real button with `role="switch"` and `aria-checked`.

### Checkbox

```text
lp-checkbox
lp-checkbox--disabled
lp-checkbox__control
lp-checkbox__input
lp-checkbox__box
lp-checkbox__box--error
lp-checkbox__check
lp-checkbox__dash
lp-checkbox__label
```

### Breadcrumb

```text
lp-breadcrumb
lp-breadcrumb__list
lp-breadcrumb__item
lp-breadcrumb__link
lp-breadcrumb__separator
lp-breadcrumb__current
```

### Table

```text
lp-table
lp-table__table
lp-table__th
lp-table__header-inner
lp-table__header-label
lp-table__sort-button
lp-table__sort-arrow
lp-table__sort-arrow--active
lp-table__sort-arrow--desc
lp-table__filter-cell
lp-table__filter-field
lp-table__filter-input
lp-table__td
lp-table__cell-inner
lp-table__cell-text
lp-table__row--selected
lp-table__checkbox
```

### AlertPanel

```text
lp-alert-panel
lp-alert-panel__icon
lp-alert-panel__headline
lp-alert-panel__title
lp-alert-panel__summary
lp-alert-panel__details
lp-alert-panel__action
lp-alert-panel__footnote
```

### Link

```text
lp-link
lp-link--inline
lp-link--standalone
lp-link--disabled
lp-link__icon
lp-link__external-icon
lp-link__visually-hidden
```

### Avatar and AvatarGroup

```text
lp-avatar
lp-avatar--sm
lp-avatar--md
lp-avatar--lg
lp-avatar--xl
lp-avatar--circle
lp-avatar--square
lp-avatar--series1
lp-avatar--series2
lp-avatar--series3
lp-avatar--series4
lp-avatar--series5
lp-avatar--series6
lp-avatar--overflow
lp-avatar__image
lp-avatar__fallback
lp-avatar__status
lp-avatar__status--online
lp-avatar__status--away
lp-avatar__status--offline
lp-avatar-group
lp-avatar-group__item
```

### Skeleton

```text
lp-skeleton
lp-skeleton--text
lp-skeleton--circle
lp-skeleton--rect
lp-skeleton-paragraph
lp-skeleton-paragraph__last-line
```

### Spinner

```text
lp-spinner
lp-spinner--sm
lp-spinner--md
lp-spinner--lg
lp-spinner__svg
lp-spinner__track
lp-spinner__arc
lp-spinner__visually-hidden
```

### Message

```text
lp-message
lp-message--info
lp-message--success
lp-message--warning
lp-message--error
lp-message__icon
lp-message__content
lp-message__text
lp-message__title
lp-message__body
lp-message__actions
lp-message__close
```

### EmptyState

```text
lp-empty-state
lp-empty-state__illustration
lp-empty-state__message
lp-empty-state__action
```

### Radio and RadioGroup

```text
lp-radio
lp-radio--disabled
lp-radio__control
lp-radio__input
lp-radio__circle
lp-radio__circle--error
lp-radio__dot
lp-radio__label
lp-radio-group
lp-radio-group__label
lp-radio-group__options
lp-radio-group__options--horizontal
```

### Progress

```text
lp-progress
lp-progress--completed
lp-progress--pending
lp-progress--full-width
lp-progress__label
lp-progress__row
lp-progress__track
lp-progress__fill
lp-progress__value
lp-progress__clock
```

### Steps

```text
lp-steps
lp-steps__item
lp-steps__step-button
lp-steps__circle
lp-steps__circle--done
lp-steps__circle--current
lp-steps__circle--upcoming
lp-steps__dot
lp-steps__connector
lp-steps__connector--done
lp-steps__label
```

### Pagination

```text
lp-pagination
lp-pagination__label
lp-pagination__button
lp-pagination__page-input
lp-pagination__page-size
lp-pagination__page-size-trigger
lp-pagination__page-size-chevron
lp-pagination__page-size-panel
lp-pagination__page-size-option
lp-pagination__page-size-option--selected
```

---

## 8. Interactive component contracts

Interactive components require `lepidus.js` unless using React components that already manage behavior.

### Tabs

Use when switching between related panels on the same page.

Required behavior:

- `data-lp-tabs`
- `role="tablist"`
- Tab buttons use `role="tab"`
- Active tab uses `aria-selected="true"`
- Tabs point to panels using `aria-controls`
- Panels use `role="tabpanel"`
- Inactive panels are `hidden`
- Keyboard: arrows, Home, End, roving tabindex

Class inventory:

```text
lp-tabs
lp-tabs__tab
lp-tabs__tab--active
```

### Modal

Use for one short focused task: entering a URL, adding credentials, renaming, confirming destructive actions.

Class inventory:

```text
lp-modal
lp-modal__shell
lp-modal__shell--sm
lp-modal__shell--md
lp-modal__shell--lg
lp-modal__shell--inline
lp-modal__header
lp-modal__header--center
lp-modal__header--left
lp-modal__title
lp-modal__body
lp-modal__fields
lp-modal__field-label
lp-modal__footer
```

Required markup and behavior:

```html
<div class="lp-modal" id="credentials-modal" hidden>
  <div class="lp-modal__shell lp-modal__shell--lg" role="dialog" aria-modal="true" aria-labelledby="credentials-title">
    <div class="lp-modal__header lp-modal__header--center">
      <h2 class="lp-modal__title" id="credentials-title">Add Credentials</h2>
    </div>
    <div class="lp-modal__body">
      <div class="lp-modal__fields">
        <label class="lp-modal__field-label" for="cred-domain">Domain:</label>
        <div class="lp-input lp-input--full-width">
          <div class="lp-input__field">
            <input class="lp-input__input" id="cred-domain" placeholder="mycompany.local" data-lp-autofocus />
          </div>
        </div>
      </div>
    </div>
    <div class="lp-modal__footer">
      <button class="lp-button lp-button--secondary lp-button--md" data-lp-modal-close>Cancel</button>
      <button class="lp-button lp-button--primary lp-button--md" data-lp-modal-close>Save</button>
    </div>
  </div>
</div>
```

Open and close:

```html
<button class="lp-button lp-button--primary lp-button--md" data-lp-modal-open="credentials-modal">
  Add credentials
</button>
```

```js
Lepidus.openModal('credentials-modal')
Lepidus.closeModal()
```

Rules:

- Keep modals to one short task.
- Use `sm`, `md`, or `lg` shell sizes.
- Use `data-lp-autofocus` for initial focus.
- Close with Escape and backdrop unless data-loss risk exists.
- Do not use Modal for long multi-step flows; use a page.
- Use danger Button for destructive confirmation inside Modal.

### Accordion

Use for collapsible sections where the user scans titles and expands details.

Class inventory:

```text
lp-accordion
lp-accordion__item
lp-accordion__heading
lp-accordion__trigger
lp-accordion__title
lp-accordion__chevron
lp-accordion__panel
lp-accordion__panel--open
lp-accordion__panel-inner
lp-accordion__panel-content
```

Required behavior:

- `data-lp-accordion`
- Trigger has `aria-expanded`
- Trigger controls panel with `aria-controls`
- Panel id must match the trigger
- Use single or multiple mode based on workflow need

### Dropdown

Use Dropdown for a **short, fixed, scannable option set**. It is a system component with specific anatomy and behavior; do not approximate it.

#### Canonical modes

```text
single                 -> data-lp-dropdown="single"
multi                  -> data-lp-dropdown="multi"
multi + explicit apply -> data-lp-dropdown="multi" + footer in HTML
                          React: multiple + showButtons
disabled               -> modifier + native disabled attribute
```

#### Exact class inventory

Use these classes exactly:

```text
lp-dropdown
lp-dropdown__trigger
lp-dropdown__trigger--disabled
lp-dropdown__trigger--hidden
lp-dropdown__trigger-label
lp-dropdown__chevron
lp-dropdown__chevron--open
lp-dropdown__panel
lp-dropdown__header
lp-dropdown__header-label
lp-dropdown__list
lp-dropdown__option
lp-dropdown__checkbox
lp-dropdown__option-label
lp-dropdown__footer
```

Do not invent additional `lp-dropdown*` classes.

#### Required anatomy

Closed state:

```text
.lp-dropdown
└── button.lp-dropdown__trigger
    ├── span.lp-dropdown__trigger-label
    └── svg.lp-dropdown__chevron
```

Open state:

```text
.lp-dropdown
├── button.lp-dropdown__trigger.lp-dropdown__trigger--hidden
└── .lp-dropdown__panel
    ├── .lp-dropdown__header
    │   ├── .lp-dropdown__header-label
    │   └── .lp-dropdown__chevron.lp-dropdown__chevron--open
    ├── .lp-dropdown__list[role="listbox"]
    │   └── button.lp-dropdown__option[role="option"] × N
    └── .lp-dropdown__footer              # only when explicit Cancel/Apply is needed
```

**The open-panel header is part of the component. Do not omit it.**  
The trigger is visually hidden while open so the panel header occupies the same control position without layout jump.

#### Required trigger semantics

```html
<button
  class="lp-dropdown__trigger"
  type="button"
  aria-expanded="false"
  aria-haspopup="listbox"
>
```

Rules:

- Trigger must be a native `<button>`.
- `aria-expanded` must reflect open/closed state.
- Chevron is decorative and uses `aria-hidden="true"`.
- Disabled control uses both:
  - `lp-dropdown__trigger--disabled`
  - native `disabled`

#### Required list semantics

Single-select list:

```html
<div class="lp-dropdown__list" role="listbox" aria-label="Select data source">
```

Multi-select list:

```html
<div
  class="lp-dropdown__list"
  role="listbox"
  aria-multiselectable="true"
  aria-label="Select servers"
>
```

Each option is a native button with `role="option"`.

For plain-HTML multi-select, each option also carries `aria-checked="true|false"` and uses the built-in `lp-dropdown__checkbox`.

Do not substitute the standalone `lp-checkbox` component inside a Dropdown option unless the design system explicitly changes its markup.

#### Selection behavior

**Single select**

- Clicking an option commits immediately.
- Trigger label updates to the selected label.
- Panel closes after selection.
- No leading checkbox is rendered.

**Multi-select without footer**

- Clicking an option toggles that option.
- Changes commit immediately.
- Panel remains open so more values can be selected.
- Plain HTML updates `aria-checked`.
- The trigger summarizes selected labels; long text may ellipsize.

**Multi-select with Cancel / Apply**

Use when changing selection triggers an expensive operation such as a data refetch.

- Checkbox clicks edit a draft selection.
- **Apply** commits the draft and closes the panel.
- **Cancel** discards the draft.
- On every open, draft state must resync from the last committed selection.
- Footer buttons must use Lepidus Button classes.
- In plain HTML, footer commit/discard logic is application-owned.
- In React, use `multiple` + `showButtons`.

#### System JS contract

Plain HTML Dropdown requires `lepidus.js`.

Use:

```text
data-lp-dropdown="single"
data-lp-dropdown="multi"
```

`lepidus.js` owns documented open/close behavior, ARIA synchronization, outside-click dismissal, Escape dismissal, and focus return.

Every committed change fires:

```text
lp-dropdown-change
```

Do not hand-roll a second open/close controller on top of `lepidus.js`.

#### Keyboard contract

Follow the documented Dropdown keyboard behavior exactly:

```text
Tab / Shift+Tab -> moves through trigger/options/footer in document order
Enter / Space   -> native activation; open/close/select/toggle
Escape          -> closes open panel
Arrow keys      -> NOT a documented roving-focus behavior for this component
```

Do not add a custom combobox/roving-focus model unless the design system is intentionally being changed.

#### Form-submission rule

Dropdown options are buttons, not native form fields.

If a plain-HTML Dropdown value must be submitted with a form:

1. Listen for `lp-dropdown-change`.
2. Mirror the committed value into an application-owned hidden input.
3. Submit the hidden input with the form.

React projects use the component value/onChange contract.

#### Placement and clipping

- Dropdown panel is an overlay.
- Do not place it inside an ancestor that clips it with `overflow: hidden`.
- Use system stacking; do not invent a local z-index.
- If custom layout must reference overlay stacking, use `var(--z-dropdown)`.

#### Dropdown token contract

Never hardcode Dropdown colors/radius. The component consumes:

```text
--component-dropdown-bg
--component-dropdown-border
--component-dropdown-item-text
--component-dropdown-item-hover
--component-dropdown-radius
--component-dropdown-trigger-text
--component-dropdown-header-bg
--component-dropdown-option-text
--component-dropdown-checkbox-border
--component-dropdown-checkbox-fill
--component-dropdown-disabled-bg
--component-dropdown-disabled-text
--z-dropdown
```

Component classes should normally consume these internally. Application code should not restyle Dropdown internals.

#### Content rules

- Best for roughly 3–10 fixed options.
- Placeholder should name the choice, e.g. `Select servers`, not just `Select`.
- Keep placeholder short; it also becomes the open-panel header label.
- Keep option labels concise and parallel.
- Give React options stable unique `value` identifiers.

#### When not to use Dropdown

Do not use Dropdown for:

```text
free-text entry            -> Input / TextField
long searchable option set -> Filter pattern
async searchable picker    -> approved searchable pattern, not Dropdown
binary on/off setting      -> Toggle / Checkbox
rows-per-page              -> Pagination built-in control
```

#### Dropdown hard-fail conditions

Reject generated UI if any of these are true:

- A custom `<select>` or third-party select replaces Lepidus Dropdown.
- `data-lp-dropdown` is missing.
- The open panel is missing `lp-dropdown__header`.
- The documented trigger/panel/list hierarchy is changed without a system update.
- Multi-select is missing `aria-multiselectable`.
- Plain-HTML multi-select options are missing selection state.
- Disabled state uses only visual styling and omits native `disabled`.
- Local CSS hardcodes Dropdown colors, radii, internal padding, or z-index.
- App code reimplements open/close behavior already owned by `lepidus.js`.
- A long searchable list is forced into Dropdown.
- Arrow-key/combobox behavior is invented and presented as Lepidus behavior.

### Stepper

Use for numeric increment/decrement controls.

Class inventory:

```text
lp-stepper
lp-stepper--full-width
lp-stepper--disabled
lp-stepper__input
lp-stepper__controls
lp-stepper__control
```

Rules:

- Use a real `input type="number"`.
- Preserve min/max/step if present.
- Disabled state blocks both input and controls.

### Toast

Use for passive notification after an action.

JS API:

```js
Lepidus.toast({
  title: 'Alert acknowledged',
  message: 'LDSP-FS-02 alert closed.',
  variant: 'success',
  duration: 5000
})
```

Class inventory:

```text
lp-toast
lp-toast--success
lp-toast--warning
lp-toast--error
lp-toast__badge
lp-toast__content
lp-toast__title
lp-toast__body
lp-toast__close
```

Rules:

- Use success for successful completion.
- Use warning for caution that does not block.
- Use error for recoverable failure.
- Do not use Toast for critical blocking errors; use Message or Modal.

### Tooltip

Use to clarify controls, icons, or truncated content.

Required behavior:

```html
<button data-lp-tooltip="Export selected reports">Export</button>
```

Generated bubble class:

```text
lp-tooltip
```

Rules:

- Tooltip must not contain essential information that is unavailable elsewhere.
- Must appear on hover and focus.
- Must close on Escape.
- Must wire `aria-describedby`.

---

## 9. Components not yet converted to plain CSS

Use the React package or wait for plain-CSS conversion for these:

```text
ActionItem
Calendar
Charts
Filter
FolderTree
Scrollbar
SettingsPanel
Sidebar
TextField
Textarea
TimePicker
```

When generating plain HTML and a required component is not available as plain CSS:

1. Use the closest documented plain-CSS components if safe.
2. Do not invent `lp-*` classes.
3. Add a system gap note.
4. Suggest React usage if the project supports React.

System gap note format:

```markdown
### System gap note
Required pattern: [pattern name]
Closest available Lepidus component: [component]
Risk if we invent locally: [risk]
Recommended action: Add/update Storybook story and component manifest before production use.
```

---

## 10. Component decision rules

### Button

Use Button for triggering actions.

Use variants like this:

| Variant | Use for | Avoid |
|---|---|---|
| `primary` | One main action per view | Multiple competing primaries |
| `secondary` | Alternate/support action | Low-contrast surfaces where white is better |
| `danger` | Destructive confirmation | Normal errors/status display |
| `white` | Dark or brand-colored surface actions | Light page backgrounds |

Sizes:

| Size | Use for |
|---|---|
| `sm` | Dense UI, table rows, inline actions |
| `md` | Forms, dialogs, normal actions |
| `lg` | With-icon buttons or larger hero-like actions |

HTML:

```html
<button class="lp-button lp-button--primary lp-button--md">Save changes</button>
<button class="lp-button lp-button--secondary lp-button--md">Cancel</button>
<button class="lp-button lp-button--danger lp-button--md">Delete</button>
<button class="lp-button lp-button--white lp-button--md">White</button>
```

React:

```tsx
import { Button } from '@ramsarjal-404/react';

<Button variant="primary">Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="white">White</Button>
```

Do:

- Use native `<button>`.
- Use short verb-first labels.
- Use disabled attribute when disabled.
- Use `currentColor` for icons.

Do not:

- Use Button for navigation; use Link.
- Use Button for status; use Badge or Tag.
- Use icon-only Button without accessible name; prefer ActionItem in React.

### Link

Use Link for navigation.

```html
<a class="lp-link lp-link--inline" href="/reports">View reports</a>
```

Rules:

- Use anchors for navigation, not buttons.
- Use standalone link for a link that behaves like a secondary action.
- Use disabled link styling only when semantically unavoidable; prefer hiding unavailable navigation.

### Badge

Use Badge for compact read-only status.

```html
<span class="lp-badge lp-badge--success">
  <span class="lp-badge__dot"></span>
  Healthy
</span>
```

Variants:

```text
default, success, warning, error, neutral
```

Rules:

- Label must state the status.
- Dot is optional, never the only meaning.
- Use in tables, cards, summaries, and status rows.

### Tag

Use Tag for removable labels, filters, categories, or metadata chips.

```html
<span class="lp-tag lp-tag--neutral">
  <span class="lp-tag__label">File Server</span>
</span>
```

Rules:

- Use Badge for status.
- Use Tag for category or selected filter.
- Use `lp-tag__remove` only if removal is supported.

### Card

Use Card to group related content, summaries, charts, or settings.

```html
<section class="lp-card lp-card--elevated">
  <div class="lp-card__header">
    <h3 class="lp-card__title">Connection status</h3>
    <div class="lp-card__actions">
      <button class="lp-button lp-button--secondary lp-button--sm">Refresh</button>
    </div>
  </div>
  <div class="lp-card__body">
    Server health is calculated from the latest scan.
  </div>
</section>
```

Rules:

- Use title when the card needs a clear section label.
- Use footer for final actions or summaries.
- Do not overload cards with unrelated controls.

### Input

Use Input for labeled single-line fields.

```html
<div class="lp-input lp-input--full-width">
  <div class="lp-input__row lp-input__row--label-left">
    <label class="lp-input__label" for="license">License key</label>
    <div class="lp-input__field">
      <input class="lp-input__input" id="license" placeholder="XXXX-XXXX-XXXX" />
    </div>
  </div>
</div>
```

Error state:

```html
<div class="lp-input lp-input--full-width">
  <div class="lp-input__row lp-input__row--label-left">
    <label class="lp-input__label" for="site-url">Site URL</label>
    <div class="lp-input__field lp-input__field--error">
      <input class="lp-input__input" id="site-url" aria-invalid="true" aria-describedby="site-url-error" />
    </div>
  </div>
  <div class="lp-input__message lp-input__message--error lp-input__message--indent" id="site-url-error">
    Please enter a valid Site collection URL.
  </div>
</div>
```

Rules:

- Use real `<label for>` association.
- Use label-left for enterprise forms with aligned columns.
- Use label-top in narrow spaces.
- Use helper text for guidance.
- Use error text for validation; do not rely on border only.
- Do not use placeholder as label.

### Checkbox

Use Checkbox for independent yes/no or multi-select choices.

```html
<label class="lp-checkbox">
  <span class="lp-checkbox__control">
    <input class="lp-checkbox__input" type="checkbox" />
    <span class="lp-checkbox__box">
      <span class="lp-checkbox__check"></span>
    </span>
  </span>
  <span class="lp-checkbox__label">Include subfolders</span>
</label>
```

Rules:

- Use native checkbox.
- Use disabled state when unavailable.
- Use error modifier when the group fails validation.

### Radio

Use RadioGroup for mutually exclusive choices.

```html
<div class="lp-radio-group" role="radiogroup" aria-labelledby="schedule-label">
  <div class="lp-radio-group__label" id="schedule-label">Schedule</div>
  <div class="lp-radio-group__options">
    <label class="lp-radio">
      <span class="lp-radio__control">
        <input class="lp-radio__input" type="radio" name="schedule" value="daily" />
        <span class="lp-radio__circle"><span class="lp-radio__dot"></span></span>
      </span>
      <span class="lp-radio__label">Daily</span>
    </label>
  </div>
</div>
```

Rules:

- Use radio when only one option is allowed.
- Use checkbox for independent toggles.
- Use dropdown for compact selection from a known list.

### Toggle

Use Toggle for immediate on/off settings.

```html
<button class="lp-toggle lp-toggle--on" role="switch" aria-checked="true" type="button">
  <span class="lp-toggle__thumb"></span>
</button>
```

Rules:

- Must use `role="switch"`.
- Must update `aria-checked` when state changes.
- Use for settings, not one-time actions.

### Dropdown

Use Dropdown for a short fixed option set. **Start from these canonical structures; do not reduce the anatomy.**

#### Plain HTML — single select

```html
<div class="lp-dropdown" data-lp-dropdown="single">
  <button
    class="lp-dropdown__trigger"
    type="button"
    aria-expanded="false"
    aria-haspopup="listbox"
  >
    <span class="lp-dropdown__trigger-label">Select data source</span>
    <svg
      class="lp-dropdown__chevron"
      viewBox="0 0 12 6"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <path d="M1 1l5 4 5-4" />
    </svg>
  </button>

  <div class="lp-dropdown__panel" hidden>
    <div class="lp-dropdown__header">
      <span class="lp-dropdown__header-label">Select data source</span>
      <svg
        class="lp-dropdown__chevron lp-dropdown__chevron--open"
        viewBox="0 0 12 6"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M1 1l5 4 5-4" />
      </svg>
    </div>

    <div
      class="lp-dropdown__list"
      role="listbox"
      aria-label="Select data source"
    >
      <button class="lp-dropdown__option" type="button" role="option">
        <span class="lp-dropdown__option-label">Active Directory</span>
      </button>
      <button class="lp-dropdown__option" type="button" role="option">
        <span class="lp-dropdown__option-label">Exchange Server</span>
      </button>
      <button class="lp-dropdown__option" type="button" role="option">
        <span class="lp-dropdown__option-label">SharePoint</span>
      </button>
    </div>
  </div>
</div>
```

Expected behavior:

```text
trigger click -> opens panel
open state -> trigger receives/uses hidden state managed by system JS
panel header occupies trigger position
option click -> commits label + closes
outside click -> closes
Escape -> closes
focus returns appropriately through system JS
```

#### Plain HTML — multi-select

```html
<div class="lp-dropdown" data-lp-dropdown="multi">
  <button
    class="lp-dropdown__trigger"
    type="button"
    aria-expanded="false"
    aria-haspopup="listbox"
  >
    <span class="lp-dropdown__trigger-label">Select servers</span>
    <svg
      class="lp-dropdown__chevron"
      viewBox="0 0 12 6"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <path d="M1 1l5 4 5-4" />
    </svg>
  </button>

  <div class="lp-dropdown__panel" hidden>
    <div class="lp-dropdown__header">
      <span class="lp-dropdown__header-label">Select servers</span>
      <svg
        class="lp-dropdown__chevron lp-dropdown__chevron--open"
        viewBox="0 0 12 6"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M1 1l5 4 5-4" />
      </svg>
    </div>

    <div
      class="lp-dropdown__list"
      role="listbox"
      aria-multiselectable="true"
      aria-label="Select servers"
    >
      <button
        class="lp-dropdown__option"
        type="button"
        role="option"
        aria-checked="true"
      >
        <span class="lp-dropdown__checkbox">
          <svg
            viewBox="0 0 11 11"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M1.5 6 4.3 8.8 9.5 2" />
          </svg>
        </span>
        <span class="lp-dropdown__option-label">LDSP-FS-01</span>
      </button>

      <button
        class="lp-dropdown__option"
        type="button"
        role="option"
        aria-checked="false"
      >
        <span class="lp-dropdown__checkbox">
          <svg
            style="visibility:hidden"
            viewBox="0 0 11 11"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M1.5 6 4.3 8.8 9.5 2" />
          </svg>
        </span>
        <span class="lp-dropdown__option-label">LDSP-FS-02</span>
      </button>
    </div>
  </div>
</div>
```

For instant multi-select, each toggle commits immediately and the panel stays open.

#### Plain HTML — multi-select with Cancel / Apply

Use the same multi-select structure and add this **inside `lp-dropdown__panel`, after the list**:

```html
<div class="lp-dropdown__footer">
  <button class="lp-button lp-button--secondary lp-button--sm" type="button">
    Cancel
  </button>
  <button class="lp-button lp-button--primary lp-button--sm" type="button">
    Apply
  </button>
</div>
```

In plain HTML, application code owns the draft/commit logic, but it must not replace the Dropdown’s system open/close controller.

#### Plain HTML — disabled

```html
<div class="lp-dropdown" data-lp-dropdown="single">
  <button
    class="lp-dropdown__trigger lp-dropdown__trigger--disabled"
    type="button"
    disabled
    aria-expanded="false"
    aria-haspopup="listbox"
  >
    <span class="lp-dropdown__trigger-label">Select data source</span>
    <svg
      class="lp-dropdown__chevron"
      viewBox="0 0 12 6"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <path d="M1 1l5 4 5-4" />
    </svg>
  </button>

  <div class="lp-dropdown__panel" hidden>
    <div class="lp-dropdown__list" role="listbox" aria-label="Select data source">
      <button class="lp-dropdown__option" type="button" role="option">
        <span class="lp-dropdown__option-label">Active Directory</span>
      </button>
    </div>
  </div>
</div>
```

#### React — single select

```tsx
import { Dropdown } from '@ramsarjal-404/react';

<Dropdown
  placeholder="Select data source"
  options={[
    { value: 'ad', label: 'Active Directory' },
    { value: 'exchange', label: 'Exchange Server' },
    { value: 'sharepoint', label: 'SharePoint' },
  ]}
  onChange={(value) => console.log(value)}
/>
```

#### React — multi-select

```tsx
import { Dropdown } from '@ramsarjal-404/react';

<Dropdown
  multiple
  placeholder="Select servers"
  defaultValue={['fs-01']}
  options={[
    { value: 'fs-01', label: 'LDSP-FS-01' },
    { value: 'fs-02', label: 'LDSP-FS-02' },
    { value: 'fs-03', label: 'LDSP-FS-03' },
  ]}
  onChange={(values) => console.log(values)}
/>
```

#### React — draft then Apply

```tsx
import { Dropdown } from '@ramsarjal-404/react';

<Dropdown
  multiple
  showButtons
  placeholder="Select servers"
  defaultValue={['fs-01', 'fs-02']}
  options={[
    { value: 'fs-01', label: 'LDSP-FS-01' },
    { value: 'fs-02', label: 'LDSP-FS-02' },
    { value: 'fs-03', label: 'LDSP-FS-03' },
  ]}
  onApply={(values) => refetchTable(values)}
  onCancel={() => console.log('draft discarded')}
/>
```

#### React API rules

```text
value          string | string[]   controlled selection
defaultValue   string | string[]   initial uncontrolled selection
multiple       boolean             enables multi-select
showButtons    boolean             Cancel/Apply draft mode; meaningful with multiple
disabled       boolean             whole-control disabled state
onChange       callback            immediate commit, or commit on Apply in showButtons mode
onApply        callback            fires when Apply commits draft
onCancel       callback            fires when draft is discarded
options        required            stable unique value + label per option
placeholder    string              names the choice and open-panel header
```

#### Dropdown implementation checklist

Before accepting generated Dropdown code, verify:

- [ ] Uses `lp-dropdown`.
- [ ] Uses `data-lp-dropdown="single"` or `"multi"` in plain HTML.
- [ ] Trigger is a native button.
- [ ] Trigger has `aria-expanded` and `aria-haspopup="listbox"`.
- [ ] Panel starts `hidden`.
- [ ] Open-panel header exists.
- [ ] List has `role="listbox"`.
- [ ] Multi list has `aria-multiselectable="true"`.
- [ ] Options are native buttons with `role="option"`.
- [ ] Plain-HTML multi options expose `aria-checked`.
- [ ] Built-in Dropdown checkbox anatomy is used for multi-select.
- [ ] Footer uses Lepidus Buttons when present.
- [ ] Disabled trigger uses modifier **and** native `disabled`.
- [ ] `lepidus.js` is included for plain HTML.
- [ ] No custom Dropdown colors/radius/padding.
- [ ] No ancestor clips the panel with `overflow: hidden`.
- [ ] No invented arrow-key or combobox behavior.
- [ ] Short fixed option set only; searchable/long lists use Filter.

Rules:

- Do not use native `<select>` as a substitute for Lepidus Dropdown.
- Do not simplify away the header because it is visually/behaviorally part of the component.
- Do not add local Dropdown CSS to “match the screenshot.”
- Do not rebuild its checkbox with `lp-checkbox`.
- Do not use Dropdown for long/searchable option sets.

### Table

Use Table for structured tabular data with columns and rows.

```html
<div class="lp-table">
  <table class="lp-table__table">
    <caption class="visually-hidden">Monitored servers</caption>
    <thead>
      <tr>
        <th class="lp-table__th" scope="col">
          <div class="lp-table__header-inner">
            <span class="lp-table__header-label">Server</span>
          </div>
        </th>
        <th class="lp-table__th" scope="col">
          <div class="lp-table__header-inner">
            <span class="lp-table__header-label">IP Address</span>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="lp-table__td">
          <div class="lp-table__cell-inner"><span class="lp-table__cell-text">LDSP-FS-01</span></div>
        </td>
        <td class="lp-table__td">
          <div class="lp-table__cell-inner"><span class="lp-table__cell-text">192.168.30.180</span></div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

Rules:

- Provide stable `rowKey` in React.
- Keep `value` alongside custom `render` so sort/filter still works.
- Use Badge inside status columns.
- Use Pagination for long datasets.
- Use EmptyState for no data; use table empty cell only when filters return no rows.
- Avoid placing a second interactive element inside the selection checkbox column.

### Pagination

Use Pagination for long tabular or list data.

Rules:

- Pair with Table or data lists.
- Use page input for direct navigation when needed.
- Use page-size popover instead of rebuilding a dropdown.

### Progress

Use Progress for completion state.

```html
<div class="lp-progress lp-progress--full-width">
  <div class="lp-progress__label">Restore in Progress</div>
  <div class="lp-progress__row">
    <div class="lp-progress__track" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">
      <div class="lp-progress__fill" style="width:45%"></div>
    </div>
    <span class="lp-progress__value">45%</span>
  </div>
</div>
```

Rules:

- Use `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` when determinate.
- Use pending state for indeterminate or waiting state.
- Use completed state when done.

### Steps

Use Steps for clear process progress.

Rules:

- Use for multi-stage setup, migration, scan, onboarding, or wizard progress.
- Use done/current/upcoming states.
- Do not use Steps for simple tab switching; use Tabs.

### Breadcrumb

Use Breadcrumb for hierarchical navigation.

```html
<nav class="lp-breadcrumb" aria-label="Breadcrumb">
  <ol class="lp-breadcrumb__list">
    <li class="lp-breadcrumb__item"><a class="lp-breadcrumb__link" href="/auditor">Auditor</a></li>
    <li class="lp-breadcrumb__separator" aria-hidden="true">/</li>
    <li class="lp-breadcrumb__item"><span class="lp-breadcrumb__current" aria-current="page">Reports</span></li>
  </ol>
</nav>
```

Rules:

- Current page must use `aria-current="page"`.
- Do not use breadcrumbs as primary navigation.

### EmptyState

Use EmptyState when no content exists or an action has no result.

```html
<div class="lp-empty-state">
  <div class="lp-empty-state__illustration" aria-hidden="true"></div>
  <p class="lp-empty-state__message">No reports found.</p>
  <div class="lp-empty-state__action">
    <button class="lp-button lp-button--primary lp-button--md">Create report</button>
  </div>
</div>
```

Rules:

- Message carries the meaning; illustration is decorative.
- Use one clear next action when there is a useful recovery.
- Do not show empty table rows if the whole screen has no data.

### Skeleton

Use Skeleton while content is loading and layout shape is known.

```html
<div class="lp-skeleton lp-skeleton--text"></div>
<div class="lp-skeleton lp-skeleton--rect"></div>
<div class="lp-skeleton lp-skeleton--circle"></div>
```

Rules:

- Use skeleton for layout-preserving loading.
- Use spinner for short indeterminate waiting.
- Avoid endless skeletons without feedback.

### Spinner

Use Spinner for short waiting states.

Rules:

- Include visually hidden text.
- Do not use spinner where progress percentage is available; use Progress.
- Do not make critical workflow wait states silent.

### Message

Use Message for visible inline/block feedback.

```html
<div class="lp-message lp-message--error" role="alert">
  <div class="lp-message__content">
    <div class="lp-message__title">Connection failed</div>
    <div class="lp-message__body">Check credentials and try again.</div>
  </div>
</div>
```

Rules:

- Use Message for persistent feedback users must read.
- Use Toast for passive confirmation.
- Use Modal for focused decision/input.

### AlertPanel

Use AlertPanel for prominent alert summaries, especially security/audit events.

Rules:

- Use headline for urgency.
- Use title for alert name.
- Use details for evidence.
- Use action for next step.
- Avoid using it for normal informational text.

### Avatar

Use Avatar for people or identity chips.

Rules:

- Use `role="img"` and `aria-label` for accessible name.
- Initials fallback is decorative if contrast is insufficient.
- Use status dot only with label/announcement.

### Tabs

Use Tabs for peer sections within the same context.

Rules:

- Tabs should not navigate to unrelated pages.
- Keep tab labels short.
- Provide keyboard support through `lepidus.js`.

### Tooltip

Use Tooltip for supplementary hints.

Rules:

- Do not put required information only inside tooltip.
- Trigger by hover and focus.
- Escape closes it.

### Charts

Use chart components in React for dashboards and analytics:

```tsx
import { BarChart, BubbleChart, ColumnChart, DonutChart, GaugeChart, LineChart } from '@ramsarjal-404/react';
```

Rules:

- Use semantic titles.
- Use legends.
- Use accessible labels or summaries.
- Never communicate critical state by color alone.
- Use system chart series tokens.

---

## 11. Page archetypes and recommended compositions

### A. Report library / data table screen

Use for Auditor reports, File Server reports, audit logs, user activity, scan results.

Recommended composition:

```text
Sidebar / module navigation
FolderTree or left navigation panel
Breadcrumb
Page title
Toolbar with Search, Import, Export, Add
Table
Pagination
Toast for action success
Modal for create/edit
Message for blocking errors
EmptyState when no data exists
```

Primary components:

- Sidebar
- FolderTree
- Breadcrumb
- Button
- TextField/Input
- Dropdown/Filter
- Table
- Badge
- Pagination
- Modal
- Toast
- EmptyState

Rules:

- Put primary action on the right side of toolbar.
- Use only one primary button: e.g. “Add Report”.
- Use secondary buttons for Import/Export.
- Use Badge for status columns.
- Use Pagination for long lists.
- Use table empty cell for filtered results; EmptyState for no data.

### B. Credentials / setup form

Use for adding credentials, connector setup, server setup, tenant setup.

Recommended composition:

```text
Card or Modal
Input rows with label-left alignment
Dropdown for known source type
Checkbox for optional scope
Button footer: Cancel + Save
Message for validation summary
```

Rules:

- Use label-left for desktop enterprise forms.
- Use label-top on mobile/narrow containers.
- Use helper text for risky inputs.
- Use field-level error text.
- Primary button label must be specific: “Save credentials”, “Connect server”.

### C. Alert detail / incident review

Use for security event detail, risk alert, unusual activity.

Recommended composition:

```text
Breadcrumb
AlertPanel
Card with evidence details
Table for affected objects
Badge/Tag for severity and source
Button primary for recommended action
Button secondary for export/share
```

Rules:

- AlertPanel summarizes urgency.
- Evidence should be structured and scannable.
- Use Message for warnings or blocking remediation steps.
- Use Button danger only for destructive irreversible actions.

### D. Dashboard / analytics screen

Use for overview pages, health monitoring, activity analytics.

Recommended composition:

```text
Sidebar
Page title + time filter
ChartCard / cards
Donut/Gauge/Line/Bar/Column charts
Table for details
Badge for health/status
Skeleton while loading
```

Rules:

- Use chart components in React where available.
- Provide text summary for important metrics.
- Do not rely only on chart colors.
- Use consistent card spacing and headings.

### E. Empty or first-run screen

Use for no reports, no scans, no exported files, no connected servers.

Recommended composition:

```text
EmptyState illustration
Short message
Optional helper text
Primary action
Optional secondary documentation link
```

Rules:

- State what is empty.
- Explain what happens next.
- Provide one clear action.
- Do not blame the user.

Example copy:

```text
No reports found.
Create a report or adjust your filters to see results.
```

### F. Settings screen

Use for system preferences, notification settings, scan options.

Recommended composition:

```text
SettingsPanel or Sidebar
Cards by setting group
Input / Dropdown / Toggle / Checkbox / Radio
Footer actions
Toast after save
Message for blocking errors
```

Rules:

- Group settings by task, not by backend ownership.
- Use Toggle only for immediate on/off.
- Use Radio when one option must be selected.
- Use Dropdown for short fixed lists.

---

## 12. Layout rules for custom screen composition

Lepidus gives components, but a product screen may still need layout CSS. Layout CSS is allowed if it follows tokens.

### Allowed custom layout CSS

```css
.product-shell {
  min-height: 100vh;
  background: var(--color-background-page);
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  padding: var(--space-9);
}

.content-grid {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: var(--space-9);
}
```

### Forbidden custom layout CSS

```css
.my-blue-button {
  background: #1c4599;
  border-radius: 50px;
  color: white;
  padding: 12px 20px;
}
```

Reason: this recreates `lp-button` manually and will drift from tokens, themes, hover, focus, and disabled states.

### Layout principles

- Use components for UI, custom CSS only for page layout.
- Use token spacing.
- Use token surfaces.
- Use token text colors.
- Use responsive grids, not fixed-width hacks.
- Prefer CSS logical properties for RTL safety.
- Never style a component internals unless the design-system owner approved a new variant.

---

## 13. AI generation workflow

When an AI receives a UI request, follow this process.

### Step 1 — Identify screen intent

Classify the screen:

```text
report/data table
form/setup
alert/incident
settings
analytics/dashboard
empty state
navigation shell
modal/dialog
```

### Step 2 — Select components

Map every need to an existing Lepidus component.

Examples:

```text
main action -> Button primary
support action -> Button secondary
destructive action -> Button danger + Modal confirmation
read-only status -> Badge or Tag
data rows -> Table
long data rows -> Table + Pagination
no data -> EmptyState
loading known layout -> Skeleton
loading unknown/short -> Spinner
inline error -> Message or Input error
passive success -> Toast
short options -> Dropdown
long/searchable options -> Filter pattern
on/off setting -> Toggle
multi-independent selection -> Checkbox
single choice -> Radio
hierarchy -> FolderTree or Breadcrumb
same-context views -> Tabs
multi-step progress -> Steps
```

### Step 3 — Generate markup

Generate:

- Valid HTML.
- Documented `lp-` classes.
- Tokens for layout CSS.
- Required `lepidus.css` and `lepidus.js` includes.
- Correct accessibility attributes.
- Meaningful content and labels.

### Step 4 — Add interaction only through system hooks

Use:

```text
data-lp-tabs
data-lp-modal-open
data-lp-modal-close
data-lp-accordion
data-lp-dropdown
data-lp-stepper
data-lp-tooltip
Lepidus.toast(...)
Lepidus.openModal(id)
Lepidus.closeModal()
```

### Step 5 — Run self-check

Before final output, the AI must answer:

```text
1. Did I use an existing Lepidus component for every component-level UI need?
2. Did I avoid raw hex values in CSS/HTML?
3. Did I avoid hardcoded component spacing, radius, font-size, and colors?
4. Did I use data-theme and token variables?
5. Did I include light/dark/hc compatibility?
6. Did I include correct ARIA and semantic elements?
7. Did I avoid inventing lp-* classes?
8. Did I use lepidus.js hooks for interactions?
9. Did I provide empty/loading/error/disabled states where relevant?
10. Did I keep enterprise copy concise and action-oriented?
11. If I used Dropdown, did I start from the canonical documented anatomy rather than a visual approximation?
12. If I used Dropdown, did I include the open-panel header, correct mode, ARIA state, and `lepidus.js` hook?
13. If I used multi-select Dropdown, did I use the built-in Dropdown checkbox anatomy and correct commit model?
14. Did I avoid native/third-party substitutes for any Lepidus component that already exists?
```

---

## 14. AI output format

When asked to generate a screen, output in this order:

**Before emitting code:** for every component used, verify the exact documented component anatomy. For Dropdown in particular, the canonical Code/Specifications/Accessibility contract in this file is mandatory.

```markdown
## Design-system interpretation
- Screen type:
- Components used:
- States covered:
- Accessibility notes:
- Theme notes:

## HTML
```html
...
```

## Optional layout CSS
```css
/* token-only custom layout CSS */
...
```

## Interaction notes
- Uses lepidus.js for: ...

## QA checklist
- [ ] Light theme checked
- [ ] Dark theme checked
- [ ] High contrast checked
- [ ] Keyboard path checked
- [ ] No raw hex values
- [ ] No invented lp-* classes
- [ ] Empty/loading/error/disabled states checked
```

---

## 15. Production review gates

A UI PR using Lepidus should fail review if any of these happen:

### Hard fail

- Raw hex color in component UI.
- Custom button/input/table/modal CSS that recreates a Lepidus component.
- Invented `lp-*` class.
- Missing `data-theme` support.
- Broken focus visibility.
- Modal without focus trap/restore.
- Input error without visible error message.
- Status shown by color only.
- Table without semantic table structure.
- Dropdown without listbox semantics.
- Dropdown implemented with a native `<select>`, third-party select, or custom imitation instead of documented `lp-dropdown`.
- Dropdown missing `data-lp-dropdown`, open-panel header anatomy, or required system JS.
- Dropdown multi-select missing `aria-multiselectable` / documented selection state.
- Dropdown disabled state missing the native `disabled` attribute.
- Local CSS overrides Dropdown internal color, radius, padding, or overlay stacking.

### Review command examples

```bash
# Find raw hex values in common UI files.
grep -rnE '#[0-9a-fA-F]{3,8}\b' src/ --include='*.html' --include='*.css' --include='*.tsx'
```

```bash
# Find possible invented lp-* classes manually.
grep -rhoE 'lp-[a-zA-Z0-9_-]+' src/ | sort -u
```

Compare all results against this file, `llms.txt`, and `component-manifest.json`.

---

## 16. QA verification model

Storybook is the visual UI contract. QA still owns product quality.

### QA should compare against Storybook for

- Component visual style.
- Component spacing.
- Default, hover, focus, disabled, loading, error states.
- Light, dark, and high-contrast themes.
- Expected keyboard behavior.
- Expected ARIA behavior.
- Correct use of documented classes and variants.

### QA still owns product verification for

- Real data correctness.
- Permissions and roles.
- API error handling.
- Business workflow.
- Browser/device behavior.
- Regression scope.
- Security-sensitive flows.
- Performance and loading behavior.

### Defect classification

```text
If Storybook is correct and product differs -> implementation bug.
If Storybook lacks the needed state -> design-system gap.
If Storybook state is wrong -> system bug.
If product data/permission/API is wrong -> product bug.
```

---

## 17. Lepide enterprise copy rules

Use clear, operational UI copy.

### Voice

- Direct.
- Calm.
- Specific.
- Useful.
- Non-marketing inside product UI.

### Buttons

Use verbs:

```text
Save changes
Add credentials
Run scan
Export report
Apply filters
Acknowledge alert
View details
```

### Empty states

Structure:

```text
[What is empty]
[Why / what happens next]
[Action]
```

Examples:

```text
No reports found.
Create a report or adjust your filters to see results.
```

```text
No activity yet.
Once activity is detected, events will appear here.
```

### Error messages

Structure:

```text
[What failed]. [How to fix it].
```

Examples:

```text
Connection failed. Check the credentials and try again.
```

```text
Invalid Site collection URL. Enter a complete URL and try again.
```

### Success messages

Examples:

```text
Credentials saved.
Report exported.
Alert acknowledged.
Scan started.
```

---

## 18. Example: on-system report toolbar

```html
<div class="report-toolbar">
  <button class="lp-button lp-button--primary lp-button--md">
    Run scan
  </button>
  <button class="lp-button lp-button--secondary lp-button--md">
    Export report
  </button>
  <span class="lp-badge lp-badge--success">
    <span class="lp-badge__dot"></span>
    14 servers healthy
  </span>
</div>
```

Token-only layout CSS:

```css
.report-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-6) var(--space-9);
  background: var(--color-background-surface);
  border-bottom: 1px solid var(--color-border-default);
}
```

---

## 19. Example: action success toast

```html
<button
  class="lp-button lp-button--primary lp-button--md"
  onclick="Lepidus.toast({ title: 'Alert acknowledged', message: 'LDSP-FS-02 alert closed.', variant: 'success' })">
  Acknowledge alert
</button>
```

Rules satisfied:

- Uses documented Button classes.
- Uses `Lepidus.toast` instead of custom notification UI.
- Uses short, specific success copy.
- Avoids custom color and spacing.

---

## 20. Example: safe system gap note

When a user asks for a complex searchable async combobox and only Dropdown is available:

```markdown
### System gap note
Required pattern: Searchable async combobox
Closest available Lepidus component: Dropdown / Filter
Risk if we invent locally: keyboard behavior, async state, ARIA, and theme tokens may drift from Lepidus.
Recommended action: Add a Combobox component or searchable Dropdown variant to Storybook and component-manifest before production use.
Temporary safe approach: Use Filter pattern if available in React, or use Input + Table filtering with documented Input and Table components.
```

---

## 21. Final AI instruction block

Paste this at the top of prompts when using this MD file:

```markdown
You are generating UI with the Lepidus Design System.
Follow `lepidus-design-ai-contract.md` exactly.
Default to plain HTML using documented `lp-` classes only.
Use React only if I explicitly ask for React.
Never hardcode colors, spacing, radii, or font sizes.
Use `var(--component-*)` first, then semantic tokens.
Set `data-theme="light" | "dark" | "hc"` on `<html>`.
Use `lepidus.js` for documented interactions.
Preserve accessibility: semantic HTML, keyboard behavior, ARIA, focus-visible, and WCAG 2.1 AA patterns.
Before final output, self-check for invented classes, raw hex values, missing states, and theme/accessibility drift.
```

---

## 22. Summary for AI

If you remember only one thing:

> Lepidus UI is not generated by taste. It is assembled from documented `lp-` components, token variables, Storybook states, and accessibility contracts. Build with the system. Do not improvise the system.

