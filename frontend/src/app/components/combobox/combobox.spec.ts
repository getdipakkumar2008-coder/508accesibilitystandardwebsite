import { TestBed } from '@angular/core/testing';
import { Combobox } from './combobox';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Combobox', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Combobox] }).compileComponents();
  });

  it('should render the combobox roles and ARIA attributes', () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.componentInstance.label = 'Search topics';
    fixture.componentInstance.options = [{ label: 'Accessibility', value: 'a11y' }];
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');
    expect(input?.getAttribute('role')).toBe('combobox');
    expect(input?.getAttribute('aria-autocomplete')).toBe('list');
    expect(input?.getAttribute('aria-expanded')).toBe('false');
  });

  it('should support arrow navigation and Enter selection', () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.componentInstance.label = 'Search topics';
    fixture.componentInstance.options = [
      { label: 'Accessibility', value: 'a11y' },
      { label: 'Compliance', value: 'compliance' },
    ];
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toContain('option-0');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(input.value).toBe('Accessibility');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.componentInstance.label = 'Search topics';
    fixture.componentInstance.options = [
      { label: 'Accessibility', value: 'a11y' },
      { label: 'Compliance', value: 'compliance' },
    ];
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
