import { booleanAttribute, Component, Input } from '@angular/core';
import { createUniqueId, joinDescribedBy } from '../../shared/unique-id';

/**
 * Accessibility contract:
 * - Uses a native checkbox input and visible text label.
 * - Error text is linked through aria-describedby.
 * - Required state is reinforced with visible text and aria-required.
 */
@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class Checkbox {
  private readonly generatedId = createUniqueId('checkbox');

  @Input() id = this.generatedId;
  @Input() label = 'Checkbox';
  @Input() hint: string | null = null;
  @Input() error: string | null = null;
  @Input({ transform: booleanAttribute }) checked = false;
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
