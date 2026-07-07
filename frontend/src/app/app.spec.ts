import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { expectNoA11yViolations } from '../testing/axe';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a skip link that targets main content', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const skip = (fixture.nativeElement as HTMLElement).querySelector(
      'a.usa-skipnav',
    ) as HTMLAnchorElement | null;
    expect(skip?.getAttribute('href')).toBe('#main-content');
  });

  it('should expose banner, main and contentinfo landmarks', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('header')).toBeTruthy();
    expect(el.querySelector('main#main-content')).toBeTruthy();
    expect(el.querySelector('footer')).toBeTruthy();
  });

  it('should have no automatically detectable accessibility violations', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
