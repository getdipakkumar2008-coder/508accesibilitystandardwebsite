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

  it('should toggle aria-expanded and expose navigation items when opened', async () => {
    const fixture = TestBed.createComponent(Navigation);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve));

    const host = fixture.nativeElement as HTMLElement;

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(host.querySelector('.app-navigation__panel--open')).toBeTruthy();
  });

  it('should close menu and return focus to trigger when escape is pressed', async () => {
    const fixture = TestBed.createComponent(Navigation);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector('button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve));

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  it('should mark the active route with aria-current', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(Navigation);
    fixture.detectChanges();

    await router.navigateByUrl('/services');
    fixture.detectChanges();
    await fixture.whenStable();

    const currentLink = (fixture.nativeElement as HTMLElement).querySelector('a[aria-current="page"]');
    expect(currentLink?.textContent).toContain('Services');
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Navigation);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
