import { TestBed } from '@angular/core/testing';
import { Captcha, CAPTCHA_CHALLENGES } from './captcha';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Captcha', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Captcha] }).compileComponents();
  });

  it('should create and emit a challenge key on init', () => {
    const fixture = TestBed.createComponent(Captcha);
    const capturedKeys: string[] = [];
    fixture.componentInstance.challengeKeyInit.subscribe((key: string) => capturedKeys.push(key));
    fixture.detectChanges();

    expect(capturedKeys).toHaveLength(1);
    const validKeys = CAPTCHA_CHALLENGES.map((c) => c.key);
    expect(validKeys).toContain(capturedKeys[0]);
  });

  it('should associate the input with a programmatic label', () => {
    const fixture = TestBed.createComponent(Captcha);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input');
    const label = input ? el.querySelector(`label[for="${input.id}"]`) : null;

    expect(input).toBeTruthy();
    expect(label).toBeTruthy();
  });

  it('should set aria-required and aria-describedby on the input', () => {
    const fixture = TestBed.createComponent(Captcha);
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input');
    expect(input?.getAttribute('aria-required')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('should show error message and set aria-invalid when showError is true', () => {
    const fixture = TestBed.createComponent(Captcha);
    fixture.componentInstance.showError = true;
    fixture.componentInstance.errorMessage = 'Incorrect answer. Please try again.';
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input');
    const errorMsg = el.querySelector('.usa-error-message');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(errorMsg?.textContent).toContain('Incorrect answer. Please try again.');
  });

  it('should emit answerChange on user input', () => {
    const fixture = TestBed.createComponent(Captcha);
    fixture.detectChanges();

    const answers: string[] = [];
    fixture.componentInstance.answerChange.subscribe((val: string) => answers.push(val));

    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    input.value = '7';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(answers).toEqual(['7']);
  });

  it('should emit fieldBlur on input blur', () => {
    const fixture = TestBed.createComponent(Captcha);
    fixture.detectChanges();

    let blurred = false;
    fixture.componentInstance.fieldBlur.subscribe(() => (blurred = true));

    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('blur', { bubbles: true }));

    expect(blurred).toBe(true);
  });

  it('should have no automatically detectable accessibility violations (valid state)', async () => {
    const fixture = TestBed.createComponent(Captcha);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });

  it('should have no automatically detectable accessibility violations (error state)', async () => {
    const fixture = TestBed.createComponent(Captcha);
    fixture.componentInstance.showError = true;
    fixture.componentInstance.errorMessage = 'Incorrect answer. Please try again.';
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
