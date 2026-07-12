import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Fieldset } from './fieldset';
import { expectNoA11yViolations } from '../../../../testing/axe';

@Component({
  selector: 'app-fieldset-host',
  imports: [Fieldset],
  template: '<app-fieldset legend="Contact preferences" [required]="true" hint="Choose at least one."><input type="checkbox" id="phone" /><label for="phone">Phone</label></app-fieldset>',
})
class FieldsetHost {}

describe('Fieldset', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FieldsetHost] }).compileComponents();
  });

  it('should render a legend for the grouped controls', () => {
    const fixture = TestBed.createComponent(FieldsetHost);
    fixture.detectChanges();

    const legend = (fixture.nativeElement as HTMLElement).querySelector('legend');
    expect(legend?.textContent).toContain('Contact preferences');
    expect(legend?.textContent).toContain('(required)');
  });

  it('should link hint text with aria-describedby', () => {
    const fixture = TestBed.createComponent(FieldsetHost);
    fixture.detectChanges();

    const fieldset = (fixture.nativeElement as HTMLElement).querySelector('fieldset');
    expect(fieldset?.getAttribute('aria-describedby')).toContain('-hint');
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(FieldsetHost);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
