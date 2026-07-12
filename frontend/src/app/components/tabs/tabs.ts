import { Component, Input } from '@angular/core';
import { createUniqueId } from '../shared/unique-id';

export interface TabDefinition {
  id?: string;
  label: string;
  content: string;
}

/**
 * Accessibility contract:
 * - Implements the APG tabs pattern with tablist/tab/tabpanel roles.
 * - Arrow keys, Home, and End auto-activate the newly focused tab.
 * - Uses roving tabindex so only the active tab is tabbable.
 */
@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs {
  private readonly generatedBaseId = createUniqueId('tabs');

  @Input() tabs: readonly TabDefinition[] = [];
  activeIndex = 0;

  selectTab(index: number): void {
    this.activeIndex = index;
    queueMicrotask(() => this.tabButton(index)?.focus());
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (this.tabs.length === 0) {
      return;
    }

    const nextIndex = this.nextIndexForKey(event.key, index);
    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    this.selectTab(nextIndex);
  }

  tabId(index: number): string {
    return `${this.panelId(index)}-tab`;
  }

  panelId(index: number): string {
    return `${this.tabs[index]?.id ?? `${this.generatedBaseId}-${index}`}-panel`;
  }

  private nextIndexForKey(key: string, index: number): number | null {
    if (key === 'ArrowRight') {
      return (index + 1) % this.tabs.length;
    }

    if (key === 'ArrowLeft') {
      return (index - 1 + this.tabs.length) % this.tabs.length;
    }

    if (key === 'Home') {
      return 0;
    }

    if (key === 'End') {
      return this.tabs.length - 1;
    }

    return null;
  }

  private tabButton(index: number): HTMLButtonElement | null {
    return document.getElementById(this.tabId(index)) as HTMLButtonElement | null;
  }
}
