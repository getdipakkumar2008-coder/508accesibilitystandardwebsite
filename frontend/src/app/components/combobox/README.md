# Combobox

Purpose: APG-style editable combobox with listbox suggestions.

## Usage

```html
<app-combobox label="Search topics" [options]="topicOptions" />
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

## Known limitations

- This first-phase component is single-select and does not announce result counts with a live region yet.
