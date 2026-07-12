# Accordion

Purpose: disclosure accordion built with native buttons and region associations.

## Usage

```html
<app-accordion [items]="faqItems" />
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to each accordion trigger |
| `Enter` / `Space` | Expands or collapses the focused section |

## ARIA

- Native button semantics
- `aria-expanded`
- `aria-controls`
- `role="region"` on panels with `aria-labelledby`

## Known limitations

- Arrow-key roving between headers is not implemented because the requirement only called for Enter/Space toggling.
