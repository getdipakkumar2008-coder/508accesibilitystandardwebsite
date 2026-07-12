import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';
import { expectNoA11yViolations } from '../../../testing/axe';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Home);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a single h1 and sequential section headings', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('h1')).toHaveLength(1);

    const h2s = Array.from(host.querySelectorAll('h2')).map((heading) => heading.textContent?.trim());
    expect(h2s).toEqual(['Quick links', 'Search this site']);
  });

  it('should include an accessible search landmark and polite live region', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    const searchForm = host.querySelector('form[role="search"]');
    const searchInput = host.querySelector('#home-search-input');
    const searchLabel = host.querySelector('label[for="home-search-input"]');
    const liveRegion = host.querySelector('[aria-live="polite"]');

    expect(searchForm).toBeTruthy();
    expect(searchInput).toBeTruthy();
    expect(searchLabel).toBeTruthy();
    expect(liveRegion).toBeTruthy();
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
