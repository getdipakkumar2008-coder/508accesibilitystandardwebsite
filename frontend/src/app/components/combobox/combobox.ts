import { Component, Input } from '@angular/core';
import { createUniqueId } from '../shared/unique-id';

export interface ComboboxOption {
  label: string;
  value: string;
}

/**
 * Accessibility contract:
 * - Implements the APG combobox/listbox pattern.
 * - Maintains aria-expanded, aria-activedescendant, and aria-autocomplete.
 * - Supports ArrowUp/ArrowDown/Enter/Escape keyboard navigation.
 */
@Component({
  selector: 'app-combobox',
  imports: [],
  templateUrl: './combobox.html',
  styleUrl: './combobox.scss',
})
export class Combobox {
  private readonly generatedId = createUniqueId('combobox');

  @Input() label = 'Combobox';
  @Input() hint: string | null = null;
  @Input() options: readonly ComboboxOption[] = [];

  query = '';
  expanded = false;
  activeIndex = -1;

  get inputId(): string {
    return `${this.generatedId}-input`;
  }

  get listboxId(): string {
    return `${this.generatedId}-listbox`;
  }

  get hintId(): string {
    return `${this.generatedId}-hint`;
  }

  get filteredOptions(): readonly ComboboxOption[] {
    const normalized = this.query.trim().toLowerCase();
    if (!normalized) {
      return this.options;
    }

    return this.options.filter((option) => option.label.toLowerCase().includes(normalized));
  }

  get activeDescendant(): string | null {
    return this.activeIndex >= 0 ? this.optionId(this.activeIndex) : null;
  }

  onInput(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    this.expanded = true;
    this.activeIndex = this.filteredOptions.length > 0 ? 0 : -1;
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.expanded = true;
      this.moveActive(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.expanded = true;
      this.moveActive(-1);
      return;
    }

    if (event.key === 'Enter' && this.expanded && this.activeIndex >= 0) {
      event.preventDefault();
      this.selectOption(this.activeIndex);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.expanded = false;
      this.activeIndex = -1;
    }
  }

  selectOption(index: number): void {
    const option = this.filteredOptions[index];
    if (!option) {
      return;
    }

    this.query = option.label;
    this.expanded = false;
    this.activeIndex = -1;
  }

  optionId(index: number): string {
    return `${this.generatedId}-option-${index}`;
  }

  onOptionKeydown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.selectOption(index);
  }

  private moveActive(delta: number): void {
    const options = this.filteredOptions;
    if (options.length === 0) {
      this.activeIndex = -1;
      return;
    }

    const next = this.activeIndex < 0 ? 0 : (this.activeIndex + delta + options.length) % options.length;
    this.activeIndex = next;
  }
}
