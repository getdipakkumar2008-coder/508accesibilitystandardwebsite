import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Combobox, type ComboboxOption } from '../../components/combobox/combobox';

/** In-repository dataset of searchable site pages. */
export const SEARCH_ITEMS: readonly ComboboxOption[] = [
  { label: 'About our accessibility program', value: '/about' },
  { label: 'Accessibility principles and standards', value: '/about' },
  { label: 'Section 508 compliance overview', value: '/about' },
  { label: 'WCAG 2.1 AA conformance information', value: '/about' },
  { label: 'Program metrics and quarterly reports', value: '/about' },
  { label: 'Services and support channels', value: '/services' },
  { label: 'Service delivery and response timelines', value: '/services' },
  { label: 'Request an accommodation', value: '/services' },
  { label: 'Accessibility audit and testing services', value: '/services' },
  { label: 'Contact the accessibility team', value: '/contact' },
  { label: 'Report an accessibility barrier', value: '/contact' },
  { label: 'Ask for accessibility guidance', value: '/contact' },
  { label: 'Submit a contact form', value: '/contact' },
];

/**
 * Predictive search page wired to the APG combobox component.
 * Satisfies FR-STR-3 (predictive search) and A11Y-R-3 (live-region announcements).
 *
 * The page reads an optional `q` query parameter to pre-populate the search input
 * when navigating from the home page search form.
 */
@Component({
  selector: 'app-search',
  imports: [Combobox],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly searchItems: readonly ComboboxOption[] = SEARCH_ITEMS;

  initialQuery = '';
  selectedOption: ComboboxOption | null = null;

  ngOnInit(): void {
    this.initialQuery = this.route.snapshot.queryParamMap.get('q') ?? '';
  }

  onOptionSelected(option: ComboboxOption): void {
    this.selectedOption = option;
    void this.router.navigateByUrl(option.value);
  }
}
