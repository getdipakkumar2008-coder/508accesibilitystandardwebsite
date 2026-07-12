# TextInput

Purpose: labeled single-line text input with built-in hint, error, and required-state accessibility wiring.

## Usage

```html
<app-text-input label="Email address" type="email" [required]="true" />
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the input |
| Standard text-editing keys | Operate natively inside the input |

## ARIA

- Native `<input>` semantics
- `aria-required`, `aria-invalid`, and `aria-describedby`

## Known limitations

- This foundational component is intentionally presentational; consumers are responsible for synchronizing value changes with Angular forms.
