import { Component, ElementRef, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  private readonly router = inject(Router);

  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;
  @ViewChildren('navLink') private navLinks?: QueryList<ElementRef<HTMLAnchorElement>>;

  readonly items: readonly NavigationItem[] = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Contact', path: '/contact' },
  ];

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    queueMicrotask(() => {
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
    queueMicrotask(() => this.menuButton?.nativeElement.focus());
  }

  isCurrent(item: NavigationItem): boolean {
    return this.router.isActive(
      this.router.createUrlTree([item.path]),
      item.exact ? { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' } : { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' },
    );
  }
}
