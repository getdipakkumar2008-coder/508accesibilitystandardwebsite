# Tabs

Purpose: APG-compliant tabs with auto-activation and roving tabindex.

## Usage

```html
<app-tabs [tabs]="pageTabs" />
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus into the active tab |
| `ArrowRight` / `ArrowLeft` | Moves focus and activates the adjacent tab |
| `Home` / `End` | Moves focus and activates the first or last tab |

## ARIA

- `role="tablist"`
- `role="tab"`
- `role="tabpanel"`
- `aria-selected`, `aria-controls`, `aria-labelledby`

## Known limitations

- Panel content is string-based in this first phase; if richer projected templates are needed later, the keyboard model can stay the same while the content API expands.
