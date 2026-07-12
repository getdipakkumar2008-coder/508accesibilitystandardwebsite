# Select

Purpose: accessible wrapper around a native `<select>` element.

## Usage

```html
<app-select label="Topic" [options]="topicOptions" [required]="true" />
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the select |
| Arrow keys | Navigate native select options |
| `Enter` / `Space` | Opens the select popup where supported by the browser |

## ARIA

- Native `<select>` semantics
- `aria-required`, `aria-invalid`, and `aria-describedby`

## Known limitations

- Browser-native select popups vary slightly between platforms; the component intentionally preserves those native behaviors.
