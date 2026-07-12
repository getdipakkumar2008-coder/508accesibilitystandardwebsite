# Fieldset

Purpose: groups related controls under a semantic `<fieldset>` and `<legend>`.

## Usage

```html
<app-fieldset legend="Contact preferences" [required]="true">
  <!-- grouped controls -->
</app-fieldset>
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus through the grouped controls in DOM order |

## ARIA

- Native `<fieldset>` and `<legend>` semantics
- `aria-describedby` for shared hint/error text

## Known limitations

- The component provides group semantics only; child control validation and state remain the responsibility of the consumer.
