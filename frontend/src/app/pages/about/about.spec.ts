import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { About } from './about';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('About', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render one h1 and an accessible data table structure', async () => {
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    const table = host.querySelector('table');

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(table?.querySelector('caption')).toBeTruthy();
    expect(table?.querySelectorAll('thead th[scope="col"]').length).toBeGreaterThan(0);
    expect(table?.querySelectorAll('tbody th[scope="row"]').length).toBeGreaterThan(0);
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
