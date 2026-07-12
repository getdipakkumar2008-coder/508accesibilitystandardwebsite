import { booleanAttribute, Component, Input } from '@angular/core';
import { createUniqueId, joinDescribedBy } from '../../shared/unique-id';

/**
 * Accessibility contract:
 * - Renders a native fieldset/legend pairing for related controls.
 * - Optional hint and error text are programmatically referenced.
 * - Required state is communicated in text, never color alone.
 */
@Component({
  selector: 'app-fieldset',
  imports: [],
  templateUrl: './fieldset.html',
  styleUrl: './fieldset.scss',
})
export class Fieldset {
  private readonly generatedId = createUniqueId('fieldset');

  @Input() legend = 'Fieldset';
  @Input() hint: string | null = null;
  @Input() error: string | null = null;
  @Input({ transform: booleanAttribute }) required = false;

  get hintId(): string {
    return `${this.generatedId}-hint`;
  }

  get errorId(): string {
    return `${this.generatedId}-error`;
  }

  get describedBy(): string | null {
    return joinDescribedBy(this.hint ? this.hintId : null, this.error ? this.errorId : null);
  }
}
