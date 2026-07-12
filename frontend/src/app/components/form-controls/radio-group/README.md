# RadioGroup

Purpose: groups related native radio buttons under a semantic legend.

## Usage

```html
<app-radio-group legend="Preferred contact method" [options]="contactOptions" [required]="true" />
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus into the selected radio in the group |
| Arrow keys | Move between radio options using the browser's native radio behavior |
| `Space` | Selects the focused radio |

## ARIA

- Native radio-group semantics through `<fieldset>` and radio inputs
- `aria-required`, `aria-invalid`, and `aria-describedby`

## Known limitations

- Selection state is input-driven; consumers are responsible for syncing the selected value with application state.
