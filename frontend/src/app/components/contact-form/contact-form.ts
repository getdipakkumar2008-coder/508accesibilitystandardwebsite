import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Captcha, CAPTCHA_CHALLENGES } from '../captcha/captcha';

interface FieldError {
  id: string;
  label: string;
  message: string;
  /** Use the field's DOM element id for the error-summary link target. */
  inputId?: string;
}

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, Captcha],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private readonly fb = inject(FormBuilder);

  /** Key of the CAPTCHA challenge currently displayed; set by (challengeKeyInit). */
  captchaKey = '';

  /** Human-readable labels used for the error summary and messages. */
  private readonly labels: Record<string, string> = {
    fullName: 'Full name',
    email: 'Email address',
    message: 'Message',
    captchaAnswer: 'Verification question',
  };

  readonly form = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    captchaAnswer: ['', [Validators.required, this.buildCaptchaValidator()]],
  });

  readonly submitted = signal(false);
  readonly success = signal(false);

  /** Template reference to the CAPTCHA child component for reading its inputId. */
  captchaComponent = viewChild(Captcha);

  private readonly errorSummary = viewChild<ElementRef<HTMLElement>>('errorSummary');

  /** A field shows its error only after a submit attempt or once it is touched. */
  isInvalid(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && (this.submitted() || control.touched);
  }

  /** Returns a plain-language, actionable error message for a control. */
  getError(name: string): string {
    const control = this.form.get(name);
    if (!control?.errors) {
      return '';
    }
    if (control.errors['required']) {
      return name === 'captchaAnswer'
        ? 'Enter the answer to the verification question.'
        : `Enter your ${this.labels[name].toLowerCase()}.`;
    }
    if (control.errors['email']) {
      return 'Enter a valid email address, such as name@example.com.';
    }
    if (control.errors['minlength']) {
      return 'Your message must be at least 10 characters.';
    }
    if (control.errors['captchaWrong']) {
      return 'Incorrect answer. Please try again.';
    }
    return 'This field is invalid.';
  }

  /** Ordered list of current errors, used to build the accessible error summary. */
  errors(): FieldError[] {
    return Object.keys(this.labels)
      .filter((name) => this.isInvalid(name))
      .map((name) => ({
        id: name,
        label: this.labels[name],
        message: this.getError(name),
        inputId: name === 'captchaAnswer' ? this.captchaComponent()?.inputId : name,
      }));
  }

  /** Called by the CAPTCHA component when it selects a challenge on init. */
  onCaptchaKeyInit(key: string): void {
    this.captchaKey = key;
  }

  /** Called by the CAPTCHA component on every keystroke. */
  onCaptchaAnswerChange(answer: string): void {
    this.form.get('captchaAnswer')?.setValue(answer, { emitEvent: true });
  }

  /** Called by the CAPTCHA component on blur so the control is marked touched. */
  onCaptchaBlur(): void {
    this.form.get('captchaAnswer')?.markAsTouched();
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.success.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Move focus to the error summary so assistive tech announces the errors.
      setTimeout(() => this.errorSummary()?.nativeElement.focus());
      return;
    }

    // In a real app this would POST to the .NET API with captchaKey + captchaAnswer.
    // Server-side validation mirrors the client-side check as defense-in-depth.
    this.success.set(true);
    this.submitted.set(false);
    this.form.reset();
  }

  /** Sends focus to the field referenced by an error-summary link. */
  focusField(event: Event, inputId: string): void {
    event.preventDefault();
    document.getElementById(inputId)?.focus();
  }

  /**
   * Custom validator that checks the captcha answer against the selected challenge.
   * Reads `this.captchaKey` at validation time so it works after the challenge is
   * set by `onCaptchaKeyInit`. Returns `null` (valid) while the key is unknown so
   * `Validators.required` handles blank-input coverage until init completes.
   */
  private buildCaptchaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = String(control.value ?? '');
      if (!raw.trim()) {
        return null; // Validators.required covers blank input
      }
      const challenge = CAPTCHA_CHALLENGES.find((c) => c.key === this.captchaKey);
      if (!challenge) {
        return null; // challenge not yet selected; defer to required
      }
      return raw.trim().toLowerCase() === challenge.answer.toLowerCase()
        ? null
        : { captchaWrong: true };
    };
  }
}
