import { Component, Input } from '@angular/core';
import { createUniqueId } from '../shared/unique-id';

export interface AccordionItem {
  id?: string;
  heading: string;
  content: string;
}

/**
 * Accessibility contract:
 * - Uses native buttons for accordion headers.
 * - Exposes aria-expanded and aria-controls for each disclosure.
 * - Supports Enter/Space activation with the browser-native button model.
 */
@Component({
  selector: 'app-accordion',
  imports: [],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
})
export class Accordion {
  private readonly generatedBaseId = createUniqueId('accordion');

  @Input() items: readonly AccordionItem[] = [];
  @Input() allowMultiple = false;
  readonly expandedIndexes = new Set<number>();

  toggle(index: number): void {
    if (this.expandedIndexes.has(index)) {
      this.expandedIndexes.delete(index);
      return;
    }

    if (!this.allowMultiple) {
      this.expandedIndexes.clear();
    }

    this.expandedIndexes.add(index);
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.toggle(index);
  }

  isExpanded(index: number): boolean {
    return this.expandedIndexes.has(index);
  }

  buttonId(index: number): string {
    return `${this.panelId(index)}-button`;
  }

  panelId(index: number): string {
    return `${this.items[index]?.id ?? `${this.generatedBaseId}-${index}`}-panel`;
  }
}
