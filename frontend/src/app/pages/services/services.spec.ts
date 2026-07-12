import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Services } from './services';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Services', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Services],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render one h1 and sequential h2 headings', async () => {
    const fixture = TestBed.createComponent(Services);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.querySelectorAll('h2')).toHaveLength(2);
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Services);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
