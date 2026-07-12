import { TestBed } from '@angular/core/testing';
import { Accordion } from './accordion';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Accordion', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Accordion] }).compileComponents();
  });

  it('should expose aria-expanded and aria-controls on the trigger button', () => {
    const fixture = TestBed.createComponent(Accordion);
    fixture.componentInstance.items = [{ heading: 'Section 1', content: 'Panel content' }];
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(button?.getAttribute('aria-controls')).toContain('-panel');
  });

  it('should toggle the panel with keyboard activation', () => {
    const fixture = TestBed.createComponent(Accordion);
    fixture.componentInstance.items = [{ heading: 'Section 1', content: 'Panel content' }];
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect((fixture.nativeElement as HTMLElement).querySelector('[role="region"]')?.hasAttribute('hidden')).toBe(false);
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Accordion);
    fixture.componentInstance.items = [{ heading: 'Section 1', content: 'Panel content' }];
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
