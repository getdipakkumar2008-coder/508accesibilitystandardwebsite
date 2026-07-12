import { Component } from '@angular/core';
import { ContentPageTemplate, type BreadcrumbItem } from '../content/content-page-template';

@Component({
  selector: 'app-about',
  imports: [ContentPageTemplate],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly breadcrumbs: readonly BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: null },
  ];
}
