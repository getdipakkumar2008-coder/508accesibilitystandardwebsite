# Dialog

Purpose: modal dialog with focus trapping, Escape close support, focus restoration, and inert background handling.

## Usage

```html
<button #trigger type="button" (click)="confirmDialog.openFrom(trigger)">Open dialog</button>
<app-dialog #confirmDialog title="Confirm action">
  <p>Dialog content</p>
</app-dialog>
```

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus to the next focusable element in the dialog |
| `Shift+Tab` | Moves focus to the previous focusable element in the dialog |
| `Escape` | Closes the dialog and restores focus to the trigger |

## ARIA

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby`

## Known limitations

- Consumers open the dialog imperatively with `openFrom(...)`; a higher-level state wrapper may be useful if the app later standardizes modal orchestration.
