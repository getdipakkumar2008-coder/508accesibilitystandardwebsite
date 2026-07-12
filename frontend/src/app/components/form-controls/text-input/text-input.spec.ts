import { TestBed } from '@angular/core/testing';
import { TextInput } from './text-input';
import { expectNoA11yViolations } from '../../../../testing/axe';

describe('TextInput', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TextInput] }).compileComponents();
  });

  it('should associate the label with the input element', () => {
    const fixture = TestBed.createComponent(TextInput);
    fixture.componentInstance.id = 'email';
    fixture.componentInstance.label = 'Email address';
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('label[for="email"]')).toBeTruthy();
    expect(host.querySelector('#email')).toBeTruthy();
  });

  it('should link the error message with aria-describedby and mark the field invalid', () => {
    const fixture = TestBed.createComponent(TextInput);
    fixture.componentInstance.error = 'Enter your email address.';
    fixture.componentInstance.required = true;
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toContain('-error');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('(required)');
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(TextInput);
    fixture.componentInstance.label = 'Full name';
    fixture.componentInstance.hint = 'Enter your legal name.';
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
