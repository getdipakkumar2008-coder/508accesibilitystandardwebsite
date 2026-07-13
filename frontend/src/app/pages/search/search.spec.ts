import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { Search, SEARCH_ITEMS } from './search';
import { expectNoA11yViolations } from '../../../testing/axe';

const activatedRouteStub = {
  snapshot: { queryParamMap: convertToParamMap({}) },
  queryParamMap: of(convertToParamMap({})),
};

describe('Search', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Search],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Search);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a single h1 heading', () => {
    const fixture = TestBed.createComponent(Search);
    fixture.detectChanges();
    const h1s = (fixture.nativeElement as HTMLElement).querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
  });

  it('should include the combobox with the site search dataset', () => {
    const fixture = TestBed.createComponent(Search);
    fixture.detectChanges();
    const comboboxInput = (fixture.nativeElement as HTMLElement).querySelector(
      'app-combobox input[role="combobox"]',
    );
    expect(comboboxInput).toBeTruthy();
    expect(fixture.componentInstance.searchItems).toHaveLength(SEARCH_ITEMS.length);
  });

  it('should include a polite aria-live region from the combobox', () => {
    const fixture = TestBed.createComponent(Search);
    fixture.detectChanges();
    const liveRegion = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();
  });

  it('should pre-populate the combobox from the q query param', () => {
    const routeWithQuery = {
      snapshot: { queryParamMap: convertToParamMap({ q: 'accessibility' }) },
      queryParamMap: of(convertToParamMap({ q: 'accessibility' })),
    };
    TestBed.overrideProvider(ActivatedRoute, { useValue: routeWithQuery });
    const fixture = TestBed.createComponent(Search);
    fixture.detectChanges();

    expect(fixture.componentInstance.initialQuery).toBe('accessibility');
    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'app-combobox input',
    ) as HTMLInputElement;
    expect(input?.value).toBe('accessibility');
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(Search);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
