import { TestBed } from '@angular/core/testing';
import { RadioGroup } from './radio-group';
import { expectNoA11yViolations } from '../../../../testing/axe';

describe('RadioGroup', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RadioGroup] }).compileComponents();
  });

  it('should render a legend and programmatic labels for each radio', () => {
    const fixture = TestBed.createComponent(RadioGroup);
    fixture.componentInstance.legend = 'Preferred contact method';
    fixture.componentInstance.options = [
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
    ];
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('legend')?.textContent).toContain('Preferred contact method');
    expect(host.querySelectorAll('input[type="radio"]').length).toBe(2);
    expect(host.querySelectorAll('label').length).toBe(2);
  });

  it('should link group-level errors and required state', () => {
    const fixture = TestBed.createComponent(RadioGroup);
    fixture.componentInstance.options = [{ label: 'Email', value: 'email' }];
    fixture.componentInstance.error = 'Choose a contact method.';
    fixture.componentInstance.required = true;
    fixture.detectChanges();

    const radio = (fixture.nativeElement as HTMLElement).querySelector('input[type="radio"]');
    expect(radio?.getAttribute('aria-describedby')).toContain('-error');
    expect(radio?.getAttribute('aria-required')).toBe('true');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('(required)');
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(RadioGroup);
    fixture.componentInstance.legend = 'Preferred contact method';
    fixture.componentInstance.options = [
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
    ];
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
