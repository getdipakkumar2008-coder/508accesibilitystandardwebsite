import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Accessibility contract:
 * - Uses a native anchor for navigation semantics.
 * - Keeps links visually distinct from buttons with underline-first styling.
 * - Disabled links expose aria-disabled and suppress activation.
 */
@Component({
  selector: 'app-link',
  imports: [],
  templateUrl: './link.html',
  styleUrl: './link.scss',
})
export class Link {
  @Input() href = '#';
  @Input() target: '_self' | '_blank' | '_parent' | '_top' | null = null;
  @Input() rel: string | null = null;
  @Input() ariaCurrent: 'page' | 'step' | 'location' | 'date' | 'time' | null = null;
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() readonly linkClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.linkClick.emit(event);
  }
}
