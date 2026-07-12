import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavigationItem {
  label: string;
  path: string;
  exact?: boolean;
}

/**
 * Accessibility contract:
 * - Provides a nav landmark with an explicit aria-label.
 * - Uses a button with aria-expanded to control the mobile menu.
 * - Moves focus to the first link on open and back to the trigger on close.
 * - Marks the active route with aria-current="page".
 */
@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;
  @ViewChildren('navLink') private navLinks?: QueryList<ElementRef<HTMLAnchorElement>>;

  readonly items: readonly NavigationItem[] = [
    { label: 'Home', path: '/', exact: true },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.deferFocus(() => {
      if (this.menuOpen) {
        this.navLinks?.first?.nativeElement.focus();
      } else {
        this.menuButton?.nativeElement.focus();
      }
    });
  }

  closeMenu(): void {
    if (!this.menuOpen) {
      return;
    }

    this.menuOpen = false;
    this.deferFocus(() => this.menuButton?.nativeElement.focus());
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.menuOpen) {
      this.closeMenu();
    }
  }

  private deferFocus(fn: () => void): void {
    queueMicrotask(() => {
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => fn());
        return;
      }

      fn();
    });
  }
}
