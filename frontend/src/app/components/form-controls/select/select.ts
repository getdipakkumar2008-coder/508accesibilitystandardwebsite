import { booleanAttribute, Component, Input } from '@angular/core';
import { createUniqueId, joinDescribedBy } from '../../shared/unique-id';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

/**
 * Accessibility contract:
 * - Uses a native <select> for the correct keyboard and screen-reader model.
 * - Associates visible label, hint, and error text programmatically.
 * - Required state is exposed through text and aria-required.
 */
@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  private readonly generatedId = createUniqueId('select');

  @Input() id = this.generatedId;
  @Input() label = 'Select';
  @Input() hint: string | null = null;
  @Input() error: string | null = null;
  @Input() value = '';
  @Input() options: readonly SelectOption[] = [];
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  get hintId(): string {
    return `${this.id}-hint`;
  }

  get errorId(): string {
    return `${this.id}-error`;
  }

  get describedBy(): string | null {
    return joinDescribedBy(this.hint ? this.hintId : null, this.error ? this.errorId : null);
  }
}
