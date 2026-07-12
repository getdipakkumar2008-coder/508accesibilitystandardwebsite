# Button

Purpose: wraps a native `<button>` with USWDS styling and a loading-safe accessibility contract.

## Usage

```html
<app-button variant="primary">Save</app-button>
<app-button variant="danger" [loading]="true">Delete</app-button>
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the button |
| `Enter` / `Space` | Activates the button when not disabled or loading |

## ARIA

- Native button semantics
- `aria-disabled="true"` during disabled/loading states
- `aria-busy="true"` during loading

## Known limitations

- Loading text is visual-only beyond the built-in screen-reader label; consumers should pair long-running actions with a page-level status message when needed.
