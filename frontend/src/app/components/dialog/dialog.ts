import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { getFocusableElements } from '../shared/focusable';
import { createUniqueId } from '../shared/unique-id';

/**
 * Accessibility contract:
 * - Presents a modal dialog with role="dialog", aria-modal, and aria-labelledby.
 * - Moves focus into the dialog, traps Tab/Shift+Tab, closes on Escape, and restores focus.
 * - Applies inert/background scroll lock while the dialog is open.
 */
@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly inertedElements = new Set<HTMLElement>();
  private returnFocusTo: HTMLElement | null = null;
  private readonly generatedTitleId = createUniqueId('dialog-title');

  @ViewChild('panel') private panel?: ElementRef<HTMLElement>;

  @Input() title = 'Dialog';
  @Input() closeLabel = 'Close dialog';
  isOpen = false;

  @Output() readonly closed = new EventEmitter<void>();

  get titleId(): string {
    return this.generatedTitleId;
  }

  openFrom(trigger?: HTMLElement | null): void {
    this.returnFocusTo = trigger ?? (this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null);
    this.isOpen = true;
    this.applyModalState();
    queueMicrotask(() => this.focusFirstElement());
  }

  close(): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.removeModalState();
    this.closed.emit();
    queueMicrotask(() => this.returnFocusTo?.focus());
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = this.focusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      this.panel?.nativeElement.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  handleBackdropKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  private focusFirstElement(): void {
    const focusable = this.focusableElements();
    (focusable[0] ?? this.panel?.nativeElement)?.focus();
  }

  private focusableElements(): HTMLElement[] {
    return this.panel ? getFocusableElements(this.panel.nativeElement) : [];
  }

  private applyModalState(): void {
    this.document.body.classList.add('app-dialog-open');

    const siblings = this.host.nativeElement.parentElement
      ? Array.from(this.host.nativeElement.parentElement.children)
      : Array.from(this.document.body.children);

    for (const child of siblings) {
      const element = child as HTMLElement;
      if (element === this.host.nativeElement || element.hasAttribute('inert')) {
        continue;
      }

      element.setAttribute('inert', '');
      this.inertedElements.add(element);
    }
  }

  private removeModalState(): void {
    this.document.body.classList.remove('app-dialog-open');

    for (const element of this.inertedElements) {
      element.removeAttribute('inert');
    }

    this.inertedElements.clear();
  }
}
