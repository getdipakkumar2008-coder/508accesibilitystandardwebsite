import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  path: string | null;
}

@Component({
  selector: 'app-content-page-template',
  imports: [RouterLink],
  templateUrl: './content-page-template.html',
  styleUrl: './content-page-template.scss',
})
export class ContentPageTemplate {
  @Input({ required: true }) pageTitle!: string;
  @Input() intro = '';
  @Input({ required: true }) breadcrumbs: readonly BreadcrumbItem[] = [];
}
