# Combobox

Purpose: APG-style editable combobox with listbox suggestions and live-region result announcements.

## Usage

```html
<app-combobox
  label="Search topics"
  [options]="topicOptions"
  (optionSelected)="onSelected($event)"
/>
```

Pre-populate with an initial value (e.g. from a URL query parameter):

```html
<app-combobox label="Search" [options]="items" [initialValue]="queryParam" (optionSelected)="navigate($event)" />
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the combobox input |
| `ArrowDown` / `ArrowUp` | Opens the listbox and moves the active option |
| `Enter` | Selects the active option |
| `Escape` | Closes the listbox |

## ARIA

- `role="combobox"`
- `aria-expanded`
- `aria-controls`
- `aria-activedescendant`
- `aria-autocomplete="list"`
- `role="listbox"` / `role="option"`
- `role="status"` live region (polite) — announces result count as the user types

## Live-region announcements

A `role="status"` / `aria-live="polite"` region is rendered inside the component.
It is updated on every `input` event with one of:

- `"N results available."` — when matches are found
- `"No results found."` — when no options match the current query

The live region uses `aria-atomic="true"` so the full sentence is read each time.
Focus is never moved to the live region (polite, non-interrupting announcements only).

## Inputs

| Input | Type | Description |
| --- | --- | --- |
| `label` | `string` | Visible label for the combobox input |
| `hint` | `string \| null` | Optional hint text linked via `aria-describedby` |
| `options` | `ComboboxOption[]` | Full set of selectable options |
| `initialValue` | `string` | Pre-populates the input (e.g. from a route query param) |

## Outputs

| Output | Payload | Description |
| --- | --- | --- |
| `optionSelected` | `ComboboxOption` | Emits when the user selects an option via click or keyboard |
