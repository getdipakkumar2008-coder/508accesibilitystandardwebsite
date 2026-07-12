import { TestBed } from '@angular/core/testing';
import { Link } from './link';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Link', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Link] }).compileComponents();
  });

  it('should allow focus on the anchor', async () => {
    const fixture = TestBed.createComponent(Link);
    fixture.componentInstance.href = '/contact';
    fixture.detectChanges();
    await fixture.whenStable();

    const anchor = (fixture.nativeElement as HTMLElement).querySelector('a') as HTMLAnchorElement;
    anchor.focus();

    expect(document.activeElement).toBe(anchor);
  });

  it('should render aria attributes for current-page links', () => {
    const fixture = TestBed.createComponent(Link);
    fixture.componentInstance.href = '/contact';
    fixture.componentInstance.ariaCurrent = 'page';
    fixture.detectChanges();

    const anchor = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(anchor?.getAttribute('aria-current')).toBe('page');
  });

  it('should prevent activation when disabled', () => {
    const fixture = TestBed.createComponent(Link);
    let clickCount = 0;
    fixture.componentInstance.disabled = true;
    fixture.componentInstance.linkClick.subscribe(() => clickCount += 1);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector('a')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(clickCount).toBe(0);
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Link);
    fixture.componentInstance.href = '/contact';
    fixture.detectChanges();
    ((fixture.nativeElement as HTMLElement).querySelector('a') as HTMLAnchorElement).textContent = 'Contact us';
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
