import { TestBed } from '@angular/core/testing';
import { ContactForm } from './contact-form';
import { CAPTCHA_CHALLENGES } from '../captcha/captcha';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('ContactForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ContactForm] }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactForm);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should associate every input with a programmatic label', async () => {
    const fixture = TestBed.createComponent(ContactForm);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    for (const id of ['fullName', 'email', 'message']) {
      expect(el.querySelector(`#${id}`)).toBeTruthy();
      expect(el.querySelector(`label[for="${id}"]`)).toBeTruthy();
    }
    // Verify the CAPTCHA input also has a programmatic label
    const captchaInput = el.querySelector('app-captcha input');
    expect(captchaInput).toBeTruthy();
    const captchaInputId = captchaInput?.id ?? '';
    expect(el.querySelector(`label[for="${captchaInputId}"]`)).toBeTruthy();
  });

  it('should surface an accessible error summary on invalid submit', async () => {
    const fixture = TestBed.createComponent(ContactForm);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.onSubmit();
    await fixture.whenStable();
    fixture.detectChanges();

    const summary = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(summary).toBeTruthy();
    // All 4 fields should be invalid (fullName, email, message, captchaAnswer)
    expect(component.errors().length).toBe(4);
  });

  it('should accept a valid submission including correct captcha answer and announce success', async () => {
    const fixture = TestBed.createComponent(ContactForm);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    // Pick a known challenge for deterministic testing
    const challenge = CAPTCHA_CHALLENGES[0]; // c1: "What is 3 plus 4?" → "7"
    component.captchaKey = challenge.key;

    component.form.setValue({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello, this is a valid test message.',
      captchaAnswer: challenge.answer,
    });
    component.onSubmit();
    expect(component.success()).toBe(true);
  });

  it('should surface a captcha error when the answer is incorrect', async () => {
    const fixture = TestBed.createComponent(ContactForm);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const challenge = CAPTCHA_CHALLENGES[0]; // answer is "7"
    component.captchaKey = challenge.key;

    component.form.setValue({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello, this is a valid test message.',
      captchaAnswer: '99', // wrong answer
    });
    component.onSubmit();

    expect(component.success()).toBe(false);
    expect(component.errors().some((e) => e.id === 'captchaAnswer')).toBe(true);
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(ContactForm);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
