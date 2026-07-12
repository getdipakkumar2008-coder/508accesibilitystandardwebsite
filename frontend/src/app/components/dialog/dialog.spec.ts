import { TestBed } from '@angular/core/testing';
import { Dialog } from './dialog';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Dialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Dialog] }).compileComponents();
  });

  it('should trap focus within the dialog', async () => {
    const fixture = TestBed.createComponent(Dialog);
    fixture.componentInstance.title = 'Confirm action';
    fixture.componentInstance.isOpen = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const closeButton = (fixture.nativeElement as HTMLElement).querySelector('.app-dialog__close') as HTMLButtonElement;
    expect(closeButton).toBeTruthy();

    closeButton.focus();
    closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(closeButton);

    closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    expect(document.activeElement).toBe(closeButton);
  });

  it('should close on Escape and restore focus to the trigger element', async () => {
    const fixture = TestBed.createComponent(Dialog);
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    (fixture.componentInstance as any).returnFocusTo = trigger;
    fixture.componentInstance.title = 'Confirm action';
    fixture.componentInstance.isOpen = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = (fixture.nativeElement as HTMLElement).querySelector('[role="dialog"]') as HTMLElement;
    expect(panel).toBeTruthy();

    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('should have no automatically detectable accessibility violations while open', async () => {
    const fixture = TestBed.createComponent(Dialog);
    fixture.componentInstance.title = 'Confirm action';
    fixture.componentInstance.isOpen = true;
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
