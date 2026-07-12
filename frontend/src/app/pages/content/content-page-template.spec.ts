import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContentPageTemplate } from './content-page-template';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('ContentPageTemplate', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentPageTemplate],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render page heading and breadcrumb current item', async () => {
    const fixture = TestBed.createComponent(ContentPageTemplate);
    fixture.componentInstance.pageTitle = 'About';
    fixture.componentInstance.breadcrumbs = [
      { label: 'Home', path: '/' },
      { label: 'About', path: null },
    ];

    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.querySelector('[aria-label="Breadcrumb"]')).toBeTruthy();
    expect(host.querySelector('[aria-current="page"]')?.textContent).toContain('About');
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(ContentPageTemplate);
    fixture.componentInstance.pageTitle = 'Services';
    fixture.componentInstance.breadcrumbs = [
      { label: 'Home', path: '/' },
      { label: 'Services', path: null },
    ];

    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
