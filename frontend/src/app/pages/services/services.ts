import { Component } from '@angular/core';
import { ContentPageTemplate, type BreadcrumbItem } from '../content/content-page-template';

@Component({
  selector: 'app-services',
  imports: [ContentPageTemplate],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  readonly breadcrumbs: readonly BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: null },
  ];
}
