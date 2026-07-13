# Captcha

Purpose: Accessible, non-visual CAPTCHA alternative using plain-language arithmetic questions.
Satisfies **FR-FORM-4** — a challenge that can be completed without vision and without relying on audio only.

## Usage

```html
<app-captcha
  [showError]="isInvalid('captchaAnswer')"
  [errorMessage]="getError('captchaAnswer')"
  (challengeKeyInit)="onCaptchaKeyInit($event)"
  (answerChange)="onCaptchaAnswerChange($event)"
  (fieldBlur)="onCaptchaBlur()"
/>
```

The parent form must:
1. Listen to `(challengeKeyInit)` to receive the selected challenge key (needed for server-side validation).
2. Listen to `(answerChange)` to update the corresponding `FormControl` value.
3. Listen to `(fieldBlur)` to mark the control as `touched` for inline error display.
4. Pass `[showError]` and `[errorMessage]` back so the component renders inline errors.
5. Include `captchaKey` and `captchaAnswer` in the request body sent to the backend API.

## Challenge set

Five simple arithmetic/logic questions are used. The same set is validated server-side
(see `backend/Models/CaptchaChallenges.cs`) as defense-in-depth. All questions have
unambiguous single-digit numeric answers; the hint tells the user to enter a numeral.

| Key | Question | Answer |
| --- | --- | --- |
| c1 | What is 3 plus 4? | 7 |
| c2 | What is 10 minus 6? | 4 |
| c3 | What is 2 times 3? | 6 |
| c4 | How many sides does a square have? | 4 |
| c5 | What is 20 minus 12? | 8 |

## Keyboard interaction

The component renders a single `<input type="text">`. Standard keyboard navigation applies:
`Tab` focuses the input; `Shift+Tab` moves to the previous focusable element. No custom key
bindings are introduced.

## ARIA

- `<label for="…">` — programmatically associated with the input via matching `id`.
- `aria-required="true"` — indicates the field is required without relying on color.
- `aria-describedby` — points to the hint text and, when invalid, the error message `id`.
- `aria-invalid="true"` — set only when `showError` is `true` (after validation fails).
- No `role="alert"` on the inline error — the parent form's error summary (`role="alert"`)
  is the primary announcement mechanism, preventing double-announcement.

## Accessibility contract

- Passable by users with visual disabilities: the question is plain text rendered as a label.
- No dependency on images or audio.
- No session state required; the challenge key is sent with the submission.
- Input accepts only the numeric answer; instructions guide the user via the visible hint.

## Security note

Client-side validation provides immediate feedback. The definitive check is performed
server-side (`ContactController`) which looks up the challenge key and compares the
normalized answer. An incorrect or unknown key always returns a `ValidationProblemDetails`
400 response mapped to the `captchaAnswer` field.
