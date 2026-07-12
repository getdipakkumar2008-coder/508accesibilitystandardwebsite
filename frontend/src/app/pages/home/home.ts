import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../components/button/button';

interface QuickLink {
  title: string;
  description: string;
  path: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly router = inject(Router);

  readonly quickLinks: readonly QuickLink[] = [
    {
      title: 'About our accessibility program',
      description: 'Learn how we build and test services for Section 508 and WCAG 2.1 AA conformance.',
      path: '/about',
    },
    {
      title: 'Services and support channels',
      description: 'Find service options, delivery channels, and expected response timelines.',
      path: '/services',
    },
    {
      title: 'Contact the accessibility team',
      description: 'Report barriers, request accommodations, or ask for accessibility guidance.',
      path: '/contact',
    },
  ];

  liveRegionMessage = '';

  goToContact(): void {
    void this.router.navigateByUrl('/contact');
  }

  onSearchSubmit(event: Event, query: string): void {
    event.preventDefault();
    const normalizedQuery = query.trim();
    this.liveRegionMessage = normalizedQuery
      ? `Search submitted for ${normalizedQuery}.`
      : 'Search submitted. Enter a term to narrow results.';
  }
}
