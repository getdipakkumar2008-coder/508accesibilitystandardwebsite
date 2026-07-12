import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

/**
 * Accessibility contract:
 * - Renders a native <button> so the correct role and keyboard activation are built in.
 * - Loading state exposes aria-disabled/aria-busy and suppresses activation without removing focus.
 * - Uses visible focus styles from the shared design-token layer.
 */
@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input() ariaLabel: string | null = null;

  @Output() readonly buttonClick = new EventEmitter<MouseEvent>();

  get isUnavailable(): boolean {
    return this.disabled || this.loading;
  }

  onClick(event: MouseEvent): void {
    if (this.isUnavailable) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.buttonClick.emit(event);
  }
}
