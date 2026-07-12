import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { Navigation } from './navigation';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Navigation', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should toggle aria-expanded and move focus to the first item when opened', async () => {
    const fixture = TestBed.createComponent(Navigation);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe((fixture.nativeElement as HTMLElement).querySelector('a'));
  });

  it('should mark the active route with aria-current', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/contact');

    const fixture = TestBed.createComponent(Navigation);
    fixture.detectChanges();
    await fixture.whenStable();

    const currentLink = (fixture.nativeElement as HTMLElement).querySelector('a[aria-current="page"]');
    expect(currentLink?.textContent).toContain('Contact');
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Navigation);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
