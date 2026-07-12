import { TestBed } from '@angular/core/testing';
import { Button } from './button';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Button', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Button] }).compileComponents();
  });

  it('should allow focus on the native button element', async () => {
    const fixture = TestBed.createComponent(Button);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    button.focus();

    expect(document.activeElement).toBe(button);
  });

  it('should expose aria-disabled and aria-busy while loading', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    expect(button?.getAttribute('aria-disabled')).toBe('true');
    expect(button?.getAttribute('aria-busy')).toBe('true');
  });

  it('should prevent activation when disabled or loading', () => {
    const fixture = TestBed.createComponent(Button);
    let clickCount = 0;
    fixture.componentInstance.loading = true;
    fixture.componentInstance.buttonClick.subscribe(() => clickCount += 1);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(clickCount).toBe(0);
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.ariaLabel = 'Continue';
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
