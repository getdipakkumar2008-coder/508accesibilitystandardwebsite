# Link

Purpose: provides an underlined navigation link that stays visually distinct from action buttons.

## Usage

```html
<app-link href="/contact">Contact us</app-link>
<app-link href="/home" ariaCurrent="page">Home</app-link>
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the link |
| `Enter` | Activates the link when not disabled |

## ARIA

- Native anchor semantics
- `aria-current` for current-location state
- `aria-disabled="true"` when activation is suppressed

## Known limitations

- Disabled links intentionally remove themselves from the tab order; if a temporarily unavailable action must stay focusable, use the button component instead.
