import { TestBed } from '@angular/core/testing';
import { Tabs } from './tabs';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Tabs', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Tabs] }).compileComponents();
  });

  it('should expose the APG tab roles and state', () => {
    const fixture = TestBed.createComponent(Tabs);
    fixture.componentInstance.tabs = [
      { label: 'Overview', content: 'Overview content' },
      { label: 'Details', content: 'Detail content' },
    ];
    fixture.detectChanges();

    const tabs = (fixture.nativeElement as HTMLElement).querySelectorAll('[role="tab"]');
    expect((fixture.nativeElement as HTMLElement).querySelector('[role="tablist"]')).toBeTruthy();
    expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
    expect((fixture.nativeElement as HTMLElement).querySelector('[role="tabpanel"]')).toBeTruthy();
  });

  it('should auto-activate the next tab with arrow-key navigation', async () => {
    const fixture = TestBed.createComponent(Tabs);
    fixture.componentInstance.tabs = [
      { label: 'Overview', content: 'Overview content' },
      { label: 'Details', content: 'Detail content' },
    ];
    fixture.detectChanges();

    const firstTab = (fixture.nativeElement as HTMLElement).querySelectorAll('[role="tab"]')[0] as HTMLButtonElement;
    firstTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    const tabs = (fixture.nativeElement as HTMLElement).querySelectorAll('[role="tab"]');
    expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Tabs);
    fixture.componentInstance.tabs = [
      { label: 'Overview', content: 'Overview content' },
      { label: 'Details', content: 'Detail content' },
    ];
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
