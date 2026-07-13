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

  it('should emit optionSelected when an option is chosen', () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.componentInstance.label = 'Search topics';
    fixture.componentInstance.options = [
      { label: 'Accessibility', value: 'a11y' },
      { label: 'Compliance', value: 'compliance' },
    ];
    fixture.detectChanges();

    const selected: { label: string; value: string }[] = [];
    fixture.componentInstance.optionSelected.subscribe((opt: { label: string; value: string }) =>
      selected.push(opt),
    );

    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(selected).toHaveLength(1);
    expect(selected[0].value).toBe('a11y');
  });

  it('should include a polite aria-live status region', () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.componentInstance.label = 'Search topics';
    fixture.componentInstance.options = [{ label: 'Accessibility', value: 'a11y' }];
    fixture.detectChanges();

    const liveRegion = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();
    expect(liveRegion?.getAttribute('role')).toBe('status');
  });

  it('should announce result count in live region when user types', () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.componentInstance.label = 'Search topics';
    fixture.componentInstance.options = [
      { label: 'Accessibility', value: 'a11y' },
      { label: 'Accessible design', value: 'design' },
      { label: 'Compliance', value: 'compliance' },
    ];
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;

    // Simulate typing "acc" — matches "Accessibility" and "Accessible design" (2 results)
    input.value = 'acc';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const liveRegion = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]');
    expect(liveRegion?.textContent?.trim()).toBe('2 results available.');
  });

  it('should announce "No results found." when no options match', () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.componentInstance.label = 'Search topics';
    fixture.componentInstance.options = [{ label: 'Accessibility', value: 'a11y' }];
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    input.value = 'zzz';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const liveRegion = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]');
    expect(liveRegion?.textContent?.trim()).toBe('No results found.');
  });

  it('should announce "1 result available." for a single match', () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.componentInstance.label = 'Search topics';
    fixture.componentInstance.options = [
      { label: 'Accessibility', value: 'a11y' },
      { label: 'Compliance', value: 'compliance' },
    ];
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    input.value = 'Compliance';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const liveRegion = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]');
    expect(liveRegion?.textContent?.trim()).toBe('1 result available.');
  });

  it('should pre-populate query from initialValue input', () => {
    const fixture = TestBed.createComponent(Combobox);
    fixture.componentInstance.label = 'Search topics';
    fixture.componentInstance.options = [
      { label: 'Accessibility', value: 'a11y' },
      { label: 'Compliance', value: 'compliance' },
    ];
    fixture.componentInstance.initialValue = 'Access';
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('Access');
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
