import { TestBed } from '@angular/core/testing';
import { Contact } from './contact';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Contact', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Contact] }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Contact);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the contact form', async () => {
    const fixture = TestBed.createComponent(Contact);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('form')).toBeTruthy();
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Contact);
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
