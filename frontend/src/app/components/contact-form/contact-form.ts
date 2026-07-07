import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface FieldError {
  id: string;
  label: string;
  message: string;
}

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private readonly fb = inject(FormBuilder);

  /** Human-readable labels used for the error summary and messages. */
  private readonly labels: Record<string, string> = {
    fullName: 'Full name',
    email: 'Email address',
    message: 'Message',
  };

  readonly form = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly submitted = signal(false);
  readonly success = signal(false);

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
      return `Enter your ${this.labels[name].toLowerCase()}.`;
    }
    if (control.errors['email']) {
      return 'Enter a valid email address, such as name@example.com.';
    }
    if (control.errors['minlength']) {
      return 'Your message must be at least 10 characters.';
    }
    return 'This field is invalid.';
  }

  /** Ordered list of current errors, used to build the accessible error summary. */
  errors(): FieldError[] {
    return Object.keys(this.labels)
      .filter((name) => this.isInvalid(name))
      .map((name) => ({ id: name, label: this.labels[name], message: this.getError(name) }));
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

    // In a real app this would POST to the .NET API. Here we confirm success.
    this.success.set(true);
    this.submitted.set(false);
    this.form.reset();
  }

  /** Sends focus to the field referenced by an error-summary link. */
  focusField(event: Event, id: string): void {
    event.preventDefault();
    document.getElementById(id)?.focus();
  }
}
