import { booleanAttribute, Component, Input } from '@angular/core';
import { createUniqueId, joinDescribedBy } from '../../shared/unique-id';

/**
 * Accessibility contract:
 * - Always renders a visible programmatic label using for/id.
 * - Error text is linked with aria-describedby and aria-invalid.
 * - Required state is conveyed by text and aria-required.
 */
@Component({
  selector: 'app-text-input',
  imports: [],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput {
  private readonly generatedId = createUniqueId('text-input');

  @Input() id = this.generatedId;
  @Input() label = 'Text input';
  @Input() type: 'text' | 'email' | 'tel' | 'search' | 'url' = 'text';
  @Input() hint: string | null = null;
  @Input() error: string | null = null;
  @Input() value = '';
  @Input() autocomplete: string | null = null;
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
