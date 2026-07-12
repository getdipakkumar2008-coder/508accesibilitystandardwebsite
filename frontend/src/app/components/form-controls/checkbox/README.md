# Checkbox

Purpose: accessible single checkbox with label, hint, and error wiring.

## Usage

```html
<app-checkbox label="I agree to the terms" [required]="true" />
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the checkbox |
| `Space` | Toggles the checkbox |

## ARIA

- Native checkbox semantics
- `aria-required`, `aria-invalid`, and `aria-describedby`

## Known limitations

- This foundational checkbox does not manage form-control state by itself; parent forms own the checked value.
