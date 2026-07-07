import { TestBed } from '@angular/core/testing';
import { ContactForm } from './contact-form';
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
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    for (const id of ['fullName', 'email', 'message']) {
      expect(el.querySelector(`#${id}`)).toBeTruthy();
      expect(el.querySelector(`label[for="${id}"]`)).toBeTruthy();
    }
  });

  it('should surface an accessible error summary on invalid submit', async () => {
    const fixture = TestBed.createComponent(ContactForm);
    const component = fixture.componentInstance;
    component.onSubmit();
    await fixture.whenStable();
    fixture.detectChanges();

    const summary = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(summary).toBeTruthy();
    expect(component.errors().length).toBe(3);
  });

  it('should accept a valid submission and announce success', async () => {
    const fixture = TestBed.createComponent(ContactForm);
    const component = fixture.componentInstance;
    component.form.setValue({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello, this is a valid test message.',
    });
    component.onSubmit();
    expect(component.success()).toBe(true);
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(ContactForm);
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
