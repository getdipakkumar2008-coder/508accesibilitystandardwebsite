import { TestBed } from '@angular/core/testing';
import { Select } from './select';
import { expectNoA11yViolations } from '../../../../testing/axe';

describe('Select', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Select] }).compileComponents();
  });

  it('should associate the label with the select element', () => {
    const fixture = TestBed.createComponent(Select);
    fixture.componentInstance.id = 'topic';
    fixture.componentInstance.label = 'Topic';
    fixture.componentInstance.options = [{ label: 'General question', value: 'general' }];
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('label[for="topic"]')).toBeTruthy();
    expect(host.querySelector('select#topic')).toBeTruthy();
  });

  it('should expose the error description and required indicator', () => {
    const fixture = TestBed.createComponent(Select);
    fixture.componentInstance.options = [{ label: 'General question', value: 'general' }];
    fixture.componentInstance.error = 'Select a topic.';
    fixture.componentInstance.required = true;
    fixture.detectChanges();

    const select = (fixture.nativeElement as HTMLElement).querySelector('select');
    expect(select?.getAttribute('aria-describedby')).toContain('-error');
    expect(select?.getAttribute('aria-required')).toBe('true');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('(required)');
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Select);
    fixture.componentInstance.label = 'Topic';
    fixture.componentInstance.options = [{ label: 'General question', value: 'general' }];
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
