import { TestBed } from '@angular/core/testing';
import { Checkbox } from './checkbox';
import { expectNoA11yViolations } from '../../../../testing/axe';

describe('Checkbox', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Checkbox] }).compileComponents();
  });

  it('should associate the label with the checkbox input', () => {
    const fixture = TestBed.createComponent(Checkbox);
    fixture.componentInstance.id = 'subscribe';
    fixture.componentInstance.label = 'Subscribe to updates';
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('label[for="subscribe"]')).toBeTruthy();
    expect(host.querySelector('input#subscribe')).toBeTruthy();
  });

  it('should expose an error and required indicator accessibly', () => {
    const fixture = TestBed.createComponent(Checkbox);
    fixture.componentInstance.error = 'You must accept the terms.';
    fixture.componentInstance.required = true;
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toContain('-error');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('(required)');
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Checkbox);
    fixture.componentInstance.label = 'Subscribe to updates';
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
