# Navigation

Purpose: primary site navigation with responsive disclosure behavior and route-aware current-page state.

## Usage

```html
<app-navigation />
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the menu button and each navigation link |
| `Enter` / `Space` on Menu | Opens or closes the mobile navigation panel |
| `Enter` on a link | Navigates to the selected page |

## ARIA

- `<nav aria-label="Primary navigation">`
- Menu button `aria-expanded` + `aria-controls`
- `aria-current="page"` on the active route

## Known limitations

- The current implementation uses a simple disclosure pattern rather than a true menubar, which is appropriate for site navigation but does not include arrow-key roving.
