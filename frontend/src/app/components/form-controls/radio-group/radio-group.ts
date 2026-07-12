import { booleanAttribute, Component, Input } from '@angular/core';
import { createUniqueId, joinDescribedBy } from '../../shared/unique-id';

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

/**
 * Accessibility contract:
 * - Uses native radios grouped by a fieldset/legend.
 * - Each radio has its own label and shares group-level hint/error metadata.
 * - Required state is provided in text and aria-required.
 */
@Component({
  selector: 'app-radio-group',
  imports: [],
  templateUrl: './radio-group.html',
  styleUrl: './radio-group.scss',
})
export class RadioGroup {
  private readonly generatedName = createUniqueId('radio-group');

  @Input() legend = 'Radio group';
  @Input() hint: string | null = null;
  @Input() error: string | null = null;
  @Input() options: readonly RadioOption[] = [];
  @Input() selectedValue: string | null = null;
  @Input() name = this.generatedName;
  @Input({ transform: booleanAttribute }) required = false;

  get hintId(): string {
    return `${this.name}-hint`;
  }

  get errorId(): string {
    return `${this.name}-error`;
  }

  get describedBy(): string | null {
    return joinDescribedBy(this.hint ? this.hintId : null, this.error ? this.errorId : null);
  }

  optionId(index: number): string {
    return `${this.name}-${index}`;
  }
}
