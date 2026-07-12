# Form controls

Purpose: shared accessible form primitives for text entry, selection, and grouped choices.

## Included components

- `app-text-input`
- `app-select`
- `app-checkbox`
- `app-radio-group`
- `app-fieldset`

## Shared accessibility contract

- Visible labels or legends are always rendered.
- Required state is shown with text and exposed programmatically.
- Hint and error text are wired with `aria-describedby`.
- Error state uses `aria-invalid="true"` where applicable.

## Known limitations

- These phase-one primitives focus on semantics and accessibility wiring; application forms still own reactive-form integration and validation state.
