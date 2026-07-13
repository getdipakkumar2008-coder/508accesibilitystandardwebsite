import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { createUniqueId, joinDescribedBy } from '../shared/unique-id';

export interface CaptchaChallenge {
  readonly key: string;
  readonly question: string;
  readonly answer: string;
}

/**
 * Accessible, non-visual CAPTCHA challenges using plain-language arithmetic.
 * The same challenge keys and expected answers are validated server-side as
 * defense-in-depth. No audio-only or image-only challenge is used.
 */
export const CAPTCHA_CHALLENGES: readonly CaptchaChallenge[] = [
  { key: 'c1', question: 'What is 3 plus 4?', answer: '7' },
  { key: 'c2', question: 'What is 10 minus 6?', answer: '4' },
  { key: 'c3', question: 'What is 2 times 3?', answer: '6' },
  { key: 'c4', question: 'How many sides does a square have?', answer: '4' },
  { key: 'c5', question: 'What is 20 minus 12?', answer: '8' },
];

/**
 * Accessibility contract:
 * - Renders a visible `<label>` associated via `for` with the input `id`.
 * - Provides `aria-describedby` linking the hint and, when invalid, the error.
 * - Sets `aria-invalid="true"` and `aria-required="true"` on the input.
 * - Error display is controlled by the parent via `showError` / `errorMessage`.
 *   The parent form's `role="alert"` error summary is the primary announcement
 *   mechanism; no additional `role="alert"` is used here to avoid double-announcing.
 * - A text-based "(required)" indicator is shown; no reliance on color alone.
 */
@Component({
  selector: 'app-captcha',
  imports: [],
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss',
})
export class Captcha implements OnInit {
  private readonly generatedId = createUniqueId('captcha');

  /** Pass `true` when the parent form has validated this field as invalid. */
  @Input() showError = false;

  /** The error message text to display (comes from the parent form). */
  @Input() errorMessage = '';

  /** Emits the selected challenge key once on component init. */
  @Output() readonly challengeKeyInit = new EventEmitter<string>();

  /** Emits the user's current answer on every keystroke. */
  @Output() readonly answerChange = new EventEmitter<string>();

  /** Emits when the input loses focus so the parent can mark the control touched. */
  @Output() readonly fieldBlur = new EventEmitter<void>();

  challenge: CaptchaChallenge = CAPTCHA_CHALLENGES[0];
  value = '';

  ngOnInit(): void {
    const idx = Math.floor(Math.random() * CAPTCHA_CHALLENGES.length);
    this.challenge = CAPTCHA_CHALLENGES[idx];
    this.challengeKeyInit.emit(this.challenge.key);
  }

  get inputId(): string {
    return `${this.generatedId}-input`;
  }

  get hintId(): string {
    return `${this.generatedId}-hint`;
  }

  get errorId(): string {
    return `${this.generatedId}-error`;
  }

  get describedBy(): string | null {
    return joinDescribedBy(this.hintId, this.showError ? this.errorId : null);
  }

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.answerChange.emit(this.value);
  }

  onBlur(): void {
    this.fieldBlur.emit();
  }
}
